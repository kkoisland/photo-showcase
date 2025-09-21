interface ConfirmModalProps {
	message: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel?: () => void;
}

const ConfirmModal = ({
	message,
	confirmLabel,
	cancelLabel,
	onConfirm,
	onCancel,
}: ConfirmModalProps) => {
	return (
		// biome-ignore lint: false positive
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50"
			onClick={onCancel} // Close when click outside
		>
			{/* biome-ignore lint: false positive */}
			<div
				className="bg-white p-4 rounded shadow w-80"
				onClick={(e) => e.stopPropagation()} // Do not close when click inside
			>
				<p className="mb-4">{message}</p>
				<div className="flex justify-end gap-2">
					{cancelLabel && (
						<button
							type="button"
							className="px-3 py-1 bg-gray-300 rounded"
							onClick={onCancel}
						>
							{cancelLabel}
						</button>
					)}
					<button
						type="button"
						className="px-3 py-1 bg-red-500 text-white rounded"
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
