<template>
	<div class="slidev-layout layout-two-cols">
		<div class="col-left">
			<slot name="default" />
		</div>
		<div class="col-divider" aria-hidden="true"></div>
		<div class="col-right">
			<slot name="right" />
		</div>
	</div>
</template>

<style scoped>
.layout-two-cols {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 2rem;
	height: 100%;
	align-items: start;
}

.col-left,
.col-right {
	display: flex;
	flex-direction: column;
	gap: var(--content-gap, 1.5rem);
	height: 100%;
}

.col-left {
	padding-right: 1rem;
}

.col-right {
	padding-left: 1rem;
}

.col-divider {
	width: 1px;
	height: 100%;
	background: linear-gradient(
		180deg,
		transparent 0%,
		var(--theme-border) 15%,
		var(--theme-border) 85%,
		transparent 100%
	);
	position: relative;
}

.col-divider::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 8px;
	height: 8px;
	background: var(--theme-primary);
	border-radius: 50%;
}

.col-left :deep(h2),
.col-right :deep(h2) {
	font-size: 1.5rem;
	padding-bottom: 0.5rem;
}

.col-left :deep(p),
.col-right :deep(p) {
	font-size: 1rem;
}

.col-left :deep(ul),
.col-right :deep(ul),
.col-left :deep(ol),
.col-right :deep(ol) {
	font-size: 1rem;
}
</style>
