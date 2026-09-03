import { useEffect } from "react";
import AdminPublishButton from "./components/AdminPublishButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AppRoutes from "./routes";
import { useUIStore } from "./store/uiStore";

const AdminApp = () => {
	const { theme } = useUIStore();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<>
			<Header />
			<AdminPublishButton />
			<AppRoutes />
			<Footer />
		</>
	);
};
export default AdminApp;
