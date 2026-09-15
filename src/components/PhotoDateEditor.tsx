import { useState } from "react";
import { usePhotosStore } from "../store/photosStore";
import type { Photo } from "../types";
import ConfirmModal from "./ConfirmModal";

interface EditorProps {
	photo: Photo;
	onClose: () => void;
}

const PhotoDateEditor = ({ photo, onClose }: EditorProps) => {
	const updatePhoto = usePhotosStore((s) => s.updatePhoto);
	const [date, setDate] = useState((photo.date ?? "").slice(0, 16));

	const handleSave = () => {
		if (date) {
			updatePhoto({ ...photo, date: `${date}:00.000Z` });
		}
		onClose();
	};

	return (
		<ConfirmModal
			title="Edit taken date"
			cancelLabel="Cancel"
			onCancel={() => onClose()}
			confirmLabel="Save"
			onConfirm={handleSave}
			description={
				<label className="block mb-2 text-sm">
					Taken date:
					<input
						type="datetime-local"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="border rounded p-1 w-full mt-1"
					/>
				</label>
			}
		/>
	);
};

export default PhotoDateEditor;
