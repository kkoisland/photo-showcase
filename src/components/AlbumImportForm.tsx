import { useState } from "react";
import albumUtils from "./albumUtils";

interface Props {
	openType: "new" | "existing";
	albumId: string;
	onCancel: () => void;
}
const AlbumImportForm = ({ openType, albumId, onCancel }: Props) => {
	const [title, setTitle] = useState("no title");
	const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;

		await albumUtils.importPhotos(files, albumId, openType, title);

		onCancel();
	};
	return (
		<div>
			{openType === "new" && (
				<label className="block mb-1 text-sm font-medium">
					Album title
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Enter album title"
						className="border rounded px-2 py-1 mb-4 w-full"
					/>
				</label>
			)}
			<label className="block mb-1 text-sm font-medium">
				Select photos or videos
				<input
					type="file"
					accept=".jpg,.jpeg,.png,.mp4,.mov"
					multiple
					onChange={handleFileImport}
				/>
			</label>
		</div>
	);
};

export default AlbumImportForm;
