<template>
	<div class="slidev-layout layout-cover">
		<div class="cover-content">
			<div class="accent-line" aria-hidden="true"></div>
			<slot />
		</div>
		<div class="cover-decoration" aria-hidden="true">
			<div class="geometric-element"></div>
			<div class="gradient-orb"></div>
		</div>
	</div>
</template>

<style scoped>
.layout-cover {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 100%;
	position: relative;
	padding-left: 5rem;
}

.layout-cover::before {
	opacity: 0.3;
}

.cover-content {
	position: relative;
	z-index: 1;
	max-width: 70%;
}

.accent-line {
	width: 4rem;
	height: 4px;
	background: var(--theme-primary);
	margin-bottom: 2rem;
	animation: expandLine 0.8s var(--ease-out-expo) 0.2s both;
}

@keyframes expandLine {
	from {
		width: 0;
		opacity: 0;
	}
	to {
		width: 4rem;
		opacity: 1;
	}
}

.cover-content :deep(h1) {
	font-size: 4rem;
	line-height: 1.05;
	margin-bottom: 1.5rem;
	letter-spacing: -0.04em;
}

.cover-content :deep(p) {
	font-size: 1.25rem;
	color: var(--theme-text-secondary);
	max-width: 45ch;
}

.cover-decoration {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
	z-index: 0;
}

.geometric-element {
	position: absolute;
	right: 8%;
	top: 50%;
	transform: translateY(-50%);
	width: 280px;
	height: 280px;
	border: 2px solid var(--theme-border);
	border-radius: 50%;
	opacity: 0.4;
	animation: rotateElement 30s linear infinite;
}

.geometric-element::before {
	content: '';
	position: absolute;
	inset: 30px;
	border: 2px solid var(--theme-primary);
	border-radius: 50%;
	opacity: 0.5;
}

.geometric-element::after {
	content: '';
	position: absolute;
	inset: 60px;
	border: 2px solid var(--theme-border);
	border-radius: 50%;
}

@keyframes rotateElement {
	from { transform: translateY(-50%) rotate(0deg); }
	to { transform: translateY(-50%) rotate(360deg); }
}

.gradient-orb {
	position: absolute;
	right: 0;
	top: 0;
	width: 50%;
	height: 100%;
	background: radial-gradient(
		ellipse at 80% 50%,
		var(--theme-accent-glow) 0%,
		transparent 50%
	);
	opacity: 0.8;
}
</style>
