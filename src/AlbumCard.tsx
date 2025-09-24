import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AlbumDateEditor from "./components/AlbumDateEditor";
import AlbumImportForm from "./components/AlbumImportForm";
import albumUtils from "./components/albumUtils";
import ConfirmModal from "./components/ConfirmModal";
import { useAlbumsStore } from "./store/albumsStore";
import type { Album, Snack } from "./types";

interface AlbumCardProps {
	album: Album;
	setSnack: React.Dispatch<React.SetStateAction<Snack | null>>;
}

const AlbumCard = ({ album, setSnack }: AlbumCardProps) => {
	const updateAlbum = useAlbumsStore((s) => s.updateAlbum);
	const removeAlbum = useAlbumsStore((s) => s.removeAlbum);
	const [newTitle, setNewTitle] = useState(album.title);
	const [isDateEditorOpen, setIsDateEditorOpen] = useState(false);
	const [contextMenuOpen, setContextMenuOpen] = useState(false);
	const [showRenameModal, setShowRenameModal] = useState(false);
	const [showImportMoreModal, setShowImportMoreModal] = useState(false);
	const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

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
				<div className="flex items-center gap-2 text-sm opacity-80 mb-2">
					<span>
						{album.startDate && album.endDate
							? `${album.startDate}〜${album.endDate}`
							: album.startDate
								? album.startDate
								: "日付未設定"}
					</span>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setIsDateEditorOpen(true);
						}}
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
						<span>{album.photoIds?.length ?? 0} 個のファイル</span>
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								if (album.shared) {
									// TODO: 後でSnackbarへ置き換え
									alert(`共有リンク: https://example.com/albums/${album.id}`);
								} else {
									updateAlbum({ ...album, shared: true });
									alert("このアルバムを共有しました");
								}
								// TODO: Snackbar実装時に置き換える（Copyボタン＋外側クリックで閉じる）
							}}
							className="underline text-blue-600"
						>
							{album.shared ? "共有中" : "共有なし"}
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
						setSnack({
							type: "success",
							message: `'${album.title}' is deleted`,
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
