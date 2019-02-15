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
	"Linux",
	"PostgreSQL",
	"NODE",
	"MySQL",
	"JVM",
	"Windows",
	"Systemd",
	"OSX",
	"GIT",
	"Heroku",
	"Digital Ocean",
	"AWS EC2",
	"Docker"
];
module.exports = {
	name: "chart-devops",
	data: _ => ({
		series: [{ data: [110, 80, 80, 70, 60, 60, 55, 50, 50,45,45,45, 9] }],
		chartOptions: doOptions(labels)
	})
};
</script>

<style>
</style>
