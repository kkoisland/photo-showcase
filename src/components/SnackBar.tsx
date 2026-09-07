import { useEffect, useRef } from "react";
import { useUIStore } from "../store/uiStore";

const SnackBar = () => {
	const snack = useUIStore((s) => s.snack);
	const clearSnack = useUIStore((s) => s.clearSnack);
	const snackRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (snackRef.current && !snackRef.current.contains(e.target as Node)) {
				clearSnack();
			}
		};
		if (snack) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [snack, clearSnack]);

	let styles = "";

	switch (snack?.type) {
		case "success":
			styles = "bg-green-100 text-green-800";
			break;
		case "error":
			styles = "bg-pink-100 text-pink-800 ";
			break;
		case "info":
			styles = "bg-blue-100 text-blue-800";
			break;
		case "warning":
			styles = "bg-yellow-100 text-yellow-800";
			break;
	}

	return (
		<div
			ref={snackRef}
			className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow ${styles}`}
		>
			<span className="whitespace-pre-line">{snack?.message}</span>
			{snack?.actionLabel && snack?.onAction && (
				<button
					type="button"
					onClick={snack.onAction}
					className="underline font-medium"
				>
					{snack.actionLabel}
				</button>
			)}
		</div>
	);
};

export default SnackBar;
