var PIXI = require("pixi.js");

exports.uri = "/under-construction";
exports.cfg = {
  templateUrl: "features/underconstruction/fragment.html",
  controllerAs: "ctl",
  controller: function ($scope) {

    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
    document.getElementById("tbd").appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    var basicText = new PIXI.Text("Under Construction", { fill: "white" });
    basicText.x = -200;
    basicText.y = 90;
    basicText.interactive = true;
    basicText.buttonMode = true;
    basicText.anchor.set(0.5);

    var last

    function dragEnd(e){
      basicText.y = e.data.global.y;
      //console.debug(e)
    }

    basicText.on('mousemove',dragEnd);
    basicText.on('touchmove',dragEnd);

    stage.addChild(basicText);

    var running = true;

    var self = this;

    self.anim = function (fn) {
      window.requestAnimationFrame(fn);
    };

    self.step = function () {
      if (running)
        self.anim(self.step);
      // render the root container
      renderer.render(stage);
      basicText.x += 1;

      if (basicText.x > window.innerWidth + 200)
        basicText.x = -200;
    }

    self.step();

    $scope.$on("$destroy", function () {
      running = false;
    });

  }
};