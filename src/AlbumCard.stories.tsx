import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import AlbumCard from "./AlbumCard";
import { useAlbumsStore } from "./store/albumsStore";
import type { Album } from "./types";

const meta: Meta<typeof AlbumCard> = {
	title: "features/AlbumCard",
	component: AlbumCard,
	decorators: [
		(Story, context) => {
			const { album } = context.args as { album: Album };
			useAlbumsStore.setState({ albums: [album] });
			return (
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			);
		},
	],
};
export default meta;
type Story = StoryObj<typeof AlbumCard>;
export const Default: Story = {
	args: {
		album: {
			id: "a1",
			title: "Test Album1",
			coverUrl: "https://picsum.photos/300/200",
			createdAt: "",
			startDate: "",
			endDate: "",
			shared: false,
			photoIds: [],
			count: 0,
		},
	},
};
