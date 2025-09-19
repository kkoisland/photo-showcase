import { create } from "zustand";
import type { Album } from "../types";

interface AlbumsState {
	albums: Album[];
	setAlbums: (albums: Album[]) => void;
	addAlbum: (album: Album) => void;
	updateAlbum: (album: Album) => void;
	removeAlbum: (id: string) => void;
	addPhotosToAlbum: (albumId: string, photoIds: string[]) => void;
}

export const useAlbumsStore = create<AlbumsState>((set) => ({
	albums: [],
	setAlbums: (albums) => set({ albums }),
	addAlbum: (album) => set((s) => ({ albums: [...s.albums, album] })),
	updateAlbum: (album) =>
		set((s) => ({
			albums: s.albums.map((a) => (a.id === album.id ? { ...a, ...album } : a)),
		})),
	removeAlbum: (id) =>
		set((s) => ({
			albums: s.albums.filter((a) => a.id !== id),
		})),
	addPhotosToAlbum: (albumId, photoIds) =>
		set((s) => ({
			albums: s.albums.map((a) =>
				a.id === albumId
					? {
							...a,
							photoIds: [...a.photoIds, ...photoIds],
							updatedAt: new Date().toISOString(),
						}
					: a,
			),
		})),
}));
