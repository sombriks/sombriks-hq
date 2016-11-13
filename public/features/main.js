var angular = require("angular");

var mdl = angular.module("sombriks", [
  require("angular-route")
]);

mdl.controller("indexpage", require("./indexpage/controller"));

mdl.config(function ($routeProvider) {
  var uc = require("./underconstruction/fragment");

  $routeProvider.when(uc.uri, uc.cfg);
  $routeProvider.otherwise(uc.uri);

});


module.exports = mdl;