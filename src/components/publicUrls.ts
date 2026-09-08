const region = import.meta.env.VITE_AWS_REGION;
const bucket = import.meta.env.VITE_AWS_S3_BUCKET;

const baseUrl = `http://${bucket}.s3-website-${region}.amazonaws.com`;

export const publicUrlFor = (key: string) => `${baseUrl}/${key}`;

export const albumUrlFor = (albumId: string) => `${baseUrl}/albums/${albumId}`;
