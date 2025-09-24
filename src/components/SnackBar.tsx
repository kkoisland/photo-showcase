import { useEffect, useState } from "react";
import type { Snack } from "../types";

interface SnackBarProps {
	snack: Snack;
}

const SnackBar = ({ snack }: SnackBarProps) => {
	const [visible, setVisible] = useState(true);

	// biome-ignore lint: false positive
	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), 5000);
		return () => clearTimeout(timer);
	}, [snack]);

	if (!visible) return null;

	let styles = "";

	switch (snack.type) {
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
			{snack.message}
		</div>
	);
};

export default SnackBar;
