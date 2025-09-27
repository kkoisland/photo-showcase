const handleCopyToClipboard = async (sharedUrl: string) => {
	try {
		return await navigator.clipboard.writeText(sharedUrl);
	} catch (e) {
		console.error("Clipboard copy failed", e);
	}
};
export default handleCopyToClipboard;
