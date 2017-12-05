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
    const app = new PIXI.Application(350, 50);
    document.getElementById("cnv").appendChild(app.view);

    const textures = [];
    let idx = 0;

    PIXI.loader
      .add("pic1", "assets/profile-pics/picture_9-a.jpg")
      .add("pic2", "assets/profile-pics/picture_9.jpg")
      .add("pic3", "assets/profile-pics/picture_10.jpg")
      .add("pic4", "assets/profile-pics/picture_11.jpg")
      .add("pic5", "assets/profile-pics/picture_12.jpg")
      .add("pic6", "assets/profile-pics/picture_13.jpg")
      .add("pic7", "assets/profile-pics/picture_15.jpg")
      .add("pic8", "assets/profile-pics/picture_16.jpg");

    PIXI.loader.load((loader, resources) => {
      let i = 9;
      while (i-->1) textures.push(resources[`pic${i}`].texture);

      const pic = new PIXI.Sprite(textures[0]);
      pic.anchor.set(0.5, 0.3);
      pic.x = app.renderer.width / 2;
      pic.y = app.renderer.height / 2;
      pic.interactive = true;
      pic.on("pointerup", _ => {
        pic.texture = textures[(idx = ++idx % textures.length)];
      });

      app.stage.addChild(pic);

      app.ticker.add(delta => {
        pic.rotation += 0.04 * delta;
      });
    });
  }
};
</script>
