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
		const allFiles = Array.from(e.target.files ?? []);
		const validFiles = allFiles.filter((file) =>
			/\.(jpe?g|png|mp4|mov)$/i.test(file.name),
		);
		const skippedFiles = allFiles.filter((file) => !validFiles.includes(file));
		const newPhotos: Photo[] = await Promise.all(
			validFiles.map(async (file) => {
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
				};
			}),
		);

		if (openType === "new") {
			const album: Album = {
				id: albumId,
				title: title || "no album title yet",
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
			const album = useAlbumsStore
				.getState()
				.albums.find((a) => a.id === albumId);
			const existingPhotoIds = album ? album.photoIds : [];

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
			newPhotos.forEach((p) => {
				usePhotosStore.getState().addPhoto(p);
			});

			setIsOpen(false);
		}
		if (skippedFiles.length > 0) {
			// ToDo: change to snakbar
			alert(`Skipped files: ${skippedFiles.map((f) => f.name).join(", ")}`);
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
