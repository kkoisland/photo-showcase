import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PhotoGrid from "./PhotoGrid";
import { usePhotosStore } from "./store/photosStore";
import type { Photo } from "./types";

const meta: Meta<typeof PhotoGrid> = {
	title: "features/PhotoGrid",
	component: PhotoGrid,
	decorators: [
		(Story, context) => {
			const { photos } = context.args as { photos: Photo[] };
			usePhotosStore.setState({ photos });
			return (
				<MemoryRouter initialEntries={["/albums/a1"]}>
					<Routes>
						<Route path="/albums/:albumId" element={<Story />} />
					</Routes>
				</MemoryRouter>
			);
		},
	],
};
export default meta;

type Story = StoryObj<typeof PhotoGrid>;
export const Default: Story = {
	args: {
		photos: [
			{
				id: "p1",
				albumId: "a1",
				title: "Sample Photo 1",
				url: "https://picsum.photos/400/300",
				type: "photo",
				date: "2024-01-01T09:15:00",
				hash: "hash-p1",
			},
			{
				id: "p2",
				albumId: "a1",
				title: "Sample Photo 2",
				url: "https://picsum.photos/300/400",
				type: "photo",
				date: "2024-01-01T12:30:00",
				hash: "hash-p2",
			},
			{
				id: "p3",
				albumId: "a1",
				title: "Sample Photo 3",
				url: "https://picsum.photos/500/500",
				type: "photo",
				date: "2024-01-02T08:00:00",
				hash: "hash-p3",
			},
			{
				id: "p4",
				albumId: "a1",
				title: "Sample Photo 4",
				url: "https://picsum.photos/450/600",
				type: "photo",
				date: "2024-01-02T18:45:00",
				hash: "hash-p4",
			},
			{
				id: "p5",
				albumId: "a1",
				title: "Sample Photo 5",
				url: "https://picsum.photos/600/450",
				type: "photo",
				date: "2024-01-03T10:20:00",
				hash: "hash-p5",
			},
			{
				id: "p6",
				albumId: "a1",
				title: "Sample Photo 6",
				url: "https://picsum.photos/350/350",
				type: "photo",
				date: "2024-01-03T15:10:00",
				hash: "hash-p6",
			},
			{
				id: "v1",
				albumId: "a1",
				title: "Sample Video",
				url: "https://www.w3schools.com/html/mov_bbb.mp4",
				type: "video",
				date: "2024-01-03T20:00:00",
				hash: "hash-v1",
			},
		],
	},
	argTypes: {
		"photos.0.date": { control: "date" },
		"photos.1.date": { control: "date" },
	},
};

export const TwoPhotos: Story = {
	args: {
		photos: [
			{
				id: "p1",
				albumId: "a1",
				title: "Sample Photo 1",
				url: "https://picsum.photos/400/300",
				type: "photo",
				date: "2024-01-05",
				hash: "hash-p1",
			},
			{
				id: "p2",
				albumId: "a1",
				title: "Sample Photo 2",
				url: "https://picsum.photos/300/400",
				type: "photo",
				date: "2024-01-06",
				hash: "hash-p2",
			},
		],
	},
};
