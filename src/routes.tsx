import { Navigate, Route, Routes } from "react-router-dom";
import AlbumGrid from "./AlbumGrid";
import PhotoGrid from "./PhotoGrid";
import PhotoModal from "./PhotoModal";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<AlbumGrid />} />
			<Route path="/albums/:albumId" element={<PhotoGrid />} />
			<Route path="/photos/:photoId" element={<PhotoModal />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default AppRoutes;
