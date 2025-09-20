import * as exifr from "exifr";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useAlbumsStore } from "../store/albumsStore";
import { usePhotosStore } from "../store/photosStore";
import type { Album, Photo } from "../types";

interface Props {
	openType: "new" | "existing" | "export";
	currentAlbumId?: string;
}

const AlbumFileDialog = ({ openType, currentAlbumId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");

	const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const albumId = currentAlbumId ?? uuid();
		const album = useAlbumsStore
			.getState()
			.albums.find((a) => a.id === albumId);
		const existingPhotos = album
			? album.photoIds.map((id) =>
					usePhotosStore.getState().photos.find((p) => p.id === id),
				)
			: [];

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
				return {
					id: uuid(),
					albumId,
					title: file.name,
					url: URL.createObjectURL(file),
					type: "photo",
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

	return (
		<>
			<button type="button" onClick={() => setIsOpen(true)}>
				Import
			</button>
			{isOpen && (
				// biome-ignore lint: false positive
				<div
					role="button"
					tabIndex={0}
					className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
					onClick={(e) => {
						setIsOpen(false);
						e.stopPropagation();
					}}
				>
					{/* biome-ignore lint: false positive */}
					<div
						className="bg-white p-6 rounded-xl shadow-lg w-80"
						onClick={(e) => e.stopPropagation()}
					>
						<h5 className="text-lg font-bold mb-4">Import Photos</h5>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Album title"
							className="border rounded px-2 py-1 mb-4 w-full"
						/>
						<input
							type="file"
							accept=".jpg,.jpeg,.png,.mp4,.mov"
							multiple
							onChange={handleFileImport}
						/>
						<div className="flex justify-end mt-4">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AlbumFileDialog;
