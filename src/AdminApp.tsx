import { useEffect } from "react";
import { AdminS3Context } from "./adminS3Context";
import AdminPublishButton from "./components/AdminPublishButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { uploadPhoto } from "./components/s3Utils";
import AppRoutes from "./routes";
import { useUIStore } from "./store/uiStore";

const AdminApp = () => {
	const { theme } = useUIStore();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<AdminS3Context.Provider value={{ uploadPhoto }}>
			<Header />
			<AdminPublishButton />
			<AppRoutes />
			<Footer />
		</AdminS3Context.Provider>
	);
};
export default AdminApp;
