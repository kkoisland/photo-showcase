import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import type { Snack } from "../types";
import SnackBar from "./SnackBar";

const meta: Meta<typeof SnackBar> = {
	title: "Components/SnackBar",
	component: SnackBar,
	decorators: [
		(Story, context) => {
			useUIStore.setState({ clearSnack: () => {} }); // no-op in Storybook
			const showSnack = useUIStore((s) => s.showSnack);
			showSnack(context.args as Snack);
			return (
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			);
		},
	],
};

export default meta;
type Story = StoryObj<typeof SnackBar>;

export const InfoLabelWithUndo: Story = {
	args: {
		type: "info",
		message: "Deleted: ",
		actionLabel: "Undo",
		onAction: () => {},
	},
};
export const SuccessLavel: Story = {
	args: {
		type: "success",
		message: "This is success ",
		actionLabel: undefined,
		onAction: undefined,
	},
};
export const ErrorLavel: Story = {
	args: {
		type: "error",
		message: "This is error ",
		actionLabel: undefined,
		onAction: undefined,
	},
};
export const WarningLavel: Story = {
	args: {
		type: "warning",
		message: "This is warning ",
		actionLabel: undefined,
		onAction: undefined,
	},
};
