import { useState } from "react";
import { v4 as uuid } from "uuid";
import AlbumCard from "./AlbumCard";
import AlbumImportForm from "./components/AlbumImportForm";
import ConfirmModal from "./components/ConfirmModal";
import { useAlbumsStore } from "./store/albumsStore";

const AlbumGrid = () => {
	const albums = useAlbumsStore((s) => s.albums);
	const [showDialog, setShowDialog] = useState(false);
	const newAlbumId = uuid();

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
				<ConfirmModal
					title="Import Photos"
					cancelLabel="Cancel"
					onCancel={() => setShowDialog(false)}
					description={
						<AlbumImportForm
							openType="new"
							onCancel={() => setShowDialog(false)}
							albumId={newAlbumId}
						/>
					}
				/>
			)}
		</div>
	);
};

export default AlbumGrid;
