---
layout: blog-layout.pug
date: 2026-11-21
tags:
  - posts
  - misc
  - software architecture
draft: false
---
# There and Back Again: How Reactivity Won the Hearts of Modern Web Developers

There were some detours and experimentation, but in the end we just reinvented
VisiCalc again.

## Reactive what?

At its core, reactivity is about declaring relationships between values rather
than imperatively orchestrating updates. Instead of manually pushing changes
every time a variable mutates, you define how derived state depends on its
sources and let the runtime propagate updates automatically.

## The Evolution of Reactive Architectures: A Historical Timeline

Reactive programming has evolved over six decades, moving from theoretical
dataflow models to native browser primitives. Below is a chronological-ish
overview of the major milestones that shaped modern reactive systems.

### 1960s: Dataflow Theory and Kahn Process Networks

Computer scientists Jack Dennis and Gilles Kahn formalized dataflow
architectures and [Kahn Process Networks][KPN] (KPN). Rather than executing
instructions sequentially, programs were modeled as directed graphs where nodes
react and process data as soon as inputs arrive.

[KPN]: https://en.wikipedia.org/wiki/Kahn_process_networks

### 1979: VisiCalc and Spreadsheet Reactivity

The release of [VisiCalc][VisiCalc] introduced practical reactive programming to
personal computing. By defining cell formulas such as `=A1+B1`, users implicitly
constructed dependency graphs where state mutations automatically propagated to
dependent cells without manual imperative triggers.

[VisiCalc]: https://en.wikipedia.org/wiki/VisiCalc

### 1980s: Synchronous Reactive Languages

French researchers developed [synchronous reactive languages][Synchronous],
like [Esterel][Esterel], [Lustre][Lustre], and [Signal][Signal], designed for
safety-critical, real-time embedded little things, such as avionics and nuclear
power plant controllers, requiring deterministic reactions to physical sensor
inputs.

[Synchronous]: https://en.wikipedia.org/wiki/Synchronous_programming_language
[Esterel]: https://en.wikipedia.org/wiki/Esterel
[Lustre]: https://en.wikipedia.org/wiki/Lustre_(programming_language)
[Signal]: https://en.wikipedia.org/wiki/SIGNAL_(programming_language)

### 1997: Functional Reactive Programming ([FRP][FRP])

Conal Elliott and Paul Hudak published [*Functional Reactive Animation*][FRA],
introducing the quite funny [Fran][Fran] library in Haskell. This work
established the formal mathematical foundation for FRP by distinguishing between
*Behaviors* (continuous time-varying values) and *Events* (discrete occurrences
over time). 

The thing was pretty much solved in this ground-breaking work.

[FRA]: https://conal.net/papers/icfp97/
[Fran]: https://conal.net/fran/

### 2006–2007: Rich Internet Applications and Declarative Binding

Oh yes, remember [RIA][RIA]?

Enterprise UI frameworks popularized declarative data binding on the desktop and
early web. [Adobe Flex][Flex] (`[Bindable]`) and
[Microsoft WPF/Silverlight][Silverlight] (`INotifyPropertyChanged`) standardized
observer-based property notifications, while [Flapjax][Flapjax] brought academic
[FRP][FRP] concepts directly to JavaScript.

[RIA]: https://en.wikipedia.org/wiki/Rich_Internet_Application
[Flex]: https://en.wikipedia.org/wiki/Apache_Flex
[Silverlight]: https://en.wikipedia.org/wiki/Microsoft_Silverlight
[Flapjax]: https://en.wikipedia.org/wiki/Flapjax
[FRP]: https://en.wikipedia.org/wiki/Functional_reactive_programming

### 2009: .NET Reactive Extensions (Rx)

[Erik Meijer created Rx.NET][Rx.NET] at Microsoft, which soon inspired
[RxJS][RxJS]. By unifying the Observer and Iterator patterns with functional
composition, Reactive Extensions established asynchronous event streams as a
primary abstraction for handling complex, time-based workflows.

A valid question, even today, is: it was complex due to the involved workflows
or the involved workflows got complex because of it? Who knows.

[Rx.NET]: https://dotnet.github.io/reactive/
[RxJS]: https://rxjs.dev/

### 2010: KnockoutJS and AngularJS

A pivotal year for web reactivity saw two contrasting approaches emerge. Steve
Sanderson released [KnockoutJS][KnockoutJS], pioneering fine-grained reactivity
in the JavaScript badlands. It did automatic dependency tracking (`observable`
and `computed`) and was elegant as hell. Months later, Google released
[AngularJS][AngularJS], opting instead for dirty-checking cycles to synchronize
model and view state. Clean and elegant to use, ugly and poor performance under
the hood, but hey, it's Google, _how could they possibly be wrong about this?_

[KnockoutJS]: https://knockoutjs.com
[AngularJS]: https://angularjs.org

### 2011: JavaFX 2.0

Oracle replaced the standalone JavaFX Script language with a pure Java API in
[JavaFX][JavaFX] 2.0. This release introduced observable properties
(`ObservableValue`) and fluent bindings, bringing fine-grained reactive state
graphs to standard JVM desktop applications.

[JavaFX]: https://openjfx.io

### 2013: React and the Virtual DOM Paradigm

Facebook introduced [React][React], shifting industry consensus away from
fine-grained mutable state tracking. React promoted declarative UI rendering
backed by a [Virtual DOM][v-dom] diffing algorithm, trading granular updates
for predictable, top-down component re-renders.

As a side note, they also introduced [JSX][JSX], which is something between a
declarative language, a javascript/typescript extension and a mental disease
that frontend developers never fully recovered from.

[React]: https://react.dev/
[v-dom]: https://en.wikipedia.org/wiki/Virtual_DOM
[JSX]: https://react.dev/learn/writing-markup-with-jsx

### 2014: Vue.js

[Evan You][Evan You] launched [Vue.js][Vue.js], combining component-based
architecture with automatic dependency tracking. By intercepting property access
via `Object.defineProperty` (and later ES6 Proxies), Vue preserved fine-grained
state reactivity alongside a Virtual DOM renderer.

[Evan You]: https://evanyou.me/
[Vue.js]: https://vuejs.org/

### 2015: MobX

[Michel Weststrate released MobX][MobX], reintroducing transparent, fine-grained
reactive state management (`observable`, `computed`, and `autorun`) into the
React ecosystem as an alternative to immutable, reducer-based architectures.

[MobX]: https://mobx.js.org/

In short, Michel tried to fix React early on.

### 2018–2020: SolidJS and the Signals Renaissance

[Ryan Carniato created SolidJS][SolidJS], demonstrating that Knockout-style
fine-grained reactivity—paired with modern push-pull algorithms to prevent
unnecessary recalculations and glitches—could outperform Virtual DOM frameworks
in runtime speed and memory efficiency.

Ryan fixed React.

[SolidJS]: https://www.solidjs.com/

### 2020–2026: Industry Convergence and TC39 Standardization

Fine-grained reactivity became the unifying paradigm across frontend frameworks.
[Vue 3 refs][Vue3] (2020) and [Vue Vapor][Vapor] (2026),
[Angular Signals][Angular] (2023), and [Svelte 5 Runes][Svelte] (2023–2024)
adopted signal-based primitives, culminating in a formal [TC39 proposal][TC39]
to standardize Signals natively in ECMAScript.

[Vue3]: https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref
[Vapor]: https://github.com/vuejs/vue-vapor
[Angular]: https://angular.dev
[Svelte]: https://svelte.dev
[TC39]: https://github.com/tc39/proposal-signals

## Conclusion

Modern abstractions rarely appear out of thin air; they stand on decades of
deep roots. Today's reactive primitives are the meeting point between early
academic formalism and years of wild, trial-and-error experimentation on the
web. As Signals move toward native browser standardization, one can only
wonder what comes next: are we on the verge of a genuine paradigm shift, or
will software engineering simply keep spiraling back to its foundational ideas?

Will someone fix React again?
