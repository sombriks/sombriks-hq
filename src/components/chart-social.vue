<template>
	<v-layout row justify-center wrap>
		<v-flex xs12 sm6>
			<apexchart type="radialBar" height="600" :options="chartOptions" :series="series"/>
		</v-flex>
	</v-layout>
</template>
<script>
const doOptions = require("./do-chart-options");
const series = [95,90,85, 70, 60, 55];
const labels = ["Functional Programming", "Object-Oriented Programming", "Design Patterns", "TDD", "UML", "MVVW"];
module.exports = {
	name: "chart-social",
	data() {
		return {
			chartOptions: doOptions(series, labels),
			series
		};
	}
};
</script>
