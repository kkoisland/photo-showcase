import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import AlbumImportForm from "./AlbumImportForm";
import ConfirmModal from "./ConfirmModal";

const meta: Meta<typeof AlbumImportForm> = {
	title: "Components/AlbumImportForm",
	component: AlbumImportForm,
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
	args: { albumId: "01", onCancel: () => {} },
};
export default meta;
type Story = StoryObj<typeof AlbumImportForm>;

const withConfirmModal = (title: string): Story => ({
	render: (args) => {
		const [open, setOpen] = useState(true);
		return (
			<>
				{open && (
					<ConfirmModal
						title={title}
						cancelLabel="Cancel"
						onCancel={() => setOpen(false)}
						description={<AlbumImportForm {...args} />}
					/>
				)}
			</>
		);
	},
});

export const OpenNew: Story = {
	...withConfirmModal("Impprt Album"),
	args: { openType: "new" },
};
export const OpenExisting: Story = {
	...withConfirmModal("Import more photos"),
	args: { openType: "existing" },
};
