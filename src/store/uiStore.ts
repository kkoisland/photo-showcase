import { create } from "zustand";
import type { Photo, SortKey, SortOrder, UIState } from "../types";
import { initialUIState } from "../types";

interface UIStore extends UIState {
	setSelectedAlbum: (id: string | null) => void;
	setQuery: (q: string) => void;
	setTag: (tag: string | null) => void;
	setSort: (key: SortKey, order: SortOrder) => void;
	openLightbox: (photoId: string) => void;
	closeLightbox: () => void;
	reset: () => void;
	replaceAll: (photos: Photo[]) => void;
	mergeById: (photos: Photo[]) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
	...initialUIState,
	setSelectedAlbum: (id) => set({ selectedAlbumId: id }),
	setQuery: (q) => set({ query: q }),
	setTag: (tag) => set({ tag }),
	setSort: (key, order) => set({ sort: { key, order } }),
	openLightbox: (photoId) => set({ lightbox: { isOpen: true, photoId } }),
	closeLightbox: () => set({ lightbox: { isOpen: false, photoId: null } }),
	reset: () => set(initialUIState),
	replaceAll: (photos) => set({ photos }),
	mergeById: (photos) => {
		const current = get().photos ?? [];
		const merged = [
			...current.filter((c) => !photos.find((p) => p.id === c.id)),
			...photos,
		];
		set({ photos: merged });
	},
}));
