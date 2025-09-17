import { Link, useNavigate, useParams } from "react-router-dom";
import { usePhotosStore } from "./store/photosStore";

const PhotoModal = () => {
	const { photoId } = useParams<{ photoId: string }>();
	const allPhotos = usePhotosStore((s) => s.photos);
	const navigate = useNavigate();

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
			<div className="p-5 text-white">
				<p>Photo not found.</p>
				<Link to="/">← Back to Albums</Link>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
			<button
				type="button"
				onClick={() => navigate(`/albums/${photo.albumId}`)}
				className="absolute top-5 right-5 text-white text-2xl"
			>
				✕
			</button>
			{prevPhoto && (
				<Link
					to={`/photos/${prevPhoto.id}`}
					className="absolute left-5 text-white text-3xl select-none"
				>
					‹
				</Link>
			)}

			<img
				src={photo.url}
				alt={photo.title}
				className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
			/>

			{nextPhoto && (
				<Link
					to={`/photos/${nextPhoto.id}`}
					className="absolute right-5 text-white text-3xl select-none"
				>
					›
				</Link>
			)}
		</div>
	);
};

export default PhotoModal;
