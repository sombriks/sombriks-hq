<template>
	<v-layout row justify-center wrap>
		<v-flex xs12 sm6>
			<apexchart type="radialBar" height="500" :options="chartOptions1" :series="series1"/>
		</v-flex>
		<v-flex xs12 sm6>
			<apexchart type="radialBar" height="500" :options="chartOptions2" :series="series2"/>
		</v-flex>
	</v-layout>
</template>

<script>
const doOptions = require("./do-chart-options");
const series1 = [100, 90, 80, 85, 80];
const series2 = [80, 60, 30, 15, 14, 9];
const labels1 = ["Javascript", "Java", "SQL", "HTML", "CSS"];
const labels2 = ["C", "C++", "PHP", "Python", "GO", "Ruby"];
module.exports = {
	name: "chart-languages",
	data: _ => ({
		series1,
		series2,
		chartOptions1: doOptions(series1, labels1),
		chartOptions2: doOptions(series2, labels2)
	})
};
</script>

<style>
</style>
