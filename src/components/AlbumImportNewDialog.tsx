import { useState } from "react";
import { v4 as uuid } from "uuid";
import albumUtils from "./albumUtils";
import ConfirmModal from "./ConfirmModal";

interface Props {
	onCancel: () => void;
}

const AlbumImportNewDialog = ({ onCancel }: Props) => {
	const albumId = uuid();
	const [title, setTitle] = useState("no title");

	const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;

		await albumUtils.importPhotos(files, albumId, "new", title);

		onCancel();
	};

	return (
		<ConfirmModal
			title="Import Photos"
			cancelLabel="Cancel"
			onCancel={onCancel}
			description={
				<div>
					<label className="block mb-1 text-sm font-medium">
						Album title
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter album title"
							className="border rounded px-2 py-1 mb-4 w-full"
						/>{" "}
					</label>
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
			}
		/>
	);
};

export default AlbumImportNewDialog;
