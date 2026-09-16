import { useMemo, useState } from "react";
import Masonry from "react-masonry-css";
import { Link, useParams } from "react-router-dom";
import SnackBar from "./components/SnackBar";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";

const PhotoGrid = () => {
	const { albumId } = useParams<{ albumId: string }>();
	const allPhotos = usePhotosStore((s) => s.photos);
	const updatePhoto = usePhotosStore((s) => s.updatePhoto);
	const album = useAlbumsStore((s) => s.albums.find((a) => a.id === albumId));
	const photos = useMemo(() => {
		return allPhotos
			.filter((p) => p.albumId === albumId)
			.sort((a, b) => ((a.date ?? "") > (b.date ?? "") ? 1 : -1));
	}, [allPhotos, albumId]);

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		500: 1,
	};

	const handleToggleSelect = (
		e: React.MouseEvent,
		photoId: string,
		index: number,
	) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (e.shiftKey && lastClickedIndex !== null) {
				const start = Math.min(lastClickedIndex, index);
				const end = Math.max(lastClickedIndex, index);
				for (let i = start; i <= end; i++) {
					next.add(photos[i].id);
				}
			} else if (next.has(photoId)) {
				next.delete(photoId);
			} else {
				next.add(photoId);
			}
			return next;
		});
		setLastClickedIndex(index);
	};

	const handleMoveSelectedAfter = (e: React.MouseEvent, targetId: string) => {
		e.preventDefault();
		e.stopPropagation();

		const selected = photos.filter((p) => selectedIds.has(p.id));
		if (selected.length === 0) return;

		const targetIndex = photos.findIndex((p) => p.id === targetId);
		const target = photos[targetIndex];

		let nextIndex = targetIndex + 1;
		while (nextIndex < photos.length && selectedIds.has(photos[nextIndex].id)) {
			nextIndex++;
		}
		const nextPhoto = photos[nextIndex];

		const startTime = new Date(target.date ?? Date.now()).getTime();
		const endTime = nextPhoto
			? new Date(nextPhoto.date ?? Date.now()).getTime()
			: startTime + (selected.length + 1) * 1000;
		const step =
			endTime > startTime
				? (endTime - startTime) / (selected.length + 1)
				: 1000;

		for (const [i, photo] of selected.entries()) {
			updatePhoto({
				...photo,
				date: new Date(startTime + step * (i + 1)).toISOString(),
			});
		}

		setSelectedIds(new Set());
		setLastClickedIndex(null);
	};

	return (
		<div style={{ padding: 20 }}>
			<h1 className="text-2xl font-bold mb-2">
				{album ? album?.title : "Photos in Album"}
			</h1>
			{import.meta.env.DEV && selectedIds.size > 0 && (
				<div className="mb-2 text-sm flex items-center gap-2">
					<span>{selectedIds.size} selected</span>
					<button
						type="button"
						onClick={() => {
							setSelectedIds(new Set());
							setLastClickedIndex(null);
						}}
						className="underline cursor-pointer"
					>
						Clear
					</button>
				</div>
			)}
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className="my-masonry-grid"
				columnClassName="my-masonry-grid_column"
			>
				{photos.map((p, index) => (
					<Link key={p.id} to={`/photos/${p.id}`} className="relative block">
						{p.type === "video" && p.title.toLowerCase().endsWith(".mov") ? (
							<div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
								<span className="text-gray-500">
									.mov file — Not supported yet
								</span>
							</div>
						) : p.type === "video" ? (
							<video src={p.url} muted playsInline className="w-full rounded" />
						) : (
							<img src={p.url} alt={p.title} className="w-full rounded" />
						)}
						{p.description && (
							<div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-2 py-1 rounded-b line-clamp-1 text-center">
								{p.description}
							</div>
						)}
						{import.meta.env.DEV && (
							<button
								type="button"
								onClick={(e) => handleToggleSelect(e, p.id, index)}
								className={`absolute top-1 left-1 w-5 h-5 rounded border cursor-pointer flex items-center justify-center text-xs ${
									selectedIds.has(p.id)
										? "bg-blue-600 text-white border-blue-600"
										: "bg-white border-gray-400"
								}`}
							>
								{selectedIds.has(p.id) ? "✓" : ""}
							</button>
						)}
						{import.meta.env.DEV &&
							selectedIds.size > 0 &&
							!selectedIds.has(p.id) && (
								<button
									type="button"
									onClick={(e) => handleMoveSelectedAfter(e, p.id)}
									className="absolute top-1 right-1 text-xs bg-blue-600 text-white px-1 py-0.5 rounded cursor-pointer"
								>
									Move selected here
								</button>
							)}
					</Link>
				))}
			</Masonry>
			<SnackBar />
		</div>
	);
};

export default PhotoGrid;
