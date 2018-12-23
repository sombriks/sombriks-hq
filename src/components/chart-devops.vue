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
const series1 = [100, 80, 80, 70, 60, 60];
const labels1 = ["Linux", "PostgreSQL", "NODE", "JVM", "Windows", "OSX"];
const series2 = [95, 85, 80, 40];
const labels2 = ["MySQL", "Systemd", "GIT", "Docker"];
module.exports = {
	name: "chart-devops",
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
