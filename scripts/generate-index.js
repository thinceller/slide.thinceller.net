import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const SLIDES_DIR = path.join(import.meta.dirname, "../slides");
const OUTPUT_DIR = path.join(import.meta.dirname, "../public");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "index.html");

const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>`;

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

function renderSlideItem(slide, index) {
	const num = String(index + 1).padStart(2, "0");
	const descriptionHTML = slide.description
		? `<p class="slide-description">${slide.description}</p>`
		: "";

	return `      <li class="slide-card" style="--i: ${index}">
        <a href="/${slide.slug}" class="card-link">
          <span class="slide-num">${num}</span>
          <div class="card-content">
            <h2 class="slide-title">${slide.title}</h2>
            ${descriptionHTML}
          </div>
          <span class="arrow">
            ${ARROW_SVG}
          </span>
        </a>
      </li>`;
}

function generateIndexHTML(slides) {
	const slideListHTML = slides
		.map((slide, i) => renderSlideItem(slide, i))
		.join("\n");

	return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slides - thinceller</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #455a64;
      --secondary: #fff8e1;
      --accent: #0288d1;
      --card-bg: rgba(69, 90, 100, 0.06);
      --card-border: rgba(69, 90, 100, 0.15);
      --text-muted: rgba(69, 90, 100, 0.7);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      line-height: 1.6;
      background: var(--secondary);
      min-height: 100vh;
      color: var(--primary);
      overflow-x: hidden;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 5rem 2rem;
      position: relative;
    }

    header {
      margin-bottom: 4rem;
    }

    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(3rem, 8vw, 4.5rem);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .subtitle {
      margin-top: 0.75rem;
      font-size: 1.1rem;
      color: var(--text-muted);
    }

    .slide-grid {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .slide-card {
      opacity: 0;
      animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: calc(var(--i) * 0.08s + 0.2s);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card-link {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 2rem;
      background: #fff;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      text-decoration: none;
      color: inherit;
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .card-link:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -12px rgba(69, 90, 100, 0.15);
    }

    .slide-num {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--accent);
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    .card-link:hover .slide-num {
      opacity: 1;
    }

    .card-content {
      min-width: 0;
    }

    .slide-title {
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.4;
      margin: 0;
    }

    .slide-description {
      margin-top: 0.35rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .arrow {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--primary);
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .arrow svg {
      width: 18px;
      height: 18px;
      transition: transform 0.3s;
    }

    .card-link:hover .arrow {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }

    .card-link:hover .arrow svg {
      transform: translateX(3px);
    }

    footer {
      margin-top: 5rem;
      padding-top: 2rem;
      border-top: 1px solid var(--card-border);
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    footer a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.2s;
    }

    footer a:hover {
      color: var(--accent);
    }

    @media (max-width: 640px) {
      .container { padding: 3rem 1.25rem; }
      header { margin-bottom: 2.5rem; }
      .card-link {
        grid-template-columns: auto 1fr;
        gap: 1rem;
        padding: 1.25rem 1.5rem;
      }
      .slide-num { font-size: 1.25rem; }
      .slide-title { font-size: 1.1rem; }
      .arrow { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Slides</h1>
      <p class="subtitle">by thinceller</p>
    </header>
    <ul class="slide-grid">
${slideListHTML}
    </ul>
    <footer>
      <a href="https://github.com/thinceller" target="_blank" rel="noopener">@thinceller</a>
    </footer>
  </div>
</body>
</html>`;
}

function main() {
	const mdFiles = fs
		.readdirSync(SLIDES_DIR)
		.filter((file) => file.endsWith(".md"));
	const slides = mdFiles.map(getSlideData);
	const html = generateIndexHTML(slides);

	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, html, "utf-8");

	console.log(`Generated: ${OUTPUT_PATH}`);
	console.log(`Total slides: ${slides.length}`);
}

main();
