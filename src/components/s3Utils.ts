import {
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { useAlbumsStore } from "../store/albumsStore";
import { usePhotosStore } from "../store/photosStore";
import type { Album, Photo } from "../types";

const region = import.meta.env.VITE_AWS_REGION;
const bucket = import.meta.env.VITE_AWS_S3_BUCKET;

const s3 = new S3Client({
	region,
	credentials: {
		accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
		secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
	},
});

const publicUrlFor = (key: string) =>
	`http://${bucket}.s3-website-${region}.amazonaws.com/${key}`;

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

const uploadPhoto = async (photo: Photo): Promise<string> => {
	const ext = guessExtension(photo);
	const key = `photos/${photo.id}.${ext}`;

	if (await objectExists(key)) {
		return publicUrlFor(key);
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
	return publicUrlFor(key);
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
		}),
	);
};

export const publishToS3 = async (): Promise<{
	photoCount: number;
	skippedCount: number;
}> => {
	const albums = useAlbumsStore.getState().albums;
	const photos = usePhotosStore.getState().photos;

	const photoUrlById = new Map<string, string>();
	let skippedCount = 0;
	for (const photo of photos) {
		try {
			const url = await uploadPhoto(photo);
			photoUrlById.set(photo.id, url);
		} catch (error) {
			console.error(`Skipped photo "${photo.title}" (${photo.id}):`, error);
			skippedCount++;
		}
	}

	const uploadedPhotos: Photo[] = photos
		.filter((p) => photoUrlById.has(p.id))
		.map((p) => ({ ...p, url: photoUrlById.get(p.id) ?? p.url }));

	const uploadedAlbums: Album[] = albums.map((album) => {
		const originalCoverPhoto = photos.find((p) => p.url === album.coverUrl);
		const fallbackPhoto = photos.find((p) => p.albumId === album.id);
		const coverPhotoId = originalCoverPhoto?.id ?? fallbackPhoto?.id;
		return {
			...album,
			coverUrl: coverPhotoId
				? (photoUrlById.get(coverPhotoId) ?? album.coverUrl)
				: album.coverUrl,
		};
	});

	await uploadManifest({ albums: uploadedAlbums, photos: uploadedPhotos });

	return { photoCount: uploadedPhotos.length, skippedCount };
};
