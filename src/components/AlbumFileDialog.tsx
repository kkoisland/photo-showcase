import { useState } from "react";

interface Props {
	openType: "new" | "existing";
}

const AlbumFileDialog = (openType: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	console.log("openType :", openType);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
	};

	return (
		<>
			<button type="button" onClick={() => setIsOpen(true)}>
				Import
			</button>
			{isOpen && (
				// biome-ignore lint: false positivebiome(suppressions/incorrect)
				<div
					role="button"
					tabIndex={0}
					className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
					onClick={(e) => {
						setIsOpen(false);
						e.stopPropagation();
					}}
				>
					<div className="bg-white p-6 rounded-xl shadow-lg w-80">
						<h5 className="text-lg font-bold mb-4">Import Photos</h5>
						<input type="file" onChange={handleFileChange} />
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
