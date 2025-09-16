import { useState } from "react";
import { Link } from "react-router-dom";
import AlbumDateEditor from "./components/AlbumDateEditor";
import type { Album } from "./types";

interface Props {
	album: Album;
}

const AlbumCard = ({ album }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

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
						<span>
							{album.photos?.length ?? 0} 個のファイル
							{album.shared ? " ・ 共有中" : ""}
						</span>
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
