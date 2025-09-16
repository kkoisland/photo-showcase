import { Link } from "react-router-dom";
import type { Album } from "./types";

interface Props {
	album: Album;
}

const AlbumCard = ({ album }: Props) => {
	return (
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
				<div>date</div>
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
	);
};

export default AlbumCard;
