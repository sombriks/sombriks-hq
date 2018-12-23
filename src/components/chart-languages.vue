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
	"Javascript",
	"Java",
	"SQL",
	"HTML",
	"CSS",
	"C",
	"C++",
	"PHP",
	"Python",
	"GO",
	"Ruby"
];
module.exports = {
	name: "chart-languages",
	data: _ => ({
		series: [{ data: [160, 110, 90, 85, 80, 80, 60, 30, 15, 14, 9] }],
		chartOptions: doOptions(labels)
	})
};
</script>

<style>
</style>
