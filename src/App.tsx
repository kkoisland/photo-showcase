import { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AppRoutes from "./routes";
import { useUIStore } from "./store/uiStore";

const App = () => {
	const { theme } = useUIStore();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<div className="flex-1 flex flex-col">
				<AppRoutes />
			</div>
			<Footer />
		</div>
	);
};
export default App;
