import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import AlbumImportNewDialog from "./AlbumImportNewDialog";

const meta: Meta<typeof AlbumImportNewDialog> = {
	title: "Component/AlbumImportNewDialog",
	component: AlbumImportNewDialog,
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof AlbumImportNewDialog>;

export const Default: Story = {};
