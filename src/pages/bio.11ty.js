const cv = require("../assets/curriculum.json")

module.exports = class {
  data() {
    return {
      "layout": "base.webc"
    }
  }

  renderWork(w) {
    return "<my-card></my-card>"
  }

  render(data) {
    return `
      ${cv.work.map(this.renderWork).join("")}
    `
  }
}
