// src/main.js

require("./index.css");

const PIXI = require("pixi.js");
const Letreiro = require("./components/letreiro");
const Boneco = require("./components/boneco");

const app = new PIXI.Application(window.innerWidth, window.innerHeight);

window.addEventListener("resize", _ => app.renderer.resize(window.innerWidth, window.innerHeight))
document.getElementById("root").appendChild(app.view);

new Boneco({ stage: app.stage, atlas: "assets/boneco.json", position: { x: window.innerWidth / 2, y: window.innerHeight * 0.7 } })
new Letreiro({ stage: app.stage, texto: "em construção", position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } })
