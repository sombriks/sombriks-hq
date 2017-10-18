
const PIXI = require("pixi.js");

class Camera extends PIXI.Container {
  constructor({ app, width = 10000, height = 10000 }) {
    super()
    this.height = height
    this.width = width
    this.app = app
    app.stage.addChild(this)

    app.renderer.plugins.interaction.on("pointerdown", e => {
      // console.log(e.data)
      if(this.sprite){
        const x = e.data.global.x + this.x
        const y = e.data.global.y + this.y
        this.sprite.walkTo({x, y})
      }
    })
  }

  follow(sprite) {
    this.sprite = sprite

  }

  setPosition({ x, y }) {
    this.position.set(x, y);
  }
}
module.exports = Camera