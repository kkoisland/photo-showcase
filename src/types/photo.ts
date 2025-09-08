export interface Photo {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt?: string;
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
