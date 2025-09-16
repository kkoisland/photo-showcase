import AlbumCard from "./AlbumCard";
import ImportDialog from "./components/ImportDialog";
import { useAlbumsStore } from "./store/albumsStore";

const AlbumGrid = () => {
	const albums = useAlbumsStore((s) => s.albums);
	return (
		<div style={{ padding: 20 }}>
			<h1>Albums</h1>
			<ImportDialog />
			<div
				style={{
					display: "grid",
					gap: 12,
					gridTemplateColumns: "repeat(auto-fill, minmax(221px, auto))",
				}}
			>
				{albums.map((a) => (
					<AlbumCard album={a} key={a.id} />
				))}
			</div>
		</div>
	);
};

export default AlbumGrid;
