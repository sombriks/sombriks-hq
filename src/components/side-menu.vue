<template>
	<v-layout column>
		<v-layout column justify-center align-center>
			<small>keep it simple</small>
			<v-avatar size="256">
				<img
					:src="picture"
					width="200"
					height="200"
					alt="Profile Picture"
					title="click to change"
					@click="changepic"
				>
			</v-avatar>
			<v-layout row>Contact info</v-layout>
			<v-layout row wrap>
				<v-btn title="Facebook" large flat icon target="fb" href="https://www.facebook.com/sombriks">
					<i class="icon ion-logo-facebook size24"></i>
				</v-btn>
				<v-btn title="Twitter" large flat icon target="tw" href="https://twitter.com/sombriks">
					<i class="icon ion-logo-twitter size24"></i>
				</v-btn>
				<v-btn title="Linkedin" large flat icon target="in" href="https://www.linkedin.com/in/sombriks">
					<i class="icon ion-logo-linkedin size24"></i>
				</v-btn>
				<v-btn
					title="Stackoverflow"
					large
					flat
					icon
					target="so"
					href="https://stackoverflow.com/users/420096/sombriks?tab=profile"
				>
					<!-- <i class="icon ion-md-link size24"></i> -->
					<i class="icofont-stack-overflow size24"></i>
				</v-btn>
				<v-btn title="Github" large flat icon target="gh" href="https://github.com/sombriks">
					<i class="icon ion-logo-github size24"></i>
				</v-btn>
				<v-btn title="NPM" large flat icon target="gh" href="https://www.npmjs.com/~sombriks">
					<i class="icon ion-logo-npm size24"></i>
				</v-btn>
				<!-- <v-btn
          title="Hacker Rank"
          large
          flat
          icon
          target="hh"
          href="https://www.hackerrank.com/sombriks"
        >
          <i class="icon ion-md-link size24"></i>
				</v-btn>-->
			</v-layout>
		</v-layout>
		<v-layout column>
			<v-list>
				<v-list-tile v-for="r in routes" :key="r.path" v-if="r.urlitem" :href="`#${r.urlitem}`">
					<v-list-tile-avatar>
						<v-icon>{{ r.icon }}</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-title>{{r.label}}</v-list-tile-title>
				</v-list-tile>
				<v-list-group>
					<v-list-tile slot="activator">
						<v-list-tile-avatar>
							<v-icon>collections_bookmark</v-icon>
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>Blog</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile v-for="p in posts" :key="p" :href="`#/blog/${p}`">
						<v-list-tile-avatar>
							<v-icon>description</v-icon>
						</v-list-tile-avatar>
						<v-list-tile-title>{{p}}</v-list-tile-title>
					</v-list-tile>
				</v-list-group>
			</v-list>
		</v-layout>
	</v-layout>
</template>

<script>
const fs = require("fs");
const { mapState } = require("vuex");
module.exports = {
	name: "MenuBar",
	data: _ => ({
		posts: fs
			.readdirSync("assets/posts")
			.filter(e => e.endsWith(".md"))
			.reverse(),
		routes: require("../routes").routes,
		idx: 0,
		intervalId: null,
		picture: "assets/profile-pics/picture_17.jpg"
	}),
	computed: mapState(["profilepics"]),
	mounted() {
		this.intervalId = setInterval(_ => this.changepic(), 5000);
	},
	beforeDestroy() {
		clearInterval(this.intervalId);
	},
	methods: {
		changepic() {
			this.idx = (this.idx + 1) % this.profilepics.length;
			this.picture = this.profilepics[this.idx];
		}
	}
};
</script>

<style scoped>
.size24 {
	font-size: 18px !important;
}
</style>