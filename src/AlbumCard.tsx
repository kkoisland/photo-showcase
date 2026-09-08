import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AlbumDateEditor from "./components/AlbumDateEditor";
import AlbumImportForm from "./components/AlbumImportForm";
import albumUtils from "./components/albumUtils";
import ConfirmModal from "./components/ConfirmModal";
import handleCopyToClipboard from "./components/copyToClipboard";
import { albumUrlFor } from "./components/publicUrls";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";
import { useUIStore } from "./store/uiStore";
import type { Album } from "./types";

interface AlbumCardProps {
	album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
	const updateAlbum = useAlbumsStore((s) => s.updateAlbum);
	const count = usePhotosStore(
		(s) => s.photos.filter((p) => p.albumId === album.id).length,
	);
	const coverPhoto = usePhotosStore((s) => {
		const photosInAlbum = s.photos.filter((p) => p.albumId === album.id);
		return (
			photosInAlbum.find((p) => p.id === album.coverPhotoId) ?? photosInAlbum[0]
		);
	});
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
			<div className="album-card mb-4">
				<Link to={`/albums/${album.id}`}>
					<div
						key={album.id}
						style={{
							width: 221,
							border: "1px solid #ddd",
							borderRadius: 8,
						}}
					>
						{coverPhoto && (
							<img
								src={coverPhoto.url}
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
				<div className="flex items-center opacity-80">
					<span className="truncate overflow-hidden whitespace-nowrap">
						{album.startDate && album.endDate
							? `${album.startDate}〜${album.endDate}`
							: album.startDate
								? album.startDate
								: "No date set"}
					</span>
					{import.meta.env.DEV && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								setIsDateEditorOpen(true);
							}}
							className="ml-1 cursor-pointer text-sm"
						>
							🖋️
						</button>
					)}
				</div>
				<div className="flex items-center mb-2 relative">
					<span>{count} files</span>
					{import.meta.env.DEV && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								updateAlbum({ ...album, hidden: !album.hidden });
							}}
							className="ml-2 text-xs opacity-70 cursor-pointer underline"
						>
							{album.hidden ? "Hidden" : "Show"}
						</button>
					)}
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							handleCopyToClipboard(albumUrlFor(album.id));
							showSnack({
								type: "info",
								message: "Link copied to clipboard",
							});
						}}
						className="underline ml-2 cursor-pointer link-accent"
					>
						Copy link
					</button>
					{import.meta.env.DEV && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								setContextMenuOpen((prev) => !prev);
							}}
							className="ml-2 px-2 cursor-pointer"
						>
							⋮
						</button>
					)}
					{import.meta.env.DEV && contextMenuOpen && (
						<div
							ref={menuRef}
							className="absolute top-full right-0 context-menu"
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
			{import.meta.env.DEV && isDateEditorOpen && (
				<AlbumDateEditor
					album={album}
					onClose={() => setIsDateEditorOpen(false)}
				/>
			)}
			{import.meta.env.DEV && showRenameModal && (
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
			{import.meta.env.DEV && showImportMoreModal && (
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
			{import.meta.env.DEV && showRemoveConfirm && (
				<ConfirmModal
					title="Delete this album?"
					confirmLabel="Delete"
					cancelLabel="Cancel"
					danger
					onConfirm={() => {
						const removed = albumUtils.deleteAlbumWithPhotos(album.id);
						showSnack({
							type: "success",
							message: "Album deleted: ",
							actionLabel: "Undo",
							onAction: () => {
								if (removed) {
									albumUtils.restoreAlbumWithPhotos(
										removed.album,
										removed.photos,
									);
								}
							},
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
