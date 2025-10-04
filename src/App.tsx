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
		<>
			<Header />
			<AppRoutes />
			<Footer />
		</>
	);
};
export default App;
