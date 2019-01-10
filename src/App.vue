<template>
	<v-app dark>
		<v-navigation-drawer app v-model="drawer" width="480">
			<side-menu/>
		</v-navigation-drawer>
		<v-toolbar app>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<h1>{{title}}</h1>
		</v-toolbar>
		<v-content>
			<v-container fluid>
				<router-view @abremenu="drawer = !drawer"></router-view>
			</v-container>
		</v-content>
		<v-footer app>
			<v-layout row align-center justify-center>&copy; sombriks (a.k.a. Leonardo Silveira) {{year}}</v-layout>
		</v-footer>
	</v-app>
</template>

<script>
const { mapState } = require("vuex");
module.exports = {
	name: "App",
	data: _ => ({ drawer: false, year: new Date().getFullYear() }),
	computed: mapState(["title"])
};
</script>
