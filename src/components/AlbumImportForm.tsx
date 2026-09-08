import { useId, useState } from "react";
import { useAdminS3 } from "../adminS3Context";
import { useUIStore } from "../store/uiStore";
import type { SkippedPhoto } from "../types";
import albumUtils from "./albumUtils";
import ConfirmModal from "./ConfirmModal";

interface Props {
	openType: "new" | "existing";
	albumId: string;
	onCancel: () => void;
}
const AlbumImportForm = ({ openType, albumId, onCancel }: Props) => {
	const inputId = useId();
	const [title, setTitle] = useState("no title");
	const [isUploading, setIsUploading] = useState(false);
	const [skippedPhotos, setSkippedPhotos] = useState<SkippedPhoto[]>([]);
	const showSnack = useUIStore((s) => s.showSnack);
	const { uploadPhoto } = useAdminS3();
	const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;

		setIsUploading(true);
		const { skippedInvalidFiles, duplicateFiles, skippedPhotos } =
			await albumUtils.importPhotos(
				files,
				albumId,
				openType,
				uploadPhoto,
				title,
			);
		setIsUploading(false);

		onCancel();

		const messages: string[] = [];

		if (skippedInvalidFiles.length > 0) {
			const names = skippedInvalidFiles.map((f) => f.name).join(", ");
			messages.push(
				`${skippedInvalidFiles.length} invalid files skipped: ${names}`,
			);
		}

		if (duplicateFiles.length > 0) {
			const names = duplicateFiles.map((f) => f.name).join(", ");
			messages.push(
				`${duplicateFiles.length} duplicate files ignored: ${names}`,
			);
		}

		if (messages.length > 0) {
			showSnack({
				type: "warning",
				message: messages.join("\n"),
			});
		}

		if (skippedPhotos.length > 0) {
			setSkippedPhotos(skippedPhotos);
		}
	};
	return (
		<div>
			{openType === "new" && (
				<label className="block mb-1 text-sm font-medium">
					Enter album title
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="border rounded px-2 py-1 mb-4 w-full"
						disabled={isUploading}
					/>
				</label>
			)}

			<label className="block mb-1 text-sm font-medium">
				Select photos or videos
				<div className="border rounded px-2 py-1 w-full cursor-pointer surface-bg">
					<span className="text-sm">
						{isUploading ? "Uploading..." : "Choose files..."}
					</span>
				</div>
				<input
					id={inputId}
					type="file"
					accept=".jpg,.jpeg,.png,.mp4,.mov"
					multiple
					onChange={handleFileImport}
					className="hidden"
					disabled={isUploading}
				/>
			</label>
			{isUploading && (
				<div
					className="fixed inset-0 z-[9999] flex items-center justify-center"
					style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
				>
					<span className="text-white text-sm">Uploading...</span>
				</div>
			)}
			{skippedPhotos.length > 0 && (
				<ConfirmModal
					title={`${skippedPhotos.length} photo(s) failed to upload`}
					cancelLabel="OK"
					onCancel={() => setSkippedPhotos([])}
					description={
						<ul className="list-disc pl-5">
							{skippedPhotos.map((p) => (
								<li key={p.title}>
									{p.title}: {p.error}
								</li>
							))}
						</ul>
					}
				/>
			)}
		</div>
	);
};

export default AlbumImportForm;
