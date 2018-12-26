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
	"npm",
	"browserify",
	"webpack",
	"make",
	"gcc",
	"maven",
	"gradle",
	"android adb"
];
module.exports = {
	name: "chart-dev-tools",
	data: _ => ({
		series: [{ data: [70, 65, 55, 55, 50, 45, 45, 40] }],
		chartOptions: doOptions(labels)
	})
};
</script>

<style>
</style>
