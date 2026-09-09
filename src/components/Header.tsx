import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useUIStore } from "../store/uiStore";

const Header = () => {
	const { theme, toggleTheme } = useUIStore();

	return (
		<header
			style={{
				marginTop: 20,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "0 16px",
			}}
		>
			<Link to="/">Back to Albums</Link>

			<button
				type="button"
				onClick={toggleTheme}
				style={{
					padding: "6px 10px",
					cursor: "pointer",
				}}
			>
				{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
			</button>
		</header>
	);
};

export default Header;
