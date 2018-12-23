<template>
	<v-layout row justify-center wrap>
		<v-flex xs12>
			<apexchart type="bar" height="600" :options="chartOptions" :series="series"/>
		</v-flex>
	</v-layout>
</template>
<script>
const doOptions = require("./do-chart-options");
const labels = [
	"Functional Programming",
	"Object-Oriented Programming",
	"Design Patterns",
	"TDD",
	"UML",
	"MVVW",
	"Project Management",
	"Requirements Analysis",
	"Scrum"
];
module.exports = {
	name: "chart-social",
	data() {
		return {
			chartOptions: doOptions(labels),
			series: [{ data: [95, 90, 85, 70, 60, 55, 50,50,50] }]
		};
	}
};
</script>
