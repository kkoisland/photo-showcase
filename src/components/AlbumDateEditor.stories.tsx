import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import AlbumDateEditor from "./AlbumDateEditor";

const meta: Meta<typeof AlbumDateEditor> = {
	title: "Components/AlbumDateEditor",
	component: AlbumDateEditor,
	decorators: [
		(Story) => {
			return (
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			);
		},
	],
	args: {
		album: {
			id: "1",
			title: "album title",
			photoIds: ["a1", "a2"],
			createdAt: "",
		},
		onClose: () => {},
	},
};
export default meta;
type Story = StoryObj<typeof AlbumDateEditor>;
export const Default: Story = {};
export const WithStartDate: Story = {
	args: {
		album: {
			id: "2",
			title: "album with start",
			photoIds: ["b1", "b2"],
			createdAt: "",
			startDate: "2025-01-01",
		},
	},
};
export const WithEndDate: Story = {
	args: {
		album: {
			id: "3",
			title: "album with end",
			photoIds: ["c1", "c2"],
			createdAt: "",
			endDate: "2025-02-01",
		},
	},
};
export const WithBothDates: Story = {
	args: {
		album: {
			id: "4",
			title: "album full date",
			photoIds: ["d1", "d2"],
			createdAt: "",
			startDate: "2025-01-01",
			endDate: "2025-02-01",
		},
	},
};
