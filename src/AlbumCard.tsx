import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AlbumDateEditor from "./components/AlbumDateEditor";
import AlbumImportForm from "./components/AlbumImportForm";
import albumUtils from "./components/albumUtils";
import ConfirmModal from "./components/ConfirmModal";
import handleCopyToClipboard from "./components/copyToClipboard";
import { useAlbumsStore } from "./store/albumsStore";
import { useUIStore } from "./store/uiStore";
import type { Album } from "./types";

interface AlbumCardProps {
	album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
	const updateAlbum = useAlbumsStore((s) => s.updateAlbum);
	const removeAlbum = useAlbumsStore((s) => s.removeAlbum);
	const restoreAlbum = useAlbumsStore((s) => s.restoreAlbum);
	const [newTitle, setNewTitle] = useState(album.title);
	const [isDateEditorOpen, setIsDateEditorOpen] = useState(false);
	const [contextMenuOpen, setContextMenuOpen] = useState(false);
	const [showRenameModal, setShowRenameModal] = useState(false);
	const [showImportMoreModal, setShowImportMoreModal] = useState(false);
	const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const showSnack = useUIStore((s) => s.showSnack);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setContextMenuOpen(false);
			}
		};
		if (contextMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [contextMenuOpen]);

	return (
		<>
			<div className="album-card">
				<Link to={`/albums/${album.id}`}>
					<div
						key={album.id}
						style={{
							width: 221,
							border: "1px solid #ddd",
							borderRadius: 8,
						}}
					>
						{album.coverUrl && (
							<img
								src={album.coverUrl}
								alt={album.title}
								style={{
									width: 221,
									height: 221,
									objectFit: "cover",
									borderRadius: 8,
								}}
							/>
						)}
					</div>
					<div className="font-bold w-52 line-clamp-2 mt-2">{album.title}</div>
				</Link>
				<div className="flex items-center text-sm opacity-80">
					<span>
						{album.startDate && album.endDate
							? `${album.startDate}〜${album.endDate}`
							: album.startDate
								? album.startDate
								: "No date set"}
					</span>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setIsDateEditorOpen(true);
						}}
						className="underline text-blue-600 ml-2"
					>
						Edit date
					</button>
				</div>
				<div
					style={{
						fontSize: "0.9em",
					}}
				>
					<div className="flex items-center text-sm mb-2 relative">
						<span>{album.count ?? 0} files</span>
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								const sharedUrl = album.shared
									? album.sharedUrl
									: `https://example.com/albums/${album.id}`;
								if (sharedUrl) handleCopyToClipboard(sharedUrl);
								showSnack({
									type: "info",
									message: album.shared
										? "Link copied to clipboard"
										: "Album shared and link copied to clipboard",
								});
								if (!album.shared) {
									updateAlbum({
										...album,
										shared: true,
										sharedUrl,
									});
								}
							}}
							className="underline text-blue-600 ml-2"
						>
							{album.shared ? "Shared" : "Not shared"}
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								setContextMenuOpen((prev) => !prev);
							}}
							className="ml-2"
						>
							⋮
						</button>
						{contextMenuOpen && (
							<div
								ref={menuRef}
								style={{
									position: "absolute",
									top: "100%",
									right: 0,
									borderRadius: 4,
									boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
									padding: "8px 0",
									backgroundColor: "#fff",
								}}
							>
								<button
									type="button"
									style={{ padding: "4px 12px", cursor: "pointer" }}
									onClick={() => {
										setContextMenuOpen(false);
										setShowRenameModal(true);
									}}
								>
									Rename album
								</button>
								<div>
									<button
										type="button"
										style={{ padding: "4px 12px", cursor: "pointer" }}
										onClick={() => {
											setShowImportMoreModal(true);
											setContextMenuOpen(false);
										}}
									>
										Import more photos
									</button>
								</div>
								<div>
									<button
										type="button"
										style={{ padding: "4px 12px", cursor: "pointer" }}
										onClick={() => {
											albumUtils.exportAlbum(album.id);
											setContextMenuOpen(false);
										}}
									>
										Export
									</button>
								</div>
								<button
									type="button"
									style={{ padding: "4px 12px", cursor: "pointer" }}
									onClick={() => setShowRemoveConfirm(true)}
								>
									Delete this album
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			{isDateEditorOpen && (
				<AlbumDateEditor
					album={album}
					onClose={() => setIsDateEditorOpen(false)}
				/>
			)}
			{showRenameModal && (
				<ConfirmModal
					title="Rename album"
					confirmLabel="Save"
					cancelLabel="Cancel"
					onConfirm={() => {
						updateAlbum({ ...album, title: newTitle });
						setShowRenameModal(false);
						setContextMenuOpen(false);
					}}
					onCancel={() => setShowRenameModal(false)}
					description={
						<input
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							className="border rounded px-2 py-1 w-full"
						/>
					}
				/>
			)}
			{showImportMoreModal && (
				<ConfirmModal
					title="Import more photos"
					cancelLabel="Cancel"
					onCancel={() => {
						setShowImportMoreModal(false);
						setContextMenuOpen(false);
					}}
					description={
						<AlbumImportForm
							openType="existing"
							albumId={album.id}
							onCancel={() => setShowImportMoreModal(false)}
						/>
					}
				/>
			)}
			{showRemoveConfirm && (
				<ConfirmModal
					title="Delete this album?"
					confirmLabel="Delete"
					cancelLabel="Cancel"
					onConfirm={() => {
						removeAlbum(album.id);
						showSnack({
							type: "success",
							message: "Album deleted: ",
							actionLabel: "Undo",
							onAction: () => restoreAlbum(album),
						});
						setContextMenuOpen(false);
					}}
					onCancel={() => {
						setShowRemoveConfirm(false);
						setContextMenuOpen(false);
					}}
				/>
			)}
		</>
	);
};

export default AlbumCard;
