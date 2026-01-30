<template>
	<div class="slidev-layout layout-image">
		<div class="image-content">
			<slot />
		</div>
	</div>
</template>

<style scoped>
.layout-image {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
}

.image-content {
	max-width: 90%;
	max-height: 90%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.image-content :deep(img) {
	max-height: 70vh;
	object-fit: contain;
}

.image-content :deep(p) {
	font-size: 0.75rem;
	margin-top: 0.5rem;
}
</style>
