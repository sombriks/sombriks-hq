---
layout: blog-layout.pug
date: 2026-10-23
tags:
  - posts
  - long rant
  - project-structure
  - javascript
  - phaser
  - parcel
  - pwa
draft: false
---
# Web Dev is Simple Again

16 years ago, web development was all about to produce some html pages, a css
style and a couple of scripts. A lot happened since then, but nowadays it's like
16 years ago again. And that's a huge revolution!

This is not a complete return to the same, but to something else entirely. You
see, in the last 16 years so much tools, techniques and cultural changes 
happened that, given a certain point in the recent past, everyone thought that 
web development would crumble over itself due the huge complexity involved.

And complexity by the sake of complexity itself is always a bad bad thing.

## Back in the startup days

Years ago, in 2013, i was young and healthy, full of courage and little wisdom,
so i joined a startup.

We delivered cool, educational games running on android and ios. Lots of fun. 
Then the money dried out and we pivoted the business.

## A tech stack to deliver things fast

In order to grow a single codebase and deliver on both major mobile platforms
(windows phone where already dying in 2014), the games where web applications 
written in javascript using [phaserjs][phaserjs] and those apps where wrapped 
into mobile apps using [apache cordova][cordova]. We did not used a bundler at
first, then we adopted [bower][bower], and [browserify][browserify] over the
following years. We also adopted [angular.js][angular.js] and around 2015,
switched to [vue.js][vue.js], since the new angular was anything but angular,
and [react][react] seemed like someone pulled an animal inside out from the tail
trough the mouth, not a beautiful thing to look at.

[phaserjs]: https://phaser.io/
[cordova]: https://cordova.apache.org/
[bower]: https://bower.io/
[browserify]: https://browserify.org/
[angular.js]: https://angularjs.org/
[vue.js]: https://vuejs.org/
[react]: https://react.dev/

## A Rube Goldberg machine at index.html 

But time flies and the web games where long gone, several mobile apps ideas, 
new business prospections and the secret relied on deliver MVP's as fast as 
possible. [babel.js][babel.js] and [webpack][webpack] became keystones critical
to be sure that everything would bundle together just fine. Libraries like 
[Vue Material][VueMaterial] and platforms like [onesignal][onesignal] composed 
with our growing base stack for new solutions.

[babel.js]: https://babeljs.io/
[webpack]: https://webpack.js.org/
[VueMaterial]: https://www.creative-tim.com/vuematerial/getting-started
[onesignal]: https://onesignal.com/

Handy libraries like [Moment.js][Moment.js], [openlayers][openlayers], 
[socket.io][socket.io] and many others where easily installed via [npm][npm] and
later with [yarn][yarn], the _universal_ package manager, created by the same 
team behind `bower` that, ironically, could not manage bower projects.

[Moment.js]: https://momentjs.com/
[openlayers]: https://openlayers.org/
[socket.io]: https://socket.io/
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/

And let's not forget about the hard choice between [scss][scss], [sass][sass],
[less][less] or no CSS preprocessor at all! Even today it causes discussions.

[scss]: https://github.com/spatie/scss
[sass]: https://sass-lang.com/
[less]: https://lesscss.org/

Finally, if you where really committed to the state of the art regarding 
frontend development, you didn't code javascript anymore. It was all 
[typescript][typescript], safer, better, with type hints, like languages meant
to be used by adults where.

[typescript]: https://www.typescriptlang.org/

## Javascript everywhere

And then there was [Node.js][Node.js]. It was so fast, people would not believe 
that it was just javascript.

[Node.js]: https://nodejs.org

And things could be simpler on backend, just point a [knex][knex] connection to 
[postgresql][postgresql] and you served it through [express][express] or
[koa][koa]. I liked `koa` more.

[knex]: https://knexjs.org
[postgresql]: https://postgresql.org
[express]: https://expressjs.com
[koa]: https://koajs.com/

Of course, there where some demented people that adopted [sequelize][sequelize] 
or didn't care enough about user data and simply threw everything inside
[mongodb][mongodb] collections. I never did that to myself.

[sequelize]: https://sequelize.org/
[mongodb]: https://www.mongodb.com/

## Things got a little out of control

By then the world change and i left the startup. Good thing, i guess, mont of 
the tools i adopted where indeed the stack choice of some system architects on 
big enterprises as well. But some other tools where also om the world, with 
angular and react doing better than my guts told me that thew would do in the 
wild, on the streets.

Worse, now i had to deal with react applications entering into infinite render 
loops, angular applications relying so heavily into specialized CLI tools that 
it would survive without those medical devices a single minute.

And projects became _workspaces_, with several projects inside, relying on
things like [pnpm][pnpm] tp work properly.

[pnpm]: https://pnpm.io/

New test runners, new linters, new environment builders and project generators 
all over the place. You could smell it in the air.

The the so-called _meta-frameworks_ became a thing. [Next.js][Next.js],
[Nuxt][Nuxt] and [SvelteKit][SvelteKit], just to name a few.

[Next.js]: https://nextjs.org/
[Nuxt]: https://nuxt.com/
[SvelteKit]: https://svelte.dev/docs/kit/introduction

[Component hydration][hydration] is a concept so absurd that old programmers had
to point out that it was just what they used to do before [SPA][SPA]s became a
thing. By no means it was a revolutionary thing.

[hydration]: https://en.wikipedia.org/wiki/Hydration_(web_development)
[SPA]: https://en.wikipedia.org/wiki/Single-page_application

## The return to the Innocence 

In more recent years thing start to change again, change away from unnecessary
complexity.

Reactive programming is good, but why do i need so much tooling to use it? 
[alpinejs][alpinejs] solves that, and major names behind frameworks like Angular
and Vue are working to make it standard on javascript.

[alpinejs]: https://alpinejs.dev

Partial rendering from server-side components? There is [htmx][htmx] for that 
and the team behind the framework is trying to transform its core ideas into 
official html standard.

[htmx]: https://htmx.org

Real module isolation needs no bundle anymore, thanks to `type="module"` support
on all major browsers.

Even bundlers evolved. Im early days, there was [budo][budo], delivering 
bundled code via `breowserify` with zero configuration. Now there is
[parcel][parcel], doing more that that: self-configuration. it configures 
itself depending on what you're trying to use.

[budo]: https://github.com/mattdesl/budo
[parcel]: https://parceljs.org/

A simple parcel project for a modern frontend can be provisioned like this:

```bash
# the tooling setup
npm i -D parcel phaser
npm pkg set type=module
npm pkg set scripts.dev="parcel src/index.html"
# project scaffolding
mkdir joaozinhoattack
touch jsconfig.json
touch jsconfig.json
mkdir -p src/{configs,assets,stages,actors}
mkdir -p src/assets/{characters,maps,sfx,sprites}
touch src/{index.html,main.js}
touch src/actors/{BattleArena,Button,Item,KillCount,Monster,PowerLabel}.js
touch src/assets/main.css # and many more
touch src/configs/manifest.json # and many more
```

And let's not forget about [PWA][PWA]s, that can install your web app easily on 
mobile, doing almost everything needed, making wrappers like ionic needed only 
in very specific scenarios.

[PWA]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

## What a time to be alive

On top of that, there is AI, that benefit from those simpler tools.
Imagine what you can do with `parcel` and [jbang][jbang].

[jbang]: https://jbang.dev/

Now imagine what IA can do for you.

## Old man yells at clouds

[I wrote a simple game with phaser][game] as a gift to my nephew. Then i 
remembered the old bower project with phaser 2 and cordova.

[game]: https://sombriks.github.io/joaozinhoattack/

I got myself wondering the simplicity that modern web tools delivered to me in 
this experiment, and how it related to those old projects i built more than a
decade ago.

I might just becoming a nostalgic old man. Or i might be right and things got 
better, like they used to be.
