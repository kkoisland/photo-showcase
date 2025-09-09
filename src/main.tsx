import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// dammy data - remove later
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";

useAlbumsStore
	.getState()
	.setAlbums([
		{ id: "a1", title: "Test Album", photos: [], createdAt: "2025-01-01" },
	]);

usePhotosStore.getState().setPhotos([
	{
		id: "p1",
		albumId: "a1",
		title: "Sample Photo",
		url: "https://picsum.photos/400/300",
	},
]);

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
