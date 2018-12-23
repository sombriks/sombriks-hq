<template>
	<apexchart type="radialBar" height="600" :options="chartOptions" :series="series"/>
</template>

<script>
// const °points =
const series = [100, 99.99, 99.9, 95, 90, 80, 60, 30, 15, 9];
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
	"Ruby"
];
const max = series.reduce((ac, val) => ac + val);
module.exports = {
	name: "chart-languages",
	data: _ => ({
		series,
		chartOptions: {
			labels,
			plotOptions: {
				radialBar: {
					startAngle: -90,
					endAngle: 90,
					dataLabels: {
						name: {
							fontSize: "22px",
							color: "white"
						},
						value: {
							fontSize: "16px",
							formatter: val => val,
							color: "white"
						},
						total: {
							show: true,
							label: "Total",
							formatter: _ => max,
							color: "white"
						}
					}
				}
			}
		}
	})
};
</script>

<style>
</style>
