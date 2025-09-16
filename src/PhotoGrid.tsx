import { useMemo } from "react";
import Masonry from "react-masonry-css";
import { Link, useParams } from "react-router-dom";
import { usePhotosStore } from "./store/photosStore";

const PhotoGrid = () => {
	const { albumId } = useParams<{ albumId: string }>();
	const allPhotos = usePhotosStore((s) => s.photos);
	const photos = useMemo(
		() => allPhotos.filter((p) => p.albumId === albumId),
		[allPhotos, albumId],
	);

	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		500: 1,
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>Photos in Album {albumId}</h1>
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className="my-masonry-grid"
				columnClassName="my-masonry-grid_column"
			>
				{photos.map((p) => (
					<Link key={p.id} to={`/photos/${p.id}`}>
						<img src={p.url} alt={p.title} style={{ width: "100%" }} />
					</Link>
				))}
			</Masonry>
		</div>
	);
};

export default PhotoGrid;
