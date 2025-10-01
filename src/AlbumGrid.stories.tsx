import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import AlbumGrid from "./AlbumGrid";
import { useAlbumsStore } from "./store/albumsStore";
import type { Album } from "./types";

const meta: Meta<typeof AlbumGrid> = {
	title: "Features/AlbumGrid",
	component: AlbumGrid,
	decorators: [
		(Story, context) => {
			const { albums } = context.args as { albums: Album[] };
			useAlbumsStore.setState({
				albums,
			});
			return (
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			);
		},
	],
};
export default meta;

type Story = StoryObj<typeof AlbumGrid>;
export const Default: Story = {
	args: {
		albums: [
			{
				id: "a1",
				title: "Test Album1",
				coverUrl: "https://picsum.photos/300/200",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "",
				shared: true,
				photoIds: [],
				count: 42,
			},
		],
	},
};
export const ThreeAlbums: Story = {
	args: {
		albums: [
			{
				id: "a1",
				title: "Test Album1",
				coverUrl: "https://picsum.photos/300/200",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "",
				shared: true,
				photoIds: [],
				count: 42,
			},
			{
				id: "a2",
				title: "Test Album2",
				coverUrl: "https://picsum.photos/300/400",
				createdAt: "",
				startDate: "",
				endDate: "",
				photoIds: [],
				count: 321,
			},
			{
				id: "a3",
				title: "Test Album3",
				coverUrl: "https://picsum.photos/300/500",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "2025-09-15",
				photoIds: [],
				count: 8,
			},
		],
	},
};

export const SixAlbums: Story = {
	args: {
		albums: [
			{
				id: "a1",
				title: "Test Album1",
				coverUrl: "https://picsum.photos/300/200",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "",
				shared: true,
				photoIds: [],
				count: 42,
			},
			{
				id: "a2",
				title: "Test Album2",
				coverUrl: "https://picsum.photos/300/400",
				createdAt: "",
				startDate: "",
				endDate: "",
				photoIds: [],
				count: 321,
			},
			{
				id: "a3",
				title: "Test Album3",
				coverUrl: "https://picsum.photos/300/500",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "2025-09-15",
				photoIds: [],
				count: 8,
			},
			{
				id: "a4",
				title: "Test Album4",
				coverUrl: "https://picsum.photos/300/600",
				createdAt: "",
				startDate: "",
				endDate: "",
				shared: true,
				photoIds: [],
				count: 420,
			},
			{
				id: "a5",
				title: "Test Album5",
				coverUrl: "https://picsum.photos/300/700",
				createdAt: "",
				startDate: "",
				endDate: "",
				photoIds: [],
				count: 1003,
			},
			{
				id: "a6",
				title: "Test Album6",
				coverUrl: "https://picsum.photos/300/800",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "2025-09-15",
				photoIds: [],
				count: 8,
			},
		],
	},
};
