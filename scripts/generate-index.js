import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SLIDES_DIR = path.join(import.meta.dirname, "../slides");
const OUTPUT_PATH = path.join(import.meta.dirname, "../public/index.html");

function getSlideData(file) {
	const filePath = path.join(SLIDES_DIR, file);
	const content = fs.readFileSync(filePath, "utf-8");
	const { data } = matter(content);
	const slug = file.replace(".md", "");

	return {
		slug,
		title: data.title || slug,
		description: data.description || "",
	};
}

function renderSlideItem(slide) {
	const description = slide.description
		? `<p class="slide-description">${slide.description}</p>`
		: "";

	return `    <li class="slide-item">
      <a href="/${slide.slug}">${slide.title}</a>
      ${description}
    </li>`;
}

function generateIndexHTML(slides) {
	const slideListHTML = slides.map(renderSlideItem).join("\n");

	return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slides - thinceller</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #fafafa;
    }
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
    .slide-list {
      list-style: none;
    }
    .slide-item {
      background: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .slide-item a {
      color: #0066cc;
      text-decoration: none;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .slide-item a:hover {
      text-decoration: underline;
    }
    .slide-description {
      color: #666;
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <h1>Slides</h1>
  <ul class="slide-list">
${slideListHTML}
  </ul>
</body>
</html>`;
}

// Main
const mdFiles = fs
	.readdirSync(SLIDES_DIR)
	.filter((file) => file.endsWith(".md"));

const slides = mdFiles.map(getSlideData);
const html = generateIndexHTML(slides);

fs.writeFileSync(OUTPUT_PATH, html, "utf-8");
console.log(`Generated: ${OUTPUT_PATH}`);
console.log(`Total slides: ${slides.length}`);
