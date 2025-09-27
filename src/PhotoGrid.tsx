import { useMemo } from "react";
import Masonry from "react-masonry-css";
import { Link, useParams } from "react-router-dom";
import handleCopyToClipboard from "./components/copyToClipboard";
import SnackBar from "./components/SnackBar";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";
import { useUIStore } from "./store/uiStore";

const PhotoGrid = () => {
	const { albumId } = useParams<{ albumId: string }>();
	const allPhotos = usePhotosStore((s) => s.photos);
	const album = useAlbumsStore((s) => s.albums.find((a) => a.id === albumId));
	const showSnack = useUIStore((s) => s.showSnack);
	const photos = useMemo(() => {
		return allPhotos
			.filter((p) => p.albumId === albumId)
			.sort((a, b) => ((a.date ?? "") > (b.date ?? "") ? 1 : -1));
	}, [allPhotos, albumId]);

	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		500: 1,
	};

	return (
		<div style={{ padding: 20 }}>
			<h1 className="text-2xl font-bold mb-2">
				{album ? album?.title : "Photos in Album"}
			</h1>
			{album?.sharedUrl && (
				<div className="mb-2">
					<span>Shared Link: </span>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							const sharedUrl = album.sharedUrl;
							if (sharedUrl) handleCopyToClipboard(sharedUrl);
							showSnack({
								type: "info",
								message: "Link copied to clipboard",
							});
						}}
						className="underline text-blue-600"
					>
						{album?.sharedUrl}
					</button>
				</div>
			)}
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className="my-masonry-grid"
				columnClassName="my-masonry-grid_column"
			>
				{photos.map((p) => (
					<Link key={p.id} to={`/photos/${p.id}`}>
						{p.type === "video" && p.title.toLowerCase().endsWith(".mov") ? (
							<div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
								<span className="text-gray-500">
									.mov file — Not supported yet
								</span>
							</div>
						) : p.type === "video" ? (
							<video src={p.url} muted playsInline className="w-full rounded" />
						) : (
							<img src={p.url} alt={p.title} className="w-full rounded" />
						)}
					</Link>
				))}
			</Masonry>
			<SnackBar />
		</div>
	);
};

export default PhotoGrid;
