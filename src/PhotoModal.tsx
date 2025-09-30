import { Link, useNavigate, useParams } from "react-router-dom";
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
	const handleDelete = () => {
		removePhoto(photo.id);
		showSnack({
			type: "success",
			message: "Photo deleted",
		});
		if (nextPhoto) navigate(`/photos/${nextPhoto.id}`);
		else if (prevPhoto) navigate(`/photos/${prevPhoto.id}`);
		else navigate(`/albums/${photo.albumId}`);
	};

	const handleCoverUrl = () => {
		const { albums, updateAlbum } = useAlbumsStore.getState();
		const album = albums.find((a) => a.id === photo.albumId);
		if (!album) return;
		updateAlbum({ ...album, coverUrl: photo.url });
		showSnack({
			type: "success",
			message: "Photo set as album cover",
		});
	};

	return (
		<div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
			<div className="absolute top-5 right-5 flex items-center gap-4 text-white text-sm">
				<span>
					<button type="button" onClick={handleDelete}>
						Delete
					</button>
				</span>
				<span>
					<button type="button" onClick={handleCoverUrl}>
						Set as album cover
					</button>
				</span>
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
					className="absolute left-5 text-white text-3xl select-none"
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
					className="absolute right-5 text-white text-3xl select-none"
				>
					›
				</Link>
			)}
			<SnackBar />
		</div>
	);
};

export default PhotoModal;
