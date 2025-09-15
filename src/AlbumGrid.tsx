import { Link } from "react-router-dom";
import ImportDialog from "./components/ImportDialog";
import { useAlbumsStore } from "./store/albumsStore";

const AlbumGrid = () => {
	const albums = useAlbumsStore((s) => s.albums);
	return (
		<div style={{ padding: 20 }}>
			<h1>Albums</h1>
			<ImportDialog />
			<div
				style={{
					display: "grid",
					gap: 12,
					gridTemplateColumns: "repeat(auto-fill, minmax(221px, auto))",
				}}
			>
				{albums.map((a) => (
					<Link key={a.id} to={`/albums/${a.id}`}>
						{a.title}
						<div
							key={a.id}
							style={{
								padding: 12,
								border: "1px solid #ddd",
								borderRadius: 8,
								background: "#fafafa",
							}}
						>
							{a.coverUrl && (
								<img
									src={a.coverUrl}
									alt={a.title}
									style={{
										width: 221,
										height: 221,
										objectFit: "cover",
										borderRadius: 8,
										marginBottom: 8,
									}}
								/>
							)}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									fontSize: "0.9em",
									opacity: 0.8,
									marginBottom: 4,
								}}
							>
								<span>
									{a.photos?.length ?? 0} 個のファイル
									{a.shared ? " ・ 共有中" : ""}
								</span>
							</div>
							<div style={{ fontWeight: "bold" }}>{a.title}</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default AlbumGrid;
