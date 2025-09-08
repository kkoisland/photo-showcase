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
