import { useState } from "react";
import { useAlbumsStore } from "../store/albumsStore";
import type { Album } from "../types";
import ConfirmModal from "./ConfirmModal";

interface EditorProps {
	album: Album;
	onClose: () => void;
}

const AlbumDateEditor = ({ album, onClose }: EditorProps) => {
	const updateAlbum = useAlbumsStore((s) => s.updateAlbum);
	const [startDate, setStartDate] = useState(album.startDate ?? "");
	const [endDate, setEndDate] = useState(album.endDate ?? "");

	const handleSave = () => {
		updateAlbum({ ...album, startDate, endDate });
		onClose();
	};

	return (
		<ConfirmModal
			title="Edit date"
			cancelLabel="Cancel"
			onCancel={() => onClose()}
			confirmLabel="Save"
			onConfirm={handleSave}
			description={
				<>
					<p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
						Please enter either a start date only, or both a start and end date.
					</p>
					<label className="block mb-2 text-sm">
						Start date:
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="border rounded p-1 w-full mt-1 bg-white dark:bg-gray-700 dark:text-white"
						/>
					</label>
					<label className="block mb-4 text-sm">
						End date:
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="border rounded p-1 w-full mt-1 bg-white dark:bg-gray-700 dark:text-white"
						/>
					</label>
				</>
			}
		/>
	);
};

export default AlbumDateEditor;
