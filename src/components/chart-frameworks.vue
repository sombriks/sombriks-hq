<template>
	<v-layout row justify-center wrap>
		<v-flex xs12 sm3>
			<apexchart type="radialBar" height="400" :options="chartOptions1" :series="series1"/>
		</v-flex>
		<v-flex xs12 sm3>
			<apexchart type="radialBar" height="400" :options="chartOptions2" :series="series2"/>
		</v-flex>
		<v-flex xs12 sm3>
			<apexchart type="radialBar" height="400" :options="chartOptions3" :series="series3"/>
		</v-flex>
		<v-flex xs12 sm3>
			<apexchart type="radialBar" height="400" :options="chartOptions4" :series="series4"/>
		</v-flex>
	</v-layout>
</template>

<script>
const doOptions = require("./do-chart-options");
const series1 = [100, 90, 80, 77];
const labels1 = ["vue", "express.js", "knex.js", "Bookshelf.js"];
const series2 = [90, 85, 5];
const labels2 = ["AngularJS (1.x)", "JQuery", "Angular 2.x - 8.x"];
const series3 = [70,50];
const labels3 = ["JEE (JPA,JSF, JMS, ETC)", "Spring"];
const series4 = [75,35];
const labels4 = ["Apache Cordova", "Vue Nativescript"];
module.exports = {
	name: "chart-frameworks",
	data: _ => ({
    series1,
    series2,
		series3,
		series4,
		chartOptions1: doOptions(series1, labels1),
		chartOptions2: doOptions(series2, labels2),
		chartOptions3: doOptions(series3, labels3),
		chartOptions4: doOptions(series4, labels4),
	})
};
</script>

<style>
</style>
