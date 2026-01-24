<template>
	<div class="slidev-layout layout-default">
		<div class="content-wrapper">
			<slot />
		</div>
		<div class="slide-decoration" aria-hidden="true">
			<div class="corner-accent"></div>
		</div>
	</div>
</template>

<style scoped>
.layout-default {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.content-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--content-gap, 1.5rem);
	position: relative;
	z-index: 1;
}

.slide-decoration {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;
}

.corner-accent {
	position: absolute;
	bottom: 2rem;
	right: 2rem;
	width: 60px;
	height: 60px;
	border-right: 2px solid var(--theme-border);
	border-bottom: 2px solid var(--theme-border);
	opacity: 0.6;
}
</style>
