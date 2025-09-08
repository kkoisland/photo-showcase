export interface Photo {
  id: string;
  albumId: string;
  title: string;
  url: string;
  description?: string;
  createdAt?: string;
  favorite?: boolean;
}

export interface Album {
  id: string;
  title: string;
  photos: Photo[];
  coverUrl?: string;
  count?: number;
  shared?: boolean;
  updatedAt?: string;
  createdAt: string;
}

export interface LightboxState {
  isOpen: boolean;
  photoId?: string | null;
}

export type SortKey = "title" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface UIState {
  selectedAlbumId: string | null;
  query: string;
  tag: string | null;
  sort: { key: SortKey; order: SortOrder };
  lightbox: LightboxState;
  view: "grid" | "detail";
}

export const initialUIState: UIState = {
  selectedAlbumId: null,
  query: "",
  tag: null,
  sort: { key: "createdAt", order: "desc" },
  lightbox: { isOpen: false, photoId: null },
  view: "grid",
};
