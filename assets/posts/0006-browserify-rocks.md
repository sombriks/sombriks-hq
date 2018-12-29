# Browserify rocks and that's why

**DISCLAIMER: it does not means that other bundlers sucks.**

Well, [browserify](http://browserify.org/) is a javascript module bundler.
But this one have special features which can save you from a lot of trouble.

## But what is a bundler after all

Back in time when you need to use javascript on a web page all you had to do
was to put a script tag on int and that's it.

A shiny alert box when the user hits the button.

Time passed and people started to abuse of javascript, using it to build very
complex, cabalistic systems instead of fancy stars following the cursor.

_It demanded the creation of new industries, new technologies and... new sacrifices._

You see, the module concept itself isn't news on the science computer thing.
Lots of languages implement it and the script tags in the html document are
modules, in a way.

The problem with them was the dirty namespace and module dependency.

One tag could overwrite the variables and functions defined by other tag.

If certain tags depended from other tags, they should be placed in the correct
order into the html document.

So, the growing complexity of pieces of software built with javascript demanded
solid solutions to this issue. We debanded from C/C++ for quite similar reason.

In 2009 [ServerJS/CommonsJS](http://www.commonjs.org/history/) started a thing
that reshaped the javascript scenario.

In 2010 [RequireJS](https://requirejs.org/docs/history.html) took this and made
things even more interesting. There where modules and the browser could load
them at runtime.

Then became possible to build more complex applications and have a clean,
secure and quite previsible way to build serious software. You could define a
module in one script and then require it into another module. but things didn't
stopped there.

You see, lots of small downloads still opens a chance of error if the client
connection is unstable. So the next step of evolution was to **bundle** up all
modules at once and deliver it to the client in a single http connection.

 ![pic1.jpg](assets/post-pics/0006-browserify-rocks/pic1.jpg)

a picture stolen from webpack site explaining how a bundle works

In 2011 came the [Browserify](https://en.wikipedia.org/wiki/Browserify) and in
2012 [Webpack](https://en.wikipedia.org/wiki/Webpack)
and [later](https://rollupjs.org/guide/en) [many](https://poi.js.org/)
[others](https://parceljs.org/).

[There](https://gulpjs.com/) [where](https://gruntjs.com/) also tools to help
the development and bundling phase but those where just plain mistakes. They
should just use [make](<https://en.wikipedia.org/wiki/Make_(software)>) instead.

Nowadays the bundle role is pretty defined. They must be self-sufficient, clean
and, when possible, demanding zero configuration.
[Other](https://github.com/facebook/create-react-app)
[tools](https://cli.vuejs.org/) [are](https://cli.angular.io/) being built on
top of bundlers and this is how the world will be for a while.

At the moment of time when this post was written, the most popular bundler was
webpack.

## If there is webpack why should i learn another one

Well, some people are just happy enough eating the same caviar over and over.
But how about tapioca? and chocolate cake?

You got the idea.

One very good application is to test some tech on a slightly different
point of view.

You can, for example, compare two
[similar](https://github.com/sombriks/cordova-react-issue)
[applications](https://github.com/sombriks/sample-cordova-vue) and see if that
nasty bug gets fixed with some environment trick.

You can also do dirty and fast experiments without the need of a complete
project.

Well, to achieve such goals any bundler do the job right? So, what is special
about the Browserify?

## Node things on browser and why does it rocks

Unlike other bundlers, browserify born with a quite interesting purpose:
it aims to offer node.js apis to the browser, in the best "fake until make it"
fashion you could imagine.

For example, when your bundler is browserify you can check the process global.
It will fake most of the available attributes to be checked in your
client/browser environment.

You can import a [npm](https://www.npmjs.com/) module called
[brfs](https://github.com/browserify/brfs) and perform filesystem operations,
can you how rad is that?

By using a transform called [envify](https://github.com/hughsk/envify) you can
easily make your code pay the correct attention to environment variables!
There is no easy way to build profile-aware code, trust me.

## Mega man X

One important thing to understand about browserify is it's modular nature.
It does one thing and one thing only, and do it pretty well. Everything else is
either a transformation or an plugin.

[Tree-shaking](https://github.com/browserify/common-shakeify)? Transformation.

[CSS](https://www.npmjs.com/package/browserify-css),
[SCSS](https://github.com/davidguttman/sassify),
[Stylus](https://www.npmjs.com/package/stylify) loading? Transformation.

[Vue SFC](https://vuejs.org/v2/guide/single-file-components.html)
[files](https://github.com/vuejs/vueify)? Transformation.

[Babel](https://github.com/babel/babelify)? Transformation.

It's pretty much like mega man x getting armor parts.

## Always about scaling up and down

But other bundlers and tools can bring a lot of features _out of the box_, so
why use a tool with little features?

If you pay attention there are scenarios where the extra shiny parts are just
distraction.

You can find better clues using a simple and faster tool than one filled with
options you never use.

The best one to scale either up or down with a reasonable configuration is, by
far, browserify.

See the [handbook](https://github.com/browserify/browserify-handbook).
Give it a try. Even
[TypeScript](https://www.npmjs.com/package/tsify) speaks with it.

2018-12-27
