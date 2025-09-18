import AlbumCard from "./AlbumCard";
import AlbumFileDialog from "./components/AlbumFileDialog";
import { useAlbumsStore } from "./store/albumsStore";

const AlbumGrid = () => {
	const albums = useAlbumsStore((s) => s.albums);
	return (
		<div style={{ padding: 20 }}>
			<div className="flex items-center mb-4">
				<h1 className="text-2xl font-bold">Albums</h1>
				<div className="ml-2">
					<AlbumFileDialog openType={"new"} />
				</div>
			</div>

			<div
				style={{
					display: "grid",
					margin: 6,
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
