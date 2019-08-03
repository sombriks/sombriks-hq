<template>
	<div>
		<p>
			Welcome to my headquarters! Please use the
			<v-btn flat icon @click="$emit('abremenu')">
				<v-icon>menu</v-icon>
			</v-btn>the topbar to see more content.
		</p>
		<p>
			In this landing page
			<v-btn flat icon @click="$emit('abremenu')">
				<v-icon>account_circle</v-icon>
			</v-btn>you can see what i am doing or used to do.
		</p>
		<p>
			In Skills
			<v-btn flat icon @click="$router.push('/skills')">
				<v-icon>build</v-icon>
			</v-btn>section you can see how good i think i am.
		</p>
		<p>
			In Showcase
			<v-btn flat icon @click="$router.push('/showcases')">
				<v-icon>stars</v-icon>
			</v-btn>section you can see nice solutions i created (under construction).
		</p>
		<p>
			In Link
			<v-btn flat icon @click="$router.push('/links')">
				<v-icon>link</v-icon>
			</v-btn>section you can see very, very important links.
		</p>
		<p>
			In Blog
			<v-btn flat icon @click="$emit('abremenu')">
				<v-icon>collections_bookmark</v-icon>
			</v-btn>section lies some thoughts i decided to share with the world.
		</p>
		<p>
			If you need a print-friendly (pdf) version of
			<a target="mycv" href="assets/curriculum.json">my cv</a>, please
			<a class="underlineme" @click="clickpdf">click here</a>.
		</p>
		<hr />
		<h2>A bit of History</h2>
		<small>same colors means same working group, just different business</small>
	</div>
</template>
<script>
const { makeCV } = require("./make-cv-pdf");
module.exports = {
	name: "basic-instructions",
	methods: {
		clickpdf() {
			makeCV();
		}
	}
};
</script>
<style>
.underlineme{
	text-decoration: underline;
}
</style>
