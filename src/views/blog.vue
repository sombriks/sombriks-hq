<template>
	<div>
		<br>
		<div v-html="content"></div>
		<v-layout v-if="loading" justify-center align-center>
			<div class="text-xs-center">
				<v-progress-circular :size="150" color="white" indeterminate>loading...</v-progress-circular>
			</div>
		</v-layout>
		<v-layout v-if="!gotcontent">
			<div class="text-xs-center">
				Looking for something to read? Hit the <v-icon href="">menu</v-icon> in the topbar.
			</div>
		</v-layout>
	</div>
</template>

<script>
const fs = require("fs");
const axios = require("axios");
const marked = require("marked");
marked.setOptions({
	highlight: function(code) {
		return require("highlight.js").highlightAuto(code).value;
	},
	gfm: true,
	tables: true,
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	xhtml: false
});
module.exports = {
	name: "Blog",
	data: _ => ({
		content: "Sometimes i write down something.",
		loading: false,
		gotcontent: false
	}),
	mounted() {
		if (this.$route.params.post) this.getpost(this.$route.params.post);
		this.$store.commit("setTitle", "Blog");
	},
	methods: {
		getpost(post) {
			this.loading = true;
			this.content = "";
			axios
				.get(`assets/posts/${post}`)
				.then(ret => {
					this.content = marked(ret.data);
					this.$store.commit("setTitle", post);
					this.loading = false;
					this.gotcontent = true;
					window.scrollTo(0, 0);
				})
				.catch(err => {
					console.log(err);
					this.content = marked("_Hey, it does not exists. Yet._");
					this.loading = false;
				});
		}
	},
	watch: {
		"$route.params.post"(v) {
			if (!v) this.content = marked("_Hey, it does not exists. Yet._");
			else this.getpost(v);
		}
	}
};
</script>

<style>
</style>
