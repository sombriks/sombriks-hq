const list = require("../assets/links.json")

module.exports = class {
    data() {
        return {
            "layout": "base.webc"
        }
    }

    mkLink(l) {
        return `<a style="display:inline-block;" href="${l.link}" target="_blank">${l.label}</a>\n`
    }

    render(data) {
        return `<br/>${list.map(this.mkLink).join("")}`
    }
}
