<template>
	<div class="slidev-layout layout-quote">
		<div class="quote-mark" aria-hidden="true">"</div>
		<div class="quote-content">
			<slot />
		</div>
		<div class="quote-decoration" aria-hidden="true"></div>
	</div>
</template>

<style scoped>
.layout-quote {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	position: relative;
	padding-left: 6rem;
}

.quote-mark {
	position: absolute;
	top: 2rem;
	left: 2rem;
	font-family: var(--font-display);
	font-size: 12rem;
	font-weight: 700;
	line-height: 1;
	color: var(--theme-primary);
	opacity: 0.1;
	user-select: none;
}

.quote-content {
	position: relative;
	z-index: 1;
	max-width: 75%;
}

.quote-content :deep(p) {
	font-family: var(--font-display);
	font-size: 2rem;
	font-weight: 400;
	line-height: 1.5;
	color: var(--theme-text);
	font-style: italic;
	margin-bottom: 1.5rem;
}

.quote-content :deep(p:last-of-type) {
	font-family: var(--font-body);
	font-size: 1rem;
	font-style: normal;
	color: var(--theme-text-muted);
	padding-left: 1rem;
	border-left: 2px solid var(--theme-primary);
}

.quote-decoration {
	position: absolute;
	bottom: 3rem;
	right: 3rem;
	width: 120px;
	height: 120px;
	border: 1px solid var(--theme-border);
	opacity: 0.4;
}

.quote-decoration::before {
	content: '';
	position: absolute;
	bottom: -20px;
	right: -20px;
	width: 80px;
	height: 80px;
	border: 1px solid var(--theme-primary);
	opacity: 0.6;
}
</style>
