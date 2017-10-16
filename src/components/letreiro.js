
const PIXI = require("pixi.js");

class Letreiro {

  constructor({ stage, texto, position }) {

    // https://pixijs.github.io/examples/#/basics/text.js
    var style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });

    var richText = new PIXI.Text(texto, style);
    richText.x = position.x
    richText.y = position.y

    // https://pixijs.github.io/examples/#/demos/dragging.js

    richText.interactive = true;
    richText.buttonMode = true;
    richText.anchor.set(0.5);

    richText.on('pointerdown', this.onDragStart, richText)
      .on('pointerup', this.onDragEnd, richText)
      .on('pointerupoutside', this.onDragEnd, richText)
      .on('pointermove', this.onDragMove, richText);

    stage.addChild(richText)
  }

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }

  onDragMove() {
    if (this.dragging) {
      var newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }
}
module.exports = Letreiro;