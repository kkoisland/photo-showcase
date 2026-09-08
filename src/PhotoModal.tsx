import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminS3 } from "./adminS3Context";
import ConfirmModal from "./components/ConfirmModal";
import SnackBar from "./components/SnackBar";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";
import { useUIStore } from "./store/uiStore";

const PhotoModal = () => {
	const { photoId } = useParams<{ photoId: string }>();
	const allPhotos = usePhotosStore((s) => s.photos);
	const navigate = useNavigate();
	const removePhoto = usePhotosStore((s) => s.removePhoto);
	const showSnack = useUIStore((s) => s.showSnack);
	const adminS3 = useAdminS3();
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Sort date ascending
	const sortedPhotos = [...allPhotos].sort((a, b) =>
		(a.date ?? "") > (b.date ?? "") ? 1 : -1,
	);

	const currentIndex = sortedPhotos.findIndex((p) => p.id === photoId);
	const photo = sortedPhotos[currentIndex];
	const prevPhoto = currentIndex > 0 ? sortedPhotos[currentIndex - 1] : null;
	const nextPhoto =
		currentIndex < sortedPhotos.length - 1
			? sortedPhotos[currentIndex + 1]
			: null;

	if (!photo) {
		return (
			<div className="p-5">
				<p>Photo not found.</p>
				<Link to="/">← Back to Albums</Link>
			</div>
		);
	}

	const handleDeleteConfirm = async () => {
		if (!adminS3 || isDeleting) return;
		setIsDeleting(true);
		try {
			await adminS3.deletePhoto(photo);
			removePhoto(photo.id);
			showSnack({ type: "success", message: "Photo deleted" });
			setShowDeleteConfirm(false);
			if (nextPhoto) navigate(`/photos/${nextPhoto.id}`);
			else if (prevPhoto) navigate(`/photos/${prevPhoto.id}`);
			else navigate(`/albums/${photo.albumId}`);
		} catch (error) {
			console.error(error);
			showSnack({
				type: "error",
				message: "Failed to delete photo. Please try again.",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const handleSetCoverPhoto = () => {
		const { albums, updateAlbum } = useAlbumsStore.getState();
		const album = albums.find((a) => a.id === photo.albumId);
		if (!album) return;
		updateAlbum({ ...album, coverPhotoId: photo.id });
		showSnack({
			type: "success",
			message: "Photo set as album cover",
		});
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center modal-overlay">
			<div className="absolute top-5 right-5 flex items-center gap-4">
				{import.meta.env.DEV && (
					<>
						<span>
							<button type="button" onClick={() => setShowDeleteConfirm(true)}>
								Delete
							</button>
						</span>
						<span>
							<button type="button" onClick={handleSetCoverPhoto}>
								Set as album cover
							</button>
						</span>
					</>
				)}
				<button
					type="button"
					onClick={() => navigate(`/albums/${photo.albumId}`)}
					className="text-2xl"
				>
					✕
				</button>
			</div>

			{prevPhoto && (
				<Link
					to={`/photos/${prevPhoto.id}`}
					className="absolute left-5 text-3xl select-none"
				>
					‹
				</Link>
			)}

			{photo.type === "photo" && (
				<img
					src={photo.url}
					alt={photo.title}
					className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
				/>
			)}
			{photo.type === "video" && (
				<video
					controls
					muted
					src={photo.url}
					className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
				/>
			)}

			{nextPhoto && (
				<Link
					to={`/photos/${nextPhoto.id}`}
					className="absolute right-5 text-3xl select-none"
				>
					›
				</Link>
			)}
			{import.meta.env.DEV && showDeleteConfirm && (
				<ConfirmModal
					title="Delete this photo?"
					confirmLabel={isDeleting ? "Deleting..." : "Delete"}
					cancelLabel="Cancel"
					danger
					onConfirm={handleDeleteConfirm}
					onCancel={() => setShowDeleteConfirm(false)}
				/>
			)}
			<SnackBar />
		</div>
	);
};

export default PhotoModal;
