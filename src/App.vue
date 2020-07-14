<template>
	<div :class="$style.container">
		<h1>{{ $store.state.title }}</h1>
		<div>
			<router-link v-if="$route.path != '/principal'" to="/principal">Back</router-link>
		</div>
		<div class="container">
			<router-view />
		</div>
		<div id="footer">&copy; sombriks (a.k.a. Leonardo Silveira) {{ year }}</div>
	</div>
</template>
<script>
const year = new Date().getFullYear();

export default {
	name: "app",
	data() {
		return { year };
	}
};
</script>
<style lang="scss" module>
@import "./design";
</style>


<style scoped>
@media (min-width: 480px) {
	.container {
		max-width: 95%;
	}
}
@media (min-width: 800px) {
	.container {
		max-width: 75%;
	}
}
@media (min-width: 1440px) {
	.container {
		max-width: 50%;
	}
}
@media (min-width: 1920px) {
	.container {
		max-width: 40%;
	}
}
</style>