<template>
	<v-layout row justify-center wrap>
		<v-flex xs12>
			<apexchart type="bar" height="500" :options="chartOptions" :series="series"/>
		</v-flex>
	</v-layout>
</template>

<script>
const doOptions = require("./do-chart-options");
const labels = [
	"vue",
	"express.js",
	"knex.js",
	"Bookshelf.js",
	"AngularJS (1.x)",
	"JQuery",
	"JEE (JPA,JSF, JMS, ETC)",
	"Apache Cordova",
	"Spring Boot",
	"Vue Nativescript",
	"React",
	"Angular 2.x - 8.x",
];
module.exports = {
	name: "chart-frameworks",
	data: _ => ({
		series: [{ data: [150, 120, 110, 97, 90, 85, 70, 70, 60, 35, 29, 5] }],
		chartOptions: doOptions(labels)
	})
};
</script>

<style>
</style>
