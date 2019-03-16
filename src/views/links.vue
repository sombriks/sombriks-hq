<template>
	<div>
		<a target="_blank" href="https://google.com">The best way to learn something</a>
		<a target="_blank" href="https://yahoo.com">When you need to know if dns is really working</a>
		<a
			target="_blank"
			href="https://www.youtube.com/results?search_query=vaporware"
		>White noise to keep focus on working</a>
		<a
			target="_blank"
			href="https://www.w3schools.com/"
		>Docs everyone denies to use and enjoy to deny it</a>
		<a target="_blank" href="https://developer.mozilla.org">The true and correct docs for the web</a>
		<a target="_blank" href="https://vuejs.org/">The good</a>
		<a target="_blank" href="https://reactjs.org/">The bad</a>
		<a target="_blank" href="https://angular.io/">The ugly</a>
		<a
			target="_blank"
			href="http://www.nomnoml.com/"
		>nomnoml! I always forgot this addres but it's so rad!</a>
		<a target="_blank" href="https://docs.oracle.com/javase/tutorial/">Origins</a>
		<a target="_blank" href="https://github.com">How to save the world</a>
		<a target="_blank" href="https://css-tricks.com/">All you need to know about css and more</a>
		<a target="_blank" href="https://www.wikipedia.org/">In need of a printed version</a>
		<a target="_blank" href="https://www.apple.com/">Evil</a>
		<a target="_blank" href="https://www.base64encode.org/">How to speak clearly</a>
		<a target="_blank" href="https://simplycalc.com/base16-encode.php">More clearly</a>
		<a target="_blank" href="https://www.youtube.com/results?search_query=make+good+art">make good art</a>
		<a target="_blank" href="https://haxiomic.github.io/GPU-Fluid-Experiments/html5/?q=Low">Quite relaxing</a>
		<a target="_blank" href="https://www.hackerrank.com">Cool challenges</a>
		<a target="_blank" href="https://xkcd.com/1179/">How to write dates correctly</a>
		<a target="_blank" href="https://devhints.io/">best TL;DR; ever</a>
		<a target="_blank" href="https://trello.com/">Organize your life a little</a>
		<a target="_blank" href="https://dexie.org/">The nicest non-relational database API you'll ever see</a>
		<a target="_blank" href="https://www.postgresql.org/docs/manuals/">Database for serious business</a>
		<a target="_blank" href="https://www.sqlite.org/index.html">Not ANSI SQL but that's ok</a>
		<a target="_blank" href="https://www.destroyallsoftware.com/compendium">Core basics of computer science in a very opinionated way</a>
		<a target="_blank" href="https://www.timsommer.be/famous-laws-of-software-development/">Famous laws of software development</a>
		<a target="_blank" href="http://raganwald.com/2019/02/14/i-love-programming-and-programmers.html">I like the way compilers work</a>
		<a target="_blank" href="https://yuml.me/diagram/scruffy/class/draw">yUML does cool uml</a>
		<a target="_blank" href></a>

		<v-layout column align-center justify-center>
			<br>
			<br>
			<br>
			<h1 class="display-4">
				<i class="icofont-under-construction"></i>
			</h1>
			<p>under construction</p>
		</v-layout>
	</div>
</template>

<script>
module.exports = {
	name: "links",
	mounted() {
		this.$store.commit("setTitle", "Links");
	}
};
</script>
