import { useState } from "react";
import AlbumCard from "./AlbumCard";
import AlbumImportNewDialog from "./components/AlbumImportNewDialog";
import { useAlbumsStore } from "./store/albumsStore";

const AlbumGrid = () => {
	const albums = useAlbumsStore((s) => s.albums);
	const [showDialog, setShowDialog] = useState(false);

	return (
		<div style={{ padding: 20 }}>
			<div className="flex items-center mb-4">
				<h1 className="text-2xl font-bold">Albums</h1>
				<div className="ml-2">
					<button
						type="button"
						onClick={() => setShowDialog(true)}
						className="px-3 py-1 rounded"
					>
						Import new album
					</button>
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

			{showDialog && (
				<AlbumImportNewDialog onCancel={() => setShowDialog(false)} />
			)}
		</div>
	);
};

export default AlbumGrid;
