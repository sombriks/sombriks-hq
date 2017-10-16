
const PIXI = require("pixi.js");

class Boneco {
  constructor({ stage, atlas, position }) {
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
    });
  }
}

module.exports = Boneco;
