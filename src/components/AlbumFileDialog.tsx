import * as exifr from "exifr";
import JSZip from "jszip";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useAlbumsStore } from "../store/albumsStore";
import { usePhotosStore } from "../store/photosStore";
import type { Album, Photo } from "../types";
import ConfirmModal from "./ConfirmModal";

interface Props {
	openType: "new" | "existing" | "export";
	currentAlbumId?: string;
}

const AlbumFileDialog = ({ openType, currentAlbumId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const albumId = currentAlbumId ?? uuid();
	const album = useAlbumsStore.getState().albums.find((a) => a.id === albumId);
	const [title, setTitle] = useState(album?.title || "no title");
	const existingPhotos = album
		? album.photoIds.map((id) =>
				usePhotosStore.getState().photos.find((p) => p.id === id),
			)
		: [];

	const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const allFiles = Array.from(e.target.files ?? []);
		const validFiles = allFiles.filter((file) =>
			/\.(jpe?g|png|mp4|mov)$/i.test(file.name),
		);

		// Calculate the hash of each file
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

		const duplicateFiles = fileHashes
			.filter(({ hash }) => existingPhotos.some((p) => p?.hash === hash))
			.map(({ file }) => file);

		const skippedFiles = allFiles.filter((file) => !validFiles.includes(file));

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

		if (openType === "new") {
			const album: Album = {
				id: albumId,
				title: title || "no album title",
				photoIds: newPhotos.map((p) => p.id),
				coverUrl: newPhotos[0].url,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			useAlbumsStore.getState().addAlbum(album);
			newPhotos.forEach((p) => {
				usePhotosStore.getState().addPhoto(p);
			});
			setIsOpen(false);
		} else if (openType === "existing" && albumId) {
			const existingPhotoIds = existingPhotos
				.map((p) => p?.id)
				.filter((id): id is string => Boolean(id));

			const mergedPhotoIds = [
				...existingPhotoIds,
				...newPhotos.map((p) => p.id),
			];
			if (album) {
				useAlbumsStore.getState().updateAlbum({
					...album,
					photoIds: mergedPhotoIds,
					updatedAt: new Date().toISOString(),
				});
			}
			newPhotos
				.filter((p) => !duplicateFiles.some((f) => f.name === p.title))
				.forEach((p) => {
					usePhotosStore.getState().addPhoto(p);
				});

			setIsOpen(false);
		}

		if (skippedFiles.length > 0 || duplicateFiles.length > 0) {
			// ToDo: change to snackbar
			alert(
				[
					skippedFiles.length > 0
						? `Skipped files: ${skippedFiles.map((f) => f.name).join(", ")}`
						: null,
					duplicateFiles.length > 0
						? `Duplicate files: ${duplicateFiles.map((f) => f.name).join(", ")}`
						: null,
				]
					.filter(Boolean)
					.join("\n"),
			);
		}
	};

	const handleExport = async () => {
		if (openType !== "export" || !album) return;

		const zip = new JSZip();
		zip.file("album.json", JSON.stringify(album, null, 2));

		for (const photo of existingPhotos) {
			if (photo?.url) {
				const blob = await fetch(photo.url).then((r) => r.blob());
				zip.file(photo.title, blob);
			}
		}

		const content = await zip.generateAsync({ type: "blob" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(content);
		link.download = `${album.title || "album"}.zip`;
		link.click();
	};

	return (
		<>
			{openType === "export" ? (
				<button type="button" onClick={handleExport}>
					Export this album as zip
				</button>
			) : openType === "new" ? (
				<button type="button" onClick={() => setIsOpen(true)}>
					Import new photos
				</button>
			) : (
				<button type="button" onClick={() => setIsOpen(true)}>
					Import more photos
				</button>
			)}

			{isOpen && (
				<ConfirmModal
					title="Import Photos"
					cancelLabel="Cancel"
					onCancel={() => setIsOpen(false)}
					description={
						<div>
							<label className="block mb-1 text-sm font-medium">
								Album title
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Enter album title"
									className="border rounded px-2 py-1 mb-4 w-full"
								/>{" "}
							</label>
							<label className="block mb-1 text-sm font-medium">
								Select photos or videos
								<input
									type="file"
									accept=".jpg,.jpeg,.png,.mp4,.mov"
									multiple
									onChange={handleFileImport}
								/>
							</label>
						</div>
					}
				/>
			)}
		</>
	);
};

export default AlbumFileDialog;
