import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const SLIDES_DIR = path.join(import.meta.dirname, "../slides");
const OUTPUT_DIR = path.join(import.meta.dirname, "../dist");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "index.html");

const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

function getSlideData(dirName) {
	const slidesPath = path.join(SLIDES_DIR, dirName, "slides.md");
	const content = fs.readFileSync(slidesPath, "utf-8");
	const { data } = matter(content);

	return {
		slug: dirName,
		title: data.title || dirName,
		description: data.description || data.info || "",
	};
}

function renderSlideItem(slide, index) {
	const num = String(index + 1).padStart(2, "0");
	const description =
		typeof slide.description === "string"
			? slide.description.trim().split("\n")[0]
			: "";
	const descriptionHTML = description
		? `<p class="slide-description">${description}</p>`
		: "";

	return `      <li class="slide-card" style="--i: ${index}">
        <a href="/${slide.slug}/" class="card-link">
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
  <style>
    :root {
      /* 背景 */
      --color-bg: #ffffff;
      --color-bg-secondary: #f9fafb;

      /* テキスト */
      --color-text: #111827;
      --color-text-muted: #6b7280;

      /* ボーダー */
      --color-border: #e5e7eb;

      /* アクセント */
      --color-accent: #2563eb;
      --color-accent-hover: #1d4ed8;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      background: var(--color-bg);
      min-height: 100vh;
      color: var(--color-text);
    }

    .container {
      max-width: 720px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Hero Section - Gaia lead風センター配置 */
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 6rem 1.5rem 4rem;
    }

    .hero h1 {
      font-size: clamp(2rem, 6vw, 3rem);
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.02em;
      color: var(--color-text);
    }

    .hero .subtitle {
      margin-top: 0.5rem;
      font-size: 1rem;
      color: var(--color-text-muted);
    }

    /* Content Section */
    .content {
      padding-bottom: 4rem;
    }

    .slide-grid {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .slide-card {
      opacity: 0;
      animation: fadeIn 0.5s ease-out forwards;
      animation-delay: calc(var(--i) * 0.06s + 0.1s);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card-link {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.5rem;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.2s ease;
    }

    .card-link:hover {
      border-color: var(--color-accent);
    }

    .slide-num {
      font-size: 1rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--color-text-muted);
      min-width: 1.5rem;
    }

    .card-content {
      min-width: 0;
    }

    .slide-title {
      font-size: 1.125rem;
      font-weight: 500;
      line-height: 1.4;
      margin: 0;
    }

    .slide-description {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: var(--color-text-muted);
      line-height: 1.5;
    }

    .arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      transition: color 0.2s ease;
    }

    .arrow svg {
      width: 20px;
      height: 20px;
    }

    .card-link:hover .arrow {
      color: var(--color-accent);
    }

    /* Footer */
    footer {
      padding: 2rem 0;
      border-top: 1px solid var(--color-border);
      text-align: center;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    footer a {
      color: var(--color-text);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    footer a:hover {
      color: var(--color-accent);
    }

    @media (max-width: 640px) {
      .hero {
        padding: 4rem 1rem 3rem;
      }
      .content {
        padding-bottom: 3rem;
      }
      .container {
        padding: 0 1rem;
      }
      .card-link {
        grid-template-columns: auto 1fr;
        gap: 1rem;
        padding: 1rem 1.25rem;
      }
      .slide-title { font-size: 1rem; }
      .arrow { display: none; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <h1>slide.thinceller.net</h1>
    <p class="subtitle">Presentation slides</p>
  </header>
  <main class="content">
    <div class="container">
      <ul class="slide-grid">
${slideListHTML}
      </ul>
    </div>
  </main>
  <footer>
    <div class="container">
      <a href="https://github.com/thinceller" target="_blank" rel="noopener">@thinceller</a>
    </div>
  </footer>
</body>
</html>`;
}

function main() {
	const slideDirs = fs.readdirSync(SLIDES_DIR).filter((name) => {
		const slidesPath = path.join(SLIDES_DIR, name, "slides.md");
		return fs.existsSync(slidesPath);
	});
	const slides = slideDirs.map(getSlideData);
	const html = generateIndexHTML(slides);

	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, html, "utf-8");

	console.log(`Generated: ${OUTPUT_PATH}`);
	console.log(`Total slides: ${slides.length}`);
}

main();
