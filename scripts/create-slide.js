import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SLIDES_DIR = path.join(import.meta.dirname, "../slides");

function parseArgs(args) {
	let slug = null;
	let title = null;
	let info = "";

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		const nextArg = args[i + 1];

		if (arg === "--title" && nextArg) {
			title = nextArg;
			i++;
		} else if (arg === "--info" && nextArg) {
			info = nextArg;
			i++;
		} else if (!arg.startsWith("--") && !slug) {
			slug = arg;
		}
	}

	return { slug, title: title || slug, info };
}

function validateSlug(slug) {
	if (!slug) {
		console.error("Error: slug is required");
		console.error(
			"Usage: pnpm create-slide <slug> [--title <title>] [--info <info>]",
		);
		process.exit(1);
	}

	const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
	if (!slugPattern.test(slug)) {
		console.error(`Error: Invalid slug format: "${slug}"`);
		console.error(
			"Slug must contain only lowercase letters, numbers, and hyphens",
		);
		console.error("Examples: react-hooks, my-slide-2024");
		process.exit(1);
	}

	const slideDir = path.join(SLIDES_DIR, slug);
	if (fs.existsSync(slideDir)) {
		console.error(`Error: Slide "${slug}" already exists`);
		process.exit(1);
	}
}

function generateFiles(slug, title, info) {
	return {
		"package.json": `{
	"name": "@slide/${slug}",
	"version": "0.0.1",
	"private": true,
	"scripts": {
		"dev": "slidev --open",
		"build": "slidev build --base /${slug}/ --out ../../dist/${slug}",
		"export-pdf": "mkdir -p ../../pdf && slidev export --output ../../pdf/${slug}.pdf"
	}
}
`,
		"slides.md": `---
title: ${title}
info: |
  ${info}
author: thinceller
theme: ../../packages/theme
highlighter: shiki
drawings:
  persist: false
---

# ${title}

スライド内容をここに追加
`,
		"vite.config.ts": `import { defineConfig } from "vite";

export default defineConfig({
	build: {
		emptyOutDir: true,
	},
});
`,
	};
}

function createSlide(slug, title, info) {
	const slideDir = path.join(SLIDES_DIR, slug);
	const files = generateFiles(slug, title, info);

	fs.mkdirSync(path.join(slideDir, "public"), { recursive: true });

	for (const [filename, content] of Object.entries(files)) {
		fs.writeFileSync(path.join(slideDir, filename), content);
	}

	console.log(`Created: slides/${slug}/`);
	for (const filename of Object.keys(files)) {
		console.log(`  - ${filename}`);
	}
	console.log("  - public/");
}

function runPnpmInstall() {
	console.log("\nRunning pnpm install...");
	execSync("pnpm install", {
		stdio: "inherit",
		cwd: path.join(import.meta.dirname, ".."),
	});
}

function main() {
	const args = process.argv.slice(2);
	const { slug, title, info } = parseArgs(args);

	validateSlug(slug);
	createSlide(slug, title, info);
	runPnpmInstall();

	console.log(`\nSlide "${slug}" created successfully!`);
	console.log("\nTo start development:");
	console.log(`  pnpm --filter @slide/${slug} dev`);
}

main();
