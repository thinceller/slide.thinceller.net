<template>
	<div class="slidev-layout layout-end">
		<div class="end-content">
			<slot />
		</div>
		<div class="end-decoration" aria-hidden="true">
			<div class="circle-ring"></div>
			<div class="circle-ring circle-ring-2"></div>
			<div class="circle-ring circle-ring-3"></div>
		</div>
	</div>
</template>

<style scoped>
.layout-end {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
	position: relative;
}

.end-content {
	position: relative;
	z-index: 1;
}

.end-content :deep(h1) {
	font-size: 5rem;
	font-weight: 700;
	letter-spacing: -0.04em;
	margin-bottom: 1rem;
	background: linear-gradient(
		135deg,
		var(--theme-text) 0%,
		var(--theme-primary) 100%
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.end-content :deep(p) {
	font-size: 1.125rem;
	color: var(--theme-text-muted);
}

.end-content :deep(a) {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1.5rem;
	padding: 0.75rem 1.5rem;
	background: var(--theme-primary);
	color: white;
	border-radius: 6px;
	font-weight: 500;
	transition: transform 0.2s var(--ease-out-expo), box-shadow 0.2s ease;
}

.end-content :deep(a:hover) {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px -8px var(--theme-primary);
	background-size: 0;
}

.end-decoration {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	z-index: 0;
}

.circle-ring {
	position: absolute;
	width: 400px;
	height: 400px;
	border: 1px solid var(--theme-border);
	border-radius: 50%;
	opacity: 0.4;
	animation: pulse 4s ease-in-out infinite;
}

.circle-ring-2 {
	width: 500px;
	height: 500px;
	animation-delay: 0.5s;
	opacity: 0.3;
}

.circle-ring-3 {
	width: 600px;
	height: 600px;
	animation-delay: 1s;
	opacity: 0.2;
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
		opacity: 0.4;
	}
	50% {
		transform: scale(1.02);
		opacity: 0.2;
	}
}
</style>
