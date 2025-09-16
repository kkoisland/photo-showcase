import { useState } from "react";
import { Link } from "react-router-dom";
import AlbumDateEditor from "./components/AlbumDateEditor";
import { useAlbumsStore } from "./store/albumsStore";
import type { Album } from "./types";

interface Props {
	album: Album;
}

const AlbumCard = ({ album }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const updateAlbum = useAlbumsStore((s) => s.updateAlbum);

	return (
		<>
			<Link key={album.id} to={`/albums/${album.id}`}>
				<div
					key={album.id}
					style={{
						padding: 12,
						border: "1px solid #ddd",
						borderRadius: 8,
						background: "#fafafa",
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
								marginBottom: 8,
							}}
						/>
					)}
					<div style={{ fontWeight: "bold" }}>{album.title}</div>

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
								setIsOpen(true);
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
						<div className="flex items-center text-sm opacity-80 mb-2">
							<span>{album.photos?.length ?? 0} 個のファイル</span>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									if (album.shared) {
										// 共有中 → リンクを表示（後でSnackbarへ置き換え）
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
						</div>
					</div>
				</div>
			</Link>
			{isOpen && (
				<AlbumDateEditor album={album} onClose={() => setIsOpen(false)} />
			)}
		</>
	);
};

export default AlbumCard;
