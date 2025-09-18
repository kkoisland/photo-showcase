import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import AlbumFileDialog from "./AlbumFileDialog";

const meta: Meta<typeof AlbumFileDialog> = {
	title: "Component/AlbumFileDialog",
	component: AlbumFileDialog,
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof AlbumFileDialog>;

export const Default: Story = {};
