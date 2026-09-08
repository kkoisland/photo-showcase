import { useState } from "react";
import { useUIStore } from "../store/uiStore";
import type { SkippedPhoto } from "../types";
import ConfirmModal from "./ConfirmModal";
import { publishToS3 } from "./s3Utils";

const AdminPublishButton = () => {
	const [isPublishing, setIsPublishing] = useState(false);
	const [skippedPhotos, setSkippedPhotos] = useState<SkippedPhoto[]>([]);
	const showSnack = useUIStore((s) => s.showSnack);

	const handlePublish = async () => {
		setIsPublishing(true);
		try {
			const { photoCount, skippedPhotos, deletedCount } = await publishToS3();
			const notes = [
				deletedCount > 0 ? `${deletedCount} orphaned files removed` : null,
			].filter(Boolean);
			showSnack({
				type: "success",
				message:
					notes.length > 0
						? `Published ${photoCount} photos to S3 (${notes.join(", ")})`
						: `Published ${photoCount} photos to S3`,
			});
			if (skippedPhotos.length > 0) {
				setSkippedPhotos(skippedPhotos);
			}
		} catch (error) {
			console.error(error);
			showSnack({
				type: "error",
				message: "Failed to publish to S3",
			});
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "0 16px 8px",
			}}
		>
			<button type="button" onClick={handlePublish} disabled={isPublishing}>
				{isPublishing ? "Publishing..." : "Publish to S3"}
			</button>
			{skippedPhotos.length > 0 && (
				<ConfirmModal
					title={`${skippedPhotos.length} photo(s) failed to publish`}
					cancelLabel="OK"
					onCancel={() => setSkippedPhotos([])}
					description={
						<ul className="list-disc pl-5">
							{skippedPhotos.map((p) => (
								<li key={p.title}>
									{p.title}: {p.error}
								</li>
							))}
						</ul>
					}
				/>
			)}
		</div>
	);
};

export default AdminPublishButton;
