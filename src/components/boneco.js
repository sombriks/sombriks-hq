
const PIXI = require("pixi.js");

class Boneco {

  constructor({ app, stage, atlas, position }) {
    const loader = new PIXI.loaders.Loader();
    const key = "atlas" + new Date().getTime()
    loader.add(key, atlas).load((loader, resources) => {
      const data = resources[key].data;
      const textures = resources[key].textures;
      for (let anim in data.animations)
        for (let frame in data.animations[anim])
          data.animations[anim][frame] = textures[data.animations[anim][frame]];
      const anim = data.animations[data.default_animation];
      this.sprite = new PIXI.extras.AnimatedSprite(anim);
      this.sprite.position.set(position.x, position.y);
      stage.addChild(this.sprite)
      app.ticker.add(_ => {
        if (this.walking)
          this.walk()
      })
    });

  }

  walk() {
    const p = { x: this.sprite.x, y: this.sprite.y }
    // console.log({ x: pos.x - p.x, y: pos.y - p.y })
    const pos = this.pos
    const near = this.near
    const speed = this.speed
    const dx = pos.x - p.x
    const dy = pos.y - p.y
    let stopx = false
    let stopy = false
    if (dx < -near)
      this.sprite.x -= speed
    else if (dx > near)
      this.sprite.x += speed
    else
      stopx = true
    if (dy < -near)
      this.sprite.y -= speed
    else if (dy >= near)
      this.sprite.y += speed
    else
      stopy = true
    if (stopx && stopy)
      this.walking = false;
  }

  walkTo(pos, speed = 5, near = 10) {
    this.pos = pos
    this.near = near
    this.speed = speed
    this.walking = true
  }
}

module.exports = Boneco;
