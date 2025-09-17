import { useState } from "react";
import { Link } from "react-router-dom";
import AlbumDateEditor from "./components/AlbumDateEditor";
import { useAlbumsStore } from "./store/albumsStore";
import type { Album } from "./types";

interface ContextMenuProps {
	album: Album;
	setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContextMenu = ({ album, setMenuOpen }: ContextMenuProps) => {
	const updateAlbum = useAlbumsStore((s) => s.updateAlbum);
	return (
		<div
			style={{
				position: "absolute",
				top: "100%",
				right: 0,
				borderRadius: 4,
				boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
				padding: "8px 0",
			}}
		>
			<button
				type="button"
				style={{ padding: "4px 12px", cursor: "pointer" }}
				onClick={() => {
					const newName = prompt(
						"新しいアルバム名を入力してください",
						album.title,
					);
					if (newName) {
						updateAlbum({ ...album, title: newName });
					}
					setMenuOpen(false);
				}}
			>
				アルバム名を変更
			</button>

			<div style={{ padding: "4px 12px", cursor: "pointer" }}>
				追加インポート
				{/* TODO: Implement "Import More" when working on ImportDialog */}
			</div>
			<div style={{ padding: "4px 12px", cursor: "pointer" }}>
				エクスポート
				{/* TODO: Implement "Export" when working on ImportDialog */}
			</div>
			<button
				type="button"
				style={{ padding: "4px 12px", cursor: "pointer" }}
				onClick={() => {
					alert("アルバムを削除");
					setMenuOpen(false);
				}}
			>
				アルバムを削除
				{/* TODO: Implement proper delete logic when working on ImportDialog */}
			</button>
		</div>
	);
};
interface AlbumCardProps {
	album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
	const [isDateEditorOpen, setIsDateEditorOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const updateAlbum = useAlbumsStore((s) => s.updateAlbum);

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
						編集
					</button>
				</div>
				<div
					style={{
						fontSize: "0.9em",
					}}
				>
					<div className="flex items-center text-sm opacity-80 mb-2 relative">
						<span>{album.photos?.length ?? 0} 個のファイル</span>
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
								setMenuOpen((prev) => !prev);
							}}
							className="ml-2"
						>
							⋮
						</button>
						{menuOpen && (
							<ContextMenu setMenuOpen={setMenuOpen} album={album} />
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
		</>
	);
};

export default AlbumCard;
