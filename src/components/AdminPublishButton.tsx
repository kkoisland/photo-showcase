import { useState } from "react";
import { useUIStore } from "../store/uiStore";
import { publishToS3 } from "./s3Utils";

const AdminPublishButton = () => {
	const [isPublishing, setIsPublishing] = useState(false);
	const showSnack = useUIStore((s) => s.showSnack);

	const handlePublish = async () => {
		setIsPublishing(true);
		try {
			const { photoCount, skippedCount } = await publishToS3();
			showSnack({
				type: "success",
				message:
					skippedCount > 0
						? `Published ${photoCount} photos to S3 (${skippedCount} skipped, see console)`
						: `Published ${photoCount} photos to S3`,
			});
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
		</div>
	);
};

export default AdminPublishButton;
