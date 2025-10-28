---
layout: blog.pug
tags:
  - posts
  - mobile
  - vite
  - ios
  - android
  - cordova
  - capacitor
  - javascript
date: 2025-04-30
draft: false
---
# Why build mobile applications using capacitor

Build mobile applications with quality and within deadlines are often a small
challenge due the nature of mobile platforms.

For starters, in order to proper maintain mobile presence on most mobile devices
will require two distinct applications, one for [android][android] and  another
for [ios][ios].

Back in time, [Apache Cordova][cordova] provided a clever way to package a web
application inside a mobile shell.

The modern way to do that is using [capacitor][capacitor].

## Advantages

The key advantage is to use web development skills already available. If your
team already does web applications, then it's a matter of extra build steps.

Tooling for capacitor projects is just [node][node], [vscode][code] and android
studio installed via [jetbrains toolbox][toolbox].

Capacitor also offers great integration with [vite][vite] and a reasonable good
[cli tool][cap-cli] to perform common chores.

Also, turning existing web applications into mobile ones is a way simple task
using capacitor.

## Tradeoffs

On the other hand, capacitor will bring to mobile platform constraints from the
web, Javascript being the major one. This isn't a disadvantage due the language
itself, but because the nature of web runtime. No real threading, for example.

Most mobile resources will be available through [capacitor plugins][cap-plugin],
But true background tasks will be out of table.

## Alternatives

A few other technologies offers single codebase for both mobile platforms.

### Progressive Web Apps

The [PWA is a web specification][pwa] which aims to make web applications more
integrated with the operating system itself. Instead of pen the browser and find
a favorite link or type an url, the application will appear as a menu option,
like any other regular app.

It also will show off some offline capabilities.

### Nativescript

[Nativescript][nativescript] Promises native experience while using most
familiar web tools. This is not a webview, but a javascript runtime.

It does not uses html tags.

### React Native

[React Native][react-native] surfs on top of React popularity and uses
[expo][expo] to deliver a true mobile experience.

### Flutter

Finally, [flutter][flutter] is another alternative offering native applications
from a single codebase.

The language used in flutter projects is [dart][dart].

## Conclusion

In most cases, true native mobile apps will offer better end-user experience
despite the longer development cycle.

Hybrid alternatives will help a lot with time to market issues.

And convert existing web applications into mobile are the best scenario for
capacitor.

Take this into consideration when starting a mobile project.

Happy Hacking!

[android]: https://developer.android.com/get-started/overview
[ios]: https://developer.apple.com/tutorials/app-dev-training
[cordova]: https://cordova.apache.org
[capacitor]: https://capacitorjs.com
[node]: https://nodejs.org
[code]: https://code.visualstudio.com
[toolbox]: https://www.jetbrains.com/toolbox-app
[vite]: https://vite.dev
[cap-cli]: https://capacitorjs.com/docs/cli
[cap-plugin]: https://capacitorjs.com/docs/plugins
[pwa]: https://developer.mozilla.org/docs/Web/Progressive_web_apps
[nativescript]: https://nativescript.org
[react-native]: https://reactnative.dev
[expo]: https://expo.dev
[flutter]: https://flutter.dev
[dart]: https://dart.dev
