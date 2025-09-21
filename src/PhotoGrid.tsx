import { useMemo } from "react";
import Masonry from "react-masonry-css";
import { Link, useParams } from "react-router-dom";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";

const PhotoGrid = () => {
	const { albumId } = useParams<{ albumId: string }>();
	const allPhotos = usePhotosStore((s) => s.photos);
	const album = useAlbumsStore((s) => s.albums.find((a) => a.id === albumId));
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
		</div>
	);
};

export default PhotoGrid;
