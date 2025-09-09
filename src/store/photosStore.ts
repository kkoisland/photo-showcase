import { create } from "zustand";
import type { Photo } from "../types";

interface PhotosState {
	photos: Photo[];
	setPhotos: (photos: Photo[]) => void;
	addPhoto: (photo: Photo) => void;
	updatePhoto: (photo: Photo) => void;
	removePhoto: (id: string) => void;
	toggleFavorite: (id: string) => void;
}

export const usePhotosStore = create<PhotosState>((set) => ({
	photos: [],
	setPhotos: (photos) => set({ photos }),
	addPhoto: (photo) => set((s) => ({ photos: [...s.photos, photo] })),
	updatePhoto: (photo) =>
		set((s) => ({
			photos: s.photos.map((p) => (p.id === photo.id ? { ...p, ...photo } : p)),
		})),
	removePhoto: (id) =>
		set((s) => ({
			photos: s.photos.filter((p) => p.id !== id),
		})),
	toggleFavorite: (id) =>
		set((s) => ({
			photos: s.photos.map((p) =>
				p.id === id ? { ...p, favorite: !p.favorite } : p,
			),
		})),
}));
