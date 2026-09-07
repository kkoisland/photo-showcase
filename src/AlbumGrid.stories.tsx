import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import AlbumGrid from "./AlbumGrid";
import { useAlbumsStore } from "./store/albumsStore";
import { usePhotosStore } from "./store/photosStore";
import type { Album, Photo } from "./types";

// "N files" 表示を確認するためのダミー写真をアルバムごとに生成する
const PHOTO_COUNTS: Record<string, number> = {
	a1: 42,
	a2: 321,
	a3: 8,
	a4: 420,
	a5: 1003,
	a6: 8,
};

const makeDummyPhotos = (albumId: string, count: number): Photo[] =>
	Array.from({ length: count }, (_, i) => ({
		id: `${albumId}-p${i}`,
		albumId,
		title: `dummy-${i}`,
		url: "https://picsum.photos/200",
		type: "photo",
		hash: `${albumId}-${i}`,
	}));

const meta: Meta<typeof AlbumGrid> = {
	title: "Features/AlbumGrid",
	component: AlbumGrid,
	decorators: [
		(Story, context) => {
			const { albums } = context.args as { albums: Album[] };
			useAlbumsStore.setState({
				albums,
			});
			usePhotosStore.setState({
				photos: albums.flatMap((a) =>
					makeDummyPhotos(a.id, PHOTO_COUNTS[a.id] ?? 0),
				),
			});
			return (
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			);
		},
	],
};
export default meta;

type Story = StoryObj<typeof AlbumGrid>;
export const Default: Story = {
	args: {
		albums: [
			{
				id: "a1",
				title: "Test Album1",
				coverPhotoId: "a1-p0",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "",
				shared: true,
			},
		],
	},
};
export const ThreeAlbums: Story = {
	args: {
		albums: [
			{
				id: "a1",
				title: "Test Album1",
				coverPhotoId: "a1-p0",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "",
				shared: true,
			},
			{
				id: "a2",
				title: "Test Album2",
				coverPhotoId: "a2-p0",
				createdAt: "",
				startDate: "",
				endDate: "",
			},
			{
				id: "a3",
				title: "Test Album3",
				coverPhotoId: "a3-p0",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "2025-09-15",
			},
		],
	},
};

export const SixAlbums: Story = {
	args: {
		albums: [
			{
				id: "a1",
				title: "Test Album1",
				coverPhotoId: "a1-p0",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "",
				shared: true,
			},
			{
				id: "a2",
				title: "Test Album2",
				coverPhotoId: "a2-p0",
				createdAt: "",
				startDate: "",
				endDate: "",
			},
			{
				id: "a3",
				title: "Test Album3",
				coverPhotoId: "a3-p0",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "2025-09-15",
			},
			{
				id: "a4",
				title: "Test Album4",
				coverPhotoId: "a4-p0",
				createdAt: "",
				startDate: "",
				endDate: "",
				shared: true,
			},
			{
				id: "a5",
				title: "Test Album5",
				coverPhotoId: "a5-p0",
				createdAt: "",
				startDate: "",
				endDate: "",
			},
			{
				id: "a6",
				title: "Test Album6",
				coverPhotoId: "a6-p0",
				createdAt: "",
				startDate: "2025-09-01",
				endDate: "2025-09-15",
			},
		],
	},
};
