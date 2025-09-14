import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// dammy data - remove later
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";

useAlbumsStore.getState().setAlbums([
	{
		id: "a1",
		title: "Test Album",
		photos: [],
		createdAt: "",
	},
]);

usePhotosStore.getState().setPhotos([
	{
		id: "p1",
		albumId: "a1",
		title: "Sample Photo 1",
		url: "https://picsum.photos/400/300",
	},
	{
		id: "p2",
		albumId: "a1",
		title: "Sample Photo 2",
		url: "https://picsum.photos/300/400",
	},
	{
		id: "p3",
		albumId: "a1",
		title: "Sample Photo 3",
		url: "https://picsum.photos/500/500",
	},
	{
		id: "p4",
		albumId: "a1",
		title: "Sample Photo 4",
		url: "https://picsum.photos/450/600",
	},
	{
		id: "p5",
		albumId: "a1",
		title: "Sample Photo 5",
		url: "https://picsum.photos/600/450",
	},
	{
		id: "p6",
		albumId: "a1",
		title: "Sample Photo 6",
		url: "https://picsum.photos/350/350",
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
