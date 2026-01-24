<template>
	<div class="slidev-layout layout-center">
		<div class="center-content">
			<slot />
		</div>
		<div class="radial-glow" aria-hidden="true"></div>
	</div>
</template>

<style scoped>
.layout-center {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
	position: relative;
}

.center-content {
	max-width: 80%;
	position: relative;
	z-index: 1;
}

.center-content :deep(h1) {
	font-size: 3.5rem;
	margin-bottom: 1.5rem;
}

.center-content :deep(p) {
	font-size: 1.25rem;
	max-width: 50ch;
	margin-left: auto;
	margin-right: auto;
}

.radial-glow {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 600px;
	height: 600px;
	background: radial-gradient(
		circle,
		var(--theme-accent-glow) 0%,
		transparent 70%
	);
	opacity: 0.8;
	pointer-events: none;
	z-index: 0;
}
</style>
