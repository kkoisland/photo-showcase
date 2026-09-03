// 公開用(pnpm run deploy)専用のビルド設定。
// エントリを viewer.html (src/main.viewer.tsx) だけに限定することで、
// AdminApp / AdminPublishButton / s3Utils(AWSの鍵を読み込む)が
// このビルドのモジュールグラフに一切含まれないことを保証する。
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rollupOptions: {
			input: path.resolve(__dirname, "viewer.html"),
		},
	},
});
