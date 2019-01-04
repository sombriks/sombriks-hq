const randomColor = require("randomcolor");
module.exports = labels => ({
  toolbar: { show:false },
  colors: randomColor({
    luminosity: "light",
    hue: "blue",
    count: 30
  }),
  plotOptions: {
    bar: { distributed: true, horizontal: true }
  },
  tooltip: {
    theme: "dark"
  },
  xaxis: {
    categories: labels,
    color: "white",
    labels: {
      style: {
        colors: ["white"]
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        color: "white"
      }
    }
  }
});
