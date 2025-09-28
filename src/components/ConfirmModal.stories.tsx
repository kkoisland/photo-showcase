import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

const meta: Meta<typeof ConfirmModal> = {
	title: "Components/ConfirmModel",
	component: ConfirmModal,
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
	argTypes: {
		description: { control: "text" },
		onConfirm: { action: "confirmed" },
		onCancel: { action: "cancelled" },
	},
	args: {
		title: "Delete this album?",
		confirmLabel: "Delete",
		cancelLabel: "Cancel",
	},
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {};
export const WithDescription: Story = {
	args: {
		description: "This action cannot be undone.",
	},
};
export const NoCancelButton: Story = {
	args: {
		cancelLabel: undefined,
	},
};
