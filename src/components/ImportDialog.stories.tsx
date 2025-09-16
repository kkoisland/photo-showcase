import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import ImportDialog from "./ImportDialog";

const meta: Meta<typeof ImportDialog> = {
	title: "Component/ImportDialog",
	component: ImportDialog,
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ImportDialog>;

export const Default: Story = {};
