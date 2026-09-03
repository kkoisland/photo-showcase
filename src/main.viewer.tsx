import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";

async function loadManifest() {
	try {
		const res = await fetch("/manifest.json");
		if (!res.ok) throw new Error(`manifest.json fetch failed: ${res.status}`);
		const { albums, photos } = await res.json();
		useAlbumsStore.getState().setAlbums(albums);
		usePhotosStore.getState().setPhotos(photos);
	} catch (error) {
		console.error("Failed to load manifest.json", error);
	}
}

loadManifest();

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
const root = createRoot(container);

root.render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<App />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
