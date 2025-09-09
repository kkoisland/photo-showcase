import { Link } from "react-router-dom";
import ImportDialog from "./components/ImportDialog";
import { useAlbumsStore } from "./store/albumsStore";

const AlbumGrid = () => {
	const albums = useAlbumsStore((s) => s.albums);
	return (
		<div style={{ padding: 20 }}>
			<h1>Albums</h1>
			<ImportDialog />
			<ul
				style={{
					display: "grid",
					gap: "12px",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
				}}
			>
				{albums.map((a) => (
					<li key={a.id} style={{ padding: 10 }}>
						<Link to={`/albums/${a.id}`}>{a.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AlbumGrid;
