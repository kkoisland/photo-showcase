import { createContext, useContext } from "react";
import type { Photo } from "./types";

/**
 * The real implementations live in s3Utils.ts, which loads AWS credentials
 * and must never be imported from a component reachable by the viewer build
 * (routes.tsx is shared between AdminApp and App). AdminApp.tsx is the only
 * place that imports s3Utils.ts and provides this context; shared components
 * only depend on this type-only, AWS-free module.
 */
export interface AdminS3Api {
	uploadPhoto: (photo: Photo) => Promise<{ key: string; url: string }>;
	deletePhoto: (photo: Photo) => Promise<void>;
	deletePhotos: (photos: Photo[]) => Promise<void>;
}

export const AdminS3Context = createContext<AdminS3Api | null>(null);

/**
 * Returns null outside AdminApp (e.g. the viewer build, or before it mounts
 * its provider). AlbumCard/PhotoModal render unconditionally for both admin
 * and viewer, so callers must guard against null rather than assume it's set.
 */
export const useAdminS3 = (): AdminS3Api | null => useContext(AdminS3Context);
