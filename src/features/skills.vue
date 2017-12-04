<template>
  <div>
    <div id="cnv"></div>
    <h1>Skills</h1>
    <h2>Programming languages</h2>
    <p>Javascript, Java, SQL, CSS, HTML, C, C++, PHP, Python, Ruby</p>
    <h2>Platforms and runtimes</h2>
    <p>Linux, Windows, JVM, Nodejs, MySQL, Postgresql</p>
    <h2>Frameworks</h2>
    <p>Express, Knex.js, Vue.js, Vue Material, mocha, chai, axios, Bootstrap, Phaserjs, Pixi.js, Font Awesome, Material Design Icons, 
      Angularjs (1.x), Angular material (1.x), JEE (JPA, JSF, JMS, etc.), Flywaydb, JUnit</p>
    <h2>Cool tools and services</h2>
    <p>Cordova, NPM, Browserify, PgAdmin3, iReport, Elastic Email, Onesignal, 
      Make, CMake, Maven, Gradle, Ant</p>
    <h2>Good pratices</h2>
    <p>Funcional Programming, Object-oriented programming, Design Patterns (GOF: factory, facade, adapter, strategy, decorator, etc), 
      Test-driven development, Unified modeling language, Model-view-controller, Model-view-view-model, Database Migrations</p>
    <h2>Misc</h2>
    <p>Project management, Requirements analysis, Scrum</p>
  </div>
</template>

<script>
const PIXI = require("pixi.js");
module.exports = {
  name: "Skills",
  mounted() {
    const app = new PIXI.Application(350, 50, {
      backgroundColor: 0xffffff
    });
    document.getElementById("cnv").appendChild(app.view);

    var pic = PIXI.Sprite.fromImage("assets/profile-pics/picture_16.jpg");
    pic.anchor.set(0.5, 0.3);
    pic.x = app.renderer.width / 2;
    pic.y = app.renderer.height / 2;
    app.stage.addChild(pic);
    app.ticker.add(delta => {
      pic.rotation += 0.04 * delta;
    });
  }
};
</script>

<style>

</style>
