import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PhotoModal from "./PhotoModal";
import { usePhotosStore } from "./store/photosStore";
import type { Photo } from "./types";

const meta: Meta<typeof PhotoModal> = {
	title: "features/PhotoModal",
	component: PhotoModal,
	decorators: [
		(Story, context) => {
			const { photos } = context.args as { photos: Photo[] };
			usePhotosStore.setState({ photos });
			return (
				<MemoryRouter initialEntries={["/photos/p1"]}>
					<Routes>
						<Route path="/photos/:photoId" element={<Story />} />
					</Routes>
				</MemoryRouter>
			);
		},
	],
};
export default meta;
type Story = StoryObj<typeof PhotoModal>;
export const ThreePhotos: Story = {
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
		],
	},
};
export const SinglePhotos: Story = {
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
		],
	},
};

export const WithEmpty: Story = {
	args: {
		photos: [],
	},
};
