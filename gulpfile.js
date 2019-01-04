// gulpfile.js
const gulp = require("gulp"); // npm i gulp --save-dev
const rename = require("gulp-rename"); // npm i gulp-rename --save-dev
const budo = require("budo"); // npm i budo --save-dev
const del = require("del"); // npm i del --save-dev
const browserify = require("browserify"); // npm i browserify --save-dev
const fs = require("fs"); // built-in node fs module

const dev = cb => {
  budo("./src/main.js", {
    serve: "build.js",
    live: true,
    open: true,
    host: "127.0.0.1",
    stream: process.stdout,
    watchGlob: "**.{html,css,js,vue,md}"
  });
  cb();
};

const clean = cb => {
  del("public").then(_ => {
    fs.mkdirSync("public");
    cb();
  });
};

const build = cb => {
  browserify({
    entries: "src/main.js"
  })
    .bundle()
    .pipe(fs.createWriteStream("public/build.js"));
  fs.copyFileSync("assets", "public/assets");
  fs.copyFileSync("index.html", "public/index.html");
  cb();
};

const release = cb => {
  cb();
};

exports.dev = dev;
exports.clean = clean;
exports.build = gulp.series(clean, build);
exports.release = gulp.series(clean, build, release);
