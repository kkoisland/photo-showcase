import { Navigate, Route, Routes } from "react-router-dom";
import AlbumGrid from "./AlbumGrid";
import PhotoDetail from "./PhotoDetail";
import PhotoGrid from "./PhotoGrid";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AlbumGrid />} />
      <Route path="/albums/:albumId" element={<PhotoGrid />} />
      <Route path="/photos/:photoId" element={<PhotoDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
