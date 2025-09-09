// PhotoGrid.tsx 修正版

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { usePhotosStore } from "./store/photosStore";

const PhotoGrid = () => {
	const { albumId } = useParams<{ albumId: string }>();
	const allPhotos = usePhotosStore((s) => s.photos);
	const photos = useMemo(
		() => allPhotos.filter((p) => p.albumId === albumId),
		[allPhotos, albumId],
	);

	return (
		<div style={{ padding: 20 }}>
			<h1>Photos in Album {albumId}</h1>
			<div
				style={{
					display: "grid",
					gap: 12,
					gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
				}}
			>
				{photos.map((p) => (
					<Link key={p.id} to={`/photos/${p.id}`}>
						<img
							src={p.url}
							alt={p.title}
							style={{ width: "100%", borderRadius: 8 }}
						/>
					</Link>
				))}
			</div>
			<div style={{ marginTop: 20 }}>
				<Link to="/">← Back to Albums</Link>
			</div>
		</div>
	);
};

export default PhotoGrid;
