import * as exifr from "exifr";
import JSZip from "jszip";
import { v4 as uuid } from "uuid";
import { useAlbumsStore } from "../store/albumsStore";
import { usePhotosStore } from "../store/photosStore";
import type { Album, Photo, SkippedPhoto } from "../types";

/**
 * Import files into an album
 * @param files Selected files
 * @param albumId Album ID (pass uuid if creating new)
 * @param openType "new" | "existing"
 * @param uploadPhoto Uploads a photo to S3 and returns its permanent URL (injected by
 *   the caller so this file never imports the AWS-key-loading s3Utils.ts directly —
 *   this module is reachable from the viewer build via AlbumCard.tsx)
 * @param albumTitle Album title for new album
 */

const importPhotos = async (
	files: File[],
	albumId: string,
	openType: "new" | "existing",
	uploadPhoto: (photo: Photo) => Promise<{ key: string; url: string }>,
	albumTitle?: string,
) => {
	const album = useAlbumsStore.getState().albums.find((a) => a.id === albumId);

	const existingPhotos = usePhotosStore
		.getState()
		.photos.filter((p) => p.albumId === albumId);

	// Allow only images and videos
	const validFiles = files.filter((file) =>
		/\.(jpe?g|png|mp4|mov)$/i.test(file.name),
	);

	// Calculate SHA-256 hash
	const fileHashes = await Promise.all(
		validFiles.map(async (file) => {
			const buffer = await file.arrayBuffer();
			const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const hashHex = hashArray
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
			return { file, hash: hashHex };
		}),
	);

	// Remove duplicates within the same import
	const uniqueFileHashes = Array.from(
		new Map(fileHashes.map((f) => [f.hash, f])).values(),
	);

	// Find duplicates with existing album
	const duplicateFiles = fileHashes
		.filter(({ hash }) => existingPhotos.some((p) => p.hash === hash))
		.map(({ file }) => file);

	// Invalid files
	const skippedInvalidFiles = files.filter(
		(file) => !validFiles.includes(file),
	);

	// Generate Photo candidates (a local blob: URL is only used to read bytes for upload)
	const candidates: Photo[] = await Promise.all(
		uniqueFileHashes.map(async ({ file, hash }) => {
			let takenDate: string;
			try {
				const exif = await exifr.parse(file);
				takenDate = exif?.DateTimeOriginal
					? exif.DateTimeOriginal.toISOString()
					: new Date().toISOString();
			} catch {
				takenDate = new Date().toISOString();
			}
			const ext = file.name.split(".").pop()?.toLowerCase();
			const type = ext === "mp4" || ext === "mov" ? "video" : "photo";
			return {
				id: uuid(),
				albumId,
				title: file.name,
				url: URL.createObjectURL(file),
				type,
				date: takenDate,
				hash,
			};
		}),
	);

	// Upload each candidate to S3 immediately; only photos that succeed become
	// part of the album (failures are reported to the caller, not added locally)
	const skippedPhotos: SkippedPhoto[] = [];
	const newPhotos: Photo[] = [];
	for (const candidate of candidates) {
		try {
			const { url } = await uploadPhoto(candidate);
			newPhotos.push({ ...candidate, url });
		} catch (error) {
			skippedPhotos.push({
				title: candidate.title,
				error: error instanceof Error ? error.message : String(error),
			});
		} finally {
			URL.revokeObjectURL(candidate.url);
		}
	}

	// Update album
	if (openType === "new") {
		const newAlbum: Album = {
			id: albumId,
			title: albumTitle || "no album title",
			coverPhotoId: newPhotos[0]?.id,
			hidden: true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		useAlbumsStore.getState().addAlbum(newAlbum);
		newPhotos.forEach((p) => {
			usePhotosStore.getState().addPhoto(p);
		});
	} else if (openType === "existing" && album) {
		useAlbumsStore.getState().updateAlbum({
			...album,
			updatedAt: new Date().toISOString(),
		});

		newPhotos
			.filter((p) => !duplicateFiles.some((f) => f.name === p.title))
			.forEach((p) => {
				usePhotosStore.getState().addPhoto(p);
			});
	}

	return { skippedInvalidFiles, duplicateFiles, skippedPhotos, newPhotos };
};

/**
 * Delete an album together with all photos that belong to it. The S3 delete
 * call happens first; local state is only updated once it succeeds, so a
 * failure (thrown to the caller) leaves everything as-is and safely retryable.
 */
const deleteAlbumWithPhotos = async (
	albumId: string,
	deletePhotos: (photos: Photo[]) => Promise<void>,
): Promise<void> => {
	const album = useAlbumsStore.getState().albums.find((a) => a.id === albumId);
	if (!album) return;

	const { photos } = usePhotosStore.getState();
	const albumPhotos = photos.filter((p) => p.albumId === albumId);

	await deletePhotos(albumPhotos);

	usePhotosStore
		.getState()
		.setPhotos(photos.filter((p) => p.albumId !== albumId));
	useAlbumsStore.getState().removeAlbum(albumId);
};

/**
 * Export album as a zip file
 * @param albumId Album ID
 * @returns Blob | null
 */
const exportAlbum = async (albumId: string): Promise<void> => {
	const album = useAlbumsStore.getState().albums.find((a) => a.id === albumId);
	if (!album) return;

	const photos = usePhotosStore
		.getState()
		.photos.filter((p) => p.albumId === albumId);

	const zip = new JSZip();
	zip.file("album.json", JSON.stringify(album, null, 2));

	for (const photo of photos) {
		const blob = await fetch(photo.url).then((r) => r.blob());
		zip.file(photo.title, blob);
	}

	const content = await zip.generateAsync({ type: "blob" });

	const url = URL.createObjectURL(content);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${album.title || "album"}.zip`;
	a.click();
	URL.revokeObjectURL(url);
};

const albumUtils = {
	importPhotos,
	exportAlbum,
	deleteAlbumWithPhotos,
};
export default albumUtils;
