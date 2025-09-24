import { useState } from "react";
import type { Snack } from "../types";
import albumUtils from "./albumUtils";

interface Props {
	openType: "new" | "existing";
	albumId: string;
	onCancel: () => void;
	setSnack?: React.Dispatch<React.SetStateAction<Snack | null>>;
}
const AlbumImportForm = ({ openType, albumId, onCancel, setSnack }: Props) => {
	const [title, setTitle] = useState("no title");
	const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;

		const { skippedInvalidFiles, duplicateFiles } =
			await albumUtils.importPhotos(files, albumId, openType, title);

		onCancel();

		if (skippedInvalidFiles.length > 0 && setSnack) {
			const names = skippedInvalidFiles.map((f) => f.name).join(", ");
			setSnack({
				type: "warning",
				message: `${skippedInvalidFiles.length} invalid files skipped: ${names}`,
			});
		}
		if (duplicateFiles.length > 0 && setSnack) {
			const names = duplicateFiles.map((f) => f.name).join(", ");
			setSnack({
				type: "info",
				message: `${duplicateFiles.length} duplicate files ignored: ${names}`,
			});
		}
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
