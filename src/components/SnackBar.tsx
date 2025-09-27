import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";

const SnackBar = () => {
	const snack = useUIStore((s) => s.snack);
	const clearSnack = useUIStore((s) => s.clearSnack);

	// biome-ignore lint: false positive
	useEffect(() => {
		const timer = setTimeout(() => clearSnack(), 5000);
		return () => clearTimeout(timer);
	}, [snack, clearSnack]);

	let styles = "";

	switch (snack?.type) {
		case "success":
			styles = "bg-green-100 text-green-800";
			break;
		case "error":
			styles = "bg-pink-100 text-pink-800";
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
			className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow ${styles}`}
		>
			<span>{snack?.message}</span>
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
