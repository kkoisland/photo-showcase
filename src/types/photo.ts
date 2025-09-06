export interface Photo {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface Album {
  id: string;
  title: string;
  photos: Photo[];
}
