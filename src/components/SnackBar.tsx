import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";

// モック
// const SnackBar = () => {
// const snackbar = {
// 	isOpen: true,
// 	message: "Sample message",
// 	actionLabel: "Undo",
// 	action: () => alert("Undo clicked!"),
// };
// const hideSnackbar = useCallback(() => alert("Hide!"), []);

const SnackBar = () => {
	const { snackbar, hideSnackbar } = useUIStore((s) => ({
		snackbar: s.snackbar,
		hideSnackbar: s.hideSnackbar,
	}));

	useEffect(() => {
		if (!snackbar.isOpen) return;
		const timer = setTimeout(hideSnackbar, 4000);
		return () => clearTimeout(timer);
	}, [snackbar.isOpen, hideSnackbar]);

	if (!snackbar.isOpen) return null;

	return (
		<div>
			<span>{snackbar.message}</span>
			{snackbar.action && (
				<button
					type="button"
					onClick={() => {
						snackbar.action?.();
						hideSnackbar();
					}}
				>
					{snackbar.actionLabel ?? "Undo"}
				</button>
			)}
			<button type="button" onClick={hideSnackbar}>
				✕
			</button>
		</div>
	);
};

export default SnackBar;
