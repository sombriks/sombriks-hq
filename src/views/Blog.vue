<template>
	<div>
		<div v-if="!current && !loading" :class="$style.wrap">
			<router-link tag="a" :to="`/blog/${p}`" v-for="p in posts" :key="p">{{ p }}</router-link>
		</div>
		<div :class="$style.simpleLinks" v-if="current" v-html="current"></div>
		<h2 v-if="loading">Loading...</h2>
	</div>
</template>
<script>
import posts from "../assets/posts";
import marked from "marked";
import hl from "highlight.js";

export default {
	name: "blog",
	data() {
		return {
			posts,
			current: "",
			loading: false
		};
	},
	mounted() {
		this.carrega();
	},
	watch: {
		"$route.params.post"() {
			this.carrega();
		}
	},
	methods: {
		carrega() {
			const p = this.$route.params.post;
			if (!p) return;
			this.loading = true;
			import(`../assets/posts/${p}`).then(module => {
				// console.log(module);
				this.current = marked(module.default, {
					highlight: function(code) {
						return hl.highlightAuto(code).value;
					},
					gfm: true,
					tables: true,
					breaks: false,
					sanitize: false,
					smartLists: true,
					smartypants: false,
					xhtml: false
				});
				this.loading = false;
			});
		}
	}
};
</script>
<style module lang="scss">
@import "../design";
.simpleLinks {
	a {
		display: inline;
	}
	pre {
		border: solid 0.5px $color1;
		padding: 1em;
		border-radius: 0.6em;
	}
	img {
		width: 100%;
	}
}
</style>
<style lang="scss">
/* highlight.js doesn't play well with modules scopes etc */
@import "../../node_modules/highlight.js/scss/atelier-dune-light.scss";
</style>
