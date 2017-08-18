// src/main.js

require("./index.css");

const PIXI = require("pixi.js");

const app = new PIXI.Application(window.innerWidth, window.innerHeight);

window.addEventListener("resize", _ => app.renderer.resize(window.innerWidth, window.innerHeight))
document.getElementById("root").appendChild(app.view);


app.stage.addChild(require("./letreiro"));
