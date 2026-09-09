import { useEffect } from "react";
import { AdminS3Context } from "./adminS3Context";
import AdminPublishButton from "./components/AdminPublishButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { deletePhoto, deletePhotos, uploadPhoto } from "./components/s3Utils";
import AppRoutes from "./routes";
import { useUIStore } from "./store/uiStore";

const AdminApp = () => {
	const { theme } = useUIStore();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<AdminS3Context.Provider value={{ uploadPhoto, deletePhoto, deletePhotos }}>
			<div className="min-h-screen flex flex-col">
				<Header />
				<AdminPublishButton />
				<div className="flex-1 flex flex-col">
					<AppRoutes />
				</div>
				<Footer />
			</div>
		</AdminS3Context.Provider>
	);
};
export default AdminApp;
