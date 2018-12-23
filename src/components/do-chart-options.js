module.exports = (series, labels) => ({
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
					formatter: _ => series.reduce((ac, val) => ac + val),
					color: "white"
				}
			}
		}
	}
})