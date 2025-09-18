import { useState } from "react";

interface Props {
	openType: "new" | "existing" | "export";
	albumId?: string;
}

const AlbumFileDialog = ({ openType, albumId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("handleFileImport called:");
		const file = e.target.files?.[0];
		if (!file) return;
		if (openType === "new") {
			console.log("新規アルバムにインポートします");
			// TODO: 新規アルバム作成処理
		} else if (openType === "existing" && albumId) {
			console.log(`既存アルバム(${albumId})にインポートします`);
			// TODO: 既存アルバムに追加処理
		}
	};

	return (
		<>
			<button type="button" onClick={() => setIsOpen(true)}>
				Import
			</button>
			{isOpen && (
				// biome-ignore lint: false positive
				<div
					role="button"
					tabIndex={0}
					className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
					onClick={(e) => {
						setIsOpen(false);
						e.stopPropagation();
					}}
				>
					{/* biome-ignore lint: false positive */}
					<div
						className="bg-white p-6 rounded-xl shadow-lg w-80"
						onClick={(e) => e.stopPropagation()}
					>
						<h5 className="text-lg font-bold mb-4">Import Photos</h5>
						<input type="file" onChange={handleFileImport} />
						<div className="flex justify-end mt-4">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AlbumFileDialog;
