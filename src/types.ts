export interface Photo {
	id: string;
	albumId: string;
	title: string;
	url: string;
	type: "photo" | "video";
	hash: string;
	date?: string;
	description?: string;
	createdAt?: string;
	favorite?: boolean;
}

export interface Album {
	id: string;
	title: string;
	photoIds: string[];
	coverUrl?: string;
	count?: number;
	shared?: boolean;
	updatedAt?: string;
	createdAt: string;
	startDate?: string;
	endDate?: string;
}

export interface LightboxState {
	isOpen: boolean;
	photoId?: string | null;
}

export type SortKey = "title" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface UIState {
	photos: Photo[];
	selectedAlbumId: string | null;
	query: string;
	tag: string | null;
	sort: { key: SortKey; order: SortOrder };
	lightbox: LightboxState;
	view: "grid" | "detail";
}

export const initialUIState: UIState = {
	photos: [],
	selectedAlbumId: null,
	query: "",
	tag: null,
	sort: { key: "createdAt", order: "desc" },
	lightbox: { isOpen: false, photoId: null },
	view: "grid",
};

export interface Snack {
	type: "success" | "error" | "info" | "warning";
	message: string;
}
