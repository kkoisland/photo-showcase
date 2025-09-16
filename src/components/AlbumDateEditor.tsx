import { useState } from "react";
import { useAlbumsStore } from "../store/albumsStore";
import type { Album } from "../types";

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
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<div className="bg-white p-6 rounded-xl shadow-lg w-80">
				<h2 className="text-lg font-bold mb-4">日付を編集</h2>
				<label className="block mb-2 text-sm">
					開始日:
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						className="border rounded p-1 w-full mt-1"
					/>
				</label>
				<label className="block mb-4 text-sm">
					終了日:
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						className="border rounded p-1 w-full mt-1"
					/>
				</label>
				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
					>
						キャンセル
					</button>
					<button
						type="button"
						onClick={handleSave}
						className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
					>
						保存
					</button>
				</div>
			</div>
		</div>
	);
};

export default AlbumDateEditor;
