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
}

export const AdminS3Context = createContext<AdminS3Api | null>(null);

export const useAdminS3 = (): AdminS3Api => {
	const ctx = useContext(AdminS3Context);
	if (!ctx) {
		throw new Error("useAdminS3 must be used within AdminApp");
	}
	return ctx;
};
