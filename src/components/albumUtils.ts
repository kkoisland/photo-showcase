import * as exifr from "exifr";
import JSZip from "jszip";
import { v4 as uuid } from "uuid";
import { useAlbumsStore } from "../store/albumsStore";
import { usePhotosStore } from "../store/photosStore";
import type { Album, Photo } from "../types";

/**
 * Import files into an album
 * @param files Selected files
 * @param albumId Album ID (pass uuid if creating new)
 * @param openType "new" | "existing"
 * @param albumTitle Album title for new album
 */

const importPhotos = async (
	files: File[],
	albumId: string,
	openType: "new" | "existing",
	albumTitle?: string,
) => {
	const album = useAlbumsStore.getState().albums.find((a) => a.id === albumId);

	const existingPhotos = album
		? album.photoIds.map((id) =>
				usePhotosStore.getState().photos.find((p) => p.id === id),
			)
		: [];

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
		.filter(({ hash }) => existingPhotos.some((p) => p?.hash === hash))
		.map(({ file }) => file);

	// Invalid files
	const skippedInvalidFiles = files.filter(
		(file) => !validFiles.includes(file),
	);

	// Generate Photo objects
	const newPhotos: Photo[] = await Promise.all(
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

	// Update album
	if (openType === "new") {
		const newAlbum: Album = {
			id: albumId,
			title: albumTitle || "no album title",
			photoIds: newPhotos.map((p) => p.id),
			coverUrl: newPhotos[0]?.url,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		useAlbumsStore.getState().addAlbum(newAlbum);
		newPhotos.forEach((p) => {
			usePhotosStore.getState().addPhoto(p);
		});
	} else if (openType === "existing" && album) {
		const existingPhotoIds = existingPhotos
			.map((p) => p?.id)
			.filter((id): id is string => Boolean(id));

		const mergedPhotoIds = [...existingPhotoIds, ...newPhotos.map((p) => p.id)];

		useAlbumsStore.getState().updateAlbum({
			...album,
			photoIds: mergedPhotoIds,
			updatedAt: new Date().toISOString(),
		});

		newPhotos
			.filter((p) => !duplicateFiles.some((f) => f.name === p.title))
			.forEach((p) => {
				usePhotosStore.getState().addPhoto(p);
			});
	}

	return { skippedInvalidFiles, duplicateFiles, newPhotos };
};

/**
 * Export album as a zip file
 * @param albumId Album ID
 * @returns Blob | null
 */
const exportAlbum = async (albumId: string): Promise<void> => {
	const album = useAlbumsStore.getState().albums.find((a) => a.id === albumId);
	if (!album) return;

	const photos = album.photoIds
		.map((id) => usePhotosStore.getState().photos.find((p) => p.id === id))
		.filter(Boolean) as Photo[];

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

const albumUtils = { importPhotos, exportAlbum };
export default albumUtils;
