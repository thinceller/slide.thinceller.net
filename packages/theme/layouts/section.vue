<template>
	<div class="slidev-layout layout-section">
		<div class="section-content">
			<div class="section-number" v-if="$attrs.number" aria-hidden="true">
				{{ String($attrs.number).padStart(2, '0') }}
			</div>
			<slot />
		</div>
		<div class="section-line" aria-hidden="true"></div>
	</div>
</template>

<style scoped>
.layout-section {
	display: flex;
	align-items: center;
	height: 100%;
	position: relative;
	background: var(--theme-primary);
}

.layout-section::before {
	background-image:
		linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
		linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
}

.section-content {
	position: relative;
	z-index: 1;
	color: white;
}

.section-number {
	font-family: var(--font-display);
	font-size: 6rem;
	font-weight: 700;
	line-height: 1;
	opacity: 0.2;
	position: absolute;
	top: -1rem;
	left: -0.5rem;
	letter-spacing: -0.05em;
}

.section-content :deep(h1) {
	font-size: 3.5rem;
	color: white;
	margin-bottom: 0.5rem;
}

.section-content :deep(p) {
	font-size: 1.25rem;
	color: rgba(255, 255, 255, 0.8);
	max-width: 50ch;
}

.section-line {
	position: absolute;
	bottom: 4rem;
	left: var(--slide-padding);
	right: var(--slide-padding);
	height: 1px;
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0.4) 0%,
		rgba(255, 255, 255, 0.1) 100%
	);
}
</style>
