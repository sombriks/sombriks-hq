<template>
  <div>
    <div id="cnv"></div>
    <!-- -->
    <a href="https://stackexchange.com/users/184203">
      <img
        src="https://stackexchange.com/users/flair/184203.png?theme=dark"
        width="208"
        height="58"
        alt="profile for Sombriks on Stack Exchange, a network of free, community-driven Q&amp;A sites"
        title="profile for Sombriks on Stack Exchange, a network of free, community-driven Q&amp;A sites"
      >
    </a>
    <!-- -->
    <h2>Programming languages</h2>
    <p>Javascript, Java, SQL, CSS, HTML, C, C++, PHP, Python, Ruby</p>
    <h2>Platforms and runtimes</h2>
    <p>Linux, Windows, JVM, Nodejs, MySQL, Postgresql</p>
    <h2>Frameworks</h2>
    <p>
      Express, Knex.js, Vue.js, Vue Material, mocha, chai, axios, Bootstrap, Phaserjs, Pixi.js, Font Awesome, Material Design Icons,
      Angularjs (1.x), Angular material (1.x), JEE (JPA, JSF, JMS, etc.), Flywaydb, JUnit
    </p>
    <h2>Cool tools and services</h2>
    <p>
      Cordova, NPM, Browserify, PgAdmin3, iReport, Elastic Email, Onesignal, nativescript (vue edition)
      Make, CMake, Maven, Gradle, Ant
    </p>
    <h2>Good pratices</h2>
    <p>
      Funcional Programming, Object-oriented programming, Design Patterns (GOF: factory, facade, adapter, strategy, decorator, etc),
      Test-driven development, Unified modeling language, Model-view-controller, Model-view-view-model, Database Migrations
    </p>
    <h2>Misc</h2>
    <p>Project management, Requirements analysis, Scrum</p>
  </div>
</template>

<script>
const PIXI = require("pixi.js");
const imgs = [
  "picture_9-a.jpg",
  "picture_9.jpg",
  "picture_10.jpg",
  "picture_11.jpg",
  "picture_12.jpg",
  "picture_13.jpg",
  "picture_15.jpg",
  "picture_16.jpg",
  "picture_17.jpg",
  "picture_21.jpg"
];
module.exports = {
  name: "Skills",
  mounted() {
    this.$store.commit("setTitle", "Skills");
    app = new PIXI.Application(350, 50);
    document.getElementById("cnv").appendChild(app.view);

    const textures = imgs.map(e =>
      PIXI.Texture.fromImage(`assets/profile-pics/${e}`)
    );

    let idx = 0;

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
  }
};
</script>
