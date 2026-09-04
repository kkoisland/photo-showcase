import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminApp from "./AdminApp.tsx";
import { publicUrlFor } from "./components/s3Utils";
import "./index.css";
import { seedDummyData } from "./seedDummyData";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";

async function bootstrapAdminData() {
	const hasLocalData =
		useAlbumsStore.getState().albums.length > 0 ||
		usePhotosStore.getState().photos.length > 0;
	if (hasLocalData) return;

	try {
		const res = await fetch(publicUrlFor("manifest.json"), {
			cache: "no-store",
		});
		if (res.ok) {
			const { albums, photos } = await res.json();
			useAlbumsStore.getState().setAlbums(albums);
			usePhotosStore.getState().setPhotos(photos);
			return;
		}
	} catch (error) {
		console.error("Failed to load manifest from S3", error);
	}

	seedDummyData();
}

bootstrapAdminData();

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
const root = createRoot(container);

root.render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<AdminApp />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
