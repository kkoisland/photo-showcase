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
		photoIds: [],
	},
	{
		id: "a2",
		title: "Test Album2",
		coverUrl: "https://picsum.photos/300/400",
		createdAt: "",
		photoIds: [],
	},
]);

usePhotosStore.getState().setPhotos([
	{
		id: "p1",
		albumId: "a1",
		title: "Sample Photo 1",
		url: "https://picsum.photos/400/300",
		type: "photo",
		date: "2024-01-01T09:15:00",
	},
	{
		id: "p2",
		albumId: "a1",
		title: "Sample Photo 2",
		url: "https://picsum.photos/300/400",
		type: "photo",
		date: "2024-01-01T12:30:00",
	},
	{
		id: "p3",
		albumId: "a1",
		title: "Sample Photo 3",
		url: "https://picsum.photos/500/500",
		type: "photo",
		date: "2024-01-02T08:00:00",
	},
	{
		id: "p4",
		albumId: "a1",
		title: "Sample Photo 4",
		url: "https://picsum.photos/450/600",
		type: "photo",
		date: "2024-01-02T18:45:00",
	},
	{
		id: "p5",
		albumId: "a1",
		title: "Sample Photo 5",
		url: "https://picsum.photos/600/450",
		type: "photo",
		date: "2024-01-03T10:20:00",
	},
	{
		id: "p6",
		albumId: "a1",
		title: "Sample Photo 6",
		url: "https://picsum.photos/350/350",
		type: "photo",
		date: "2024-01-03T15:10:00",
	},
	{
		id: "v1",
		albumId: "a1",
		title: "Sample Video",
		url: "https://www.w3schools.com/html/mov_bbb.mp4",
		type: "video",
		date: "2024-01-03T20:00:00",
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
