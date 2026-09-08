import {
	DeleteObjectsCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { useAlbumsStore } from "../store/albumsStore";
import { usePhotosStore } from "../store/photosStore";
import type { Album, Photo, SkippedPhoto } from "../types";
import { publicUrlFor } from "./publicUrls";

const region = import.meta.env.VITE_AWS_REGION;
const bucket = import.meta.env.VITE_AWS_S3_BUCKET;

const s3 = new S3Client({
	region,
	credentials: {
		accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
		secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
	},
});

export { publicUrlFor };

const objectExists = async (key: string): Promise<boolean> => {
	try {
		await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
		return true;
	} catch {
		return false;
	}
};

const KNOWN_EXTENSIONS = new Set(["jpg", "jpeg", "png", "mp4", "mov"]);

const guessExtension = (photo: Photo) => {
	const candidate = photo.title.split(".").pop()?.toLowerCase();
	if (candidate && KNOWN_EXTENSIONS.has(candidate)) return candidate;
	return photo.type === "video" ? "mp4" : "jpg";
};

const guessContentType = (ext: string) => {
	if (ext === "png") return "image/png";
	if (ext === "mp4") return "video/mp4";
	if (ext === "mov") return "video/quicktime";
	return "image/jpeg";
};

export const uploadPhoto = async (
	photo: Photo,
): Promise<{ key: string; url: string }> => {
	const ext = guessExtension(photo);
	const key = `photos/${photo.id}.${ext}`;

	if (await objectExists(key)) {
		return { key, url: publicUrlFor(key) };
	}

	const arrayBuffer = await fetch(photo.url).then((r) => r.arrayBuffer());
	await s3.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: new Uint8Array(arrayBuffer),
			ContentType: guessContentType(ext),
		}),
	);
	return { key, url: publicUrlFor(key) };
};

const deleteOrphanedPhotos = async (
	currentKeys: Set<string>,
): Promise<number> => {
	const listed = await s3.send(
		new ListObjectsV2Command({ Bucket: bucket, Prefix: "photos/" }),
	);
	const orphanedKeys = (listed.Contents ?? [])
		.map((o) => o.Key)
		.filter((key): key is string => key !== undefined && !currentKeys.has(key));

	if (orphanedKeys.length === 0) return 0;

	await s3.send(
		new DeleteObjectsCommand({
			Bucket: bucket,
			Delete: { Objects: orphanedKeys.map((Key) => ({ Key })) },
		}),
	);
	return orphanedKeys.length;
};

const uploadManifest = async (manifest: {
	albums: Album[];
	photos: Photo[];
}) => {
	await s3.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: "manifest.json",
			Body: JSON.stringify(manifest, null, 2),
			ContentType: "application/json",
			CacheControl: "no-cache",
		}),
	);
};

export const publishToS3 = async (): Promise<{
	photoCount: number;
	skippedPhotos: SkippedPhoto[];
	deletedCount: number;
}> => {
	const albums = useAlbumsStore.getState().albums;
	const photos = usePhotosStore.getState().photos;

	const photoUrlById = new Map<string, string>();
	const currentKeys = new Set<string>();
	const skippedPhotos: SkippedPhoto[] = [];
	for (const photo of photos) {
		try {
			const { key, url } = await uploadPhoto(photo);
			photoUrlById.set(photo.id, url);
			currentKeys.add(key);
		} catch (error) {
			console.error(`Skipped photo "${photo.title}" (${photo.id}):`, error);
			skippedPhotos.push({
				title: photo.title,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	const uploadedPhotos: Photo[] = photos
		.filter((p) => photoUrlById.has(p.id))
		.map((p) => ({ ...p, url: photoUrlById.get(p.id) ?? p.url }));

	// Hidden albums keep their photo files on S3 (uploaded above) but are left
	// out of manifest.json, so they never show up for viewers.
	const visibleAlbums = albums.filter((a) => !a.hidden);
	const visibleAlbumIds = new Set(visibleAlbums.map((a) => a.id));
	const manifestPhotos = uploadedPhotos.filter((p) =>
		visibleAlbumIds.has(p.albumId),
	);

	const manifestAlbums: Album[] = visibleAlbums.map((album) => {
		const coverStillExists =
			album.coverPhotoId !== undefined && photoUrlById.has(album.coverPhotoId);
		const fallbackPhoto = manifestPhotos.find((p) => p.albumId === album.id);
		return {
			...album,
			coverPhotoId: coverStillExists ? album.coverPhotoId : fallbackPhoto?.id,
		};
	});

	await uploadManifest({ albums: manifestAlbums, photos: manifestPhotos });

	let deletedCount = 0;
	try {
		deletedCount = await deleteOrphanedPhotos(currentKeys);
	} catch (error) {
		console.error("Failed to clean up orphaned photos:", error);
	}

	return { photoCount: manifestPhotos.length, skippedPhotos, deletedCount };
};
