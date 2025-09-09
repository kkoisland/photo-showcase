import { useId, useRef } from "react";
import { useUIStore } from "../store/uiStore";

export default function ImportDialog() {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const replaceAll = useUIStore((s) => s.replaceAll);
	const headingId = useId();

	const open = () => dialogRef.current?.showModal();
	const close = () => dialogRef.current?.close();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result as string);
				if (Array.isArray(data)) {
					replaceAll(data);
					close();
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
			<button type="button" onClick={open}>
				Import
			</button>
			<dialog ref={dialogRef} aria-labelledby={headingId}>
				<h5 id={headingId}>Import Photos</h5>
				<input
					type="file"
					accept="image/*,video/*"
					onChange={handleFileChange}
				/>
				<div>
					<button type="button" onClick={close}>
						Cancel
					</button>
				</div>
			</dialog>
		</>
	);
}
