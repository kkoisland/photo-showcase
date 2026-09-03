#!/usr/bin/env node
// pnpm build の成果物(dist/)を、フォルダ構成を保ったままS3にアップロードする。
// 実行例: node --env-file=.env scripts/deploy.mjs (通常は `pnpm run deploy` から呼ばれる)
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

const region = process.env.VITE_AWS_REGION;
const bucket = process.env.VITE_AWS_S3_BUCKET;
const accessKeyId = process.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.VITE_AWS_SECRET_ACCESS_KEY;

if (!region || !bucket || !accessKeyId || !secretAccessKey) {
	console.error(
		"Missing AWS env vars. Run with: node --env-file=.env scripts/deploy.mjs",
	);
	process.exit(1);
}

const s3 = new S3Client({
	region,
	credentials: { accessKeyId, secretAccessKey },
});

const CONTENT_TYPES = {
	".html": "text/html",
	".js": "application/javascript",
	".css": "text/css",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".ico": "image/x-icon",
	".txt": "text/plain",
};

const contentTypeFor = (filePath) =>
	CONTENT_TYPES[path.extname(filePath).toLowerCase()] ??
	"application/octet-stream";

async function collectFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectFiles(fullPath)));
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

async function main() {
	const distStat = await stat(distDir).catch(() => null);
	if (!distStat?.isDirectory()) {
		console.error('dist/ not found. Run "pnpm build" first.');
		process.exit(1);
	}

	const files = await collectFiles(distDir);
	console.log(`Uploading ${files.length} files to s3://${bucket}...`);

	for (const filePath of files) {
		const key = path.relative(distDir, filePath).split(path.sep).join("/");
		const body = await readFile(filePath);
		await s3.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: body,
				ContentType: contentTypeFor(filePath),
			}),
		);
		console.log(`  uploaded ${key}`);
	}

	console.log("Done.");
}

main();
