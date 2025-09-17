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
		title: "Test Album1 Test Album1 Test Album1 Test Album1 Test Album1",
		coverUrl: "https://picsum.photos/300/200",
		createdAt: "",
		photos: [],
	},
	{
		id: "a2",
		title: "Test Album2",
		coverUrl: "https://picsum.photos/300/400",
		createdAt: "",
		photos: [],
	},
]);

usePhotosStore.getState().setPhotos([
	{
		id: "p1",
		albumId: "a1",
		title: "Sample Photo 1",
		url: "https://picsum.photos/400/300",
		type: "photo",
	},
	{
		id: "p2",
		albumId: "a1",
		title: "Sample Photo 2",
		url: "https://picsum.photos/300/400",
		type: "photo",
	},
	{
		id: "p3",
		albumId: "a1",
		title: "Sample Photo 3",
		url: "https://picsum.photos/500/500",
		type: "photo",
	},
	{
		id: "p4",
		albumId: "a1",
		title: "Sample Photo 4",
		url: "https://picsum.photos/450/600",
		type: "photo",
	},
	{
		id: "p5",
		albumId: "a1",
		title: "Sample Photo 5",
		url: "https://picsum.photos/600/450",
		type: "photo",
	},
	{
		id: "p6",
		albumId: "a1",
		title: "Sample Photo 6",
		url: "https://picsum.photos/350/350",
		type: "photo",
	},
	{
		id: "v1",
		albumId: "a1",
		title: "Sample Video",
		url: "https://www.w3schools.com/html/mov_bbb.mp4", // 動画サンプル
		type: "video",
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
