import { useState } from "react";
import { useUIStore } from "../store/uiStore";

const ImportDialog = () => {
	const replaceAll = useUIStore((s) => s.replaceAll);
	const [isOpen, setIsOpen] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result as string);
				if (Array.isArray(data)) {
					replaceAll(data);
					setIsOpen(false);
				} else {
					alert("Invalid file format");
				}
			} catch {
				alert("Failed to parse file");
			}
		};
		reader.readAsText(file);
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
						<input
							type="file"
							accept="application/json"
							onChange={handleFileChange}
						/>
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

export default ImportDialog;
