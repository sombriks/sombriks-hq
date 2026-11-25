---
layout: blog-layout.pug
date: 2026-11-25
tags:
  - posts
  - reactivity
  - design patterns
  - software architecture
draft: false
---
# Ten Reactive Design Patterns

Patterns are not any kind of universal truth, but knowing them gives you
vocabulary to express intent. Today, let's talk about Reactivity.

Reactive systems work like a deterministic state graph with two clear
boundaries: **Event Ingress** (#1) as the entry point from the imperative
world, and **Side Effects** (#10) as the exit point back to the outside
world.

## 1. Event Ingress

Ingest discrete external events and continuous streams into the reactive
state graph, translating imperative impulses into state updates with
automatic subscription cleanup.

* **Use Case:** Capturing a button click, listening to window resize
  events, or receiving real-time messages from a WebSocket connection.

* **Sample implementations:** DOM Event Handlers (`onClick`, `@input`),
  `addEventListener` with cleanup, Angular `toSignal()`, Solid `from()`,
  VueUse `useEventListener` / `useWebSocket`, JavaFX `EventHandler` /
  ReactFX `EventStreams`.

## 2. Atomic State

Create and update simple, single-value reactive units that notify dependents
whenever their value changes.

* **Use Case:** Tracking a counter, a toggle flag (`isOpen`), an active tab
  ID, or the current text inside a search input.

* **Sample implementations:** Angular `signal()`, Solid `createSignal()`,
  Vue `ref()`, JavaFX `SimpleObjectProperty` / `SimpleIntegerProperty`.

## 3. Shallow / Deep State

Manage complex objects, lists, and nested structures by choosing between
top-level reference tracking (shallow) or fine-grained nested reactivity
(deep).

* **Use Case:** Handling a multi-step form object, a shopping cart array, or
  a large dataset where only top-level replacement should trigger updates.

* **Sample implementations:** Vue `reactive()` / `shallowRef()`, Solid
  `createStore()`, Angular `signal()` with immutable updates / NgRx
  `signalState()`, JavaFX `FXCollections.observableArrayList()` (with
  `extractor` for deep tracking).

## 4. Derived State

Compute cached values from existing state that evaluate lazily or eagerly
and only recalculate when their specific dependencies change.

* **Use Case:** Calculating a shopping cart total with taxes, filtering a
  list based on a search query, or checking if a form is valid.

* **Sample implementations:** Angular `computed()`, Vue `computed()`, Solid
  `createMemo()`, JavaFX `Bindings.createObjectBinding()` /
  `ObservableValue.map()`.

## 5. Writable Derived State

Create state that automatically resets or recalculates when a source changes,
while still allowing manual user overrides in between.

* **Use Case:** Selecting the first shipping option by default whenever the
  user changes their country, yet letting them manually pick another option.

* **Sample implementations:** Angular `linkedSignal()`, Vue
  `computed({ get, set })`, Solid `createWritableMemo()`
  (`@solid-primitives/memo`), JavaFX `bindBidirectional()` / `ChangeListener`
  updating a writable `Property`.

## 6. Remote State

Represent asynchronous remote data as reactive state, declaratively managing
loading status, errors, and automatic cancellation of stale requests.

* **Use Case:** Fetching user profile details or search results from a REST
  API whenever a `userId` or `query` signal changes.

* **Sample implementations:** Angular `resource()` / `httpResource()`, Solid
  `createResource()`, Vue `watch()` with `onWatcherCleanup()` / TanStack
  Query, JavaFX `javafx.concurrent.Task` / `Service`.

## 7. Untracked Read

Read the current value of a reactive node inside an effect or derivation
without subscribing to it, preventing unwanted re-executions and loops.

* **Use Case:** Logging a user action along with the current theme or user
  ID inside an effect without re-running the log when the theme changes.

* **Sample implementations:** Angular `untracked()`, Solid `untrack()`, Vue
  explicit `watch(source, cb)` (ignoring unmentioned refs), JavaFX explicit
  `Bindings` (omitting dependencies from the dependency varargs).

## 8. State Throttling

Delay or rate-limit reactions to rapid state changes over time so downstream
computations and network requests are not overwhelmed.

* **Use Case:** Waiting 300ms after a user stops typing before triggering an
  autocomplete API search, or limiting scroll position updates.

* **Sample implementations:** Angular `toObservable()` + `debounceTime()` +
  `toSignal()`, Vue `customRef()` / `refDebounced()` (VueUse), Solid
  `debounce()` (`@solid-primitives/scheduled`), JavaFX `PauseTransition` /
  ReactFX `successionEnds()`.

## 9. State History

Access previous state values for delta comparisons or maintain undo/redo
stacks across state transitions over time.

* **Use Case:** Highlighting whether a stock price went up or down compared
  to its previous tick, or building undo/redo in a text or canvas editor.

* **Sample implementations:** Vue `watch(src, (curr, prev))` /
  `useRefHistory()` (VueUse), Solid `createEffect((prev) => ...)` /
  `createHistory()`, Angular `linkedSignal` (`previous` param) / RxJS
  `pairwise()`, JavaFX `ChangeListener` `(obs, oldVal, newVal)`.

## 10. Side Effects

Synchronize internal reactive state back to the outside world using either
automatic dependency tracking or explicit source subscriptions.

* **Use Case:** Persisting user preferences to `localStorage`, drawing onto
  an HTML `<canvas>`, or updating `document.title` when state changes.

* **Sample implementations:** Angular `effect()`, Vue `watchEffect()`
  (implicit) / `watch()` (explicit), Solid `createEffect()` (implicit) /
  `on()` (explicit), JavaFX `InvalidationListener` (lazy) / `ChangeListener`
  (eager).

## Conclusion

This list is not exhaustive, as reactive programming spans many domain-specific
and low-level engine concerns. However, these ten patterns cover the most
relevant and practical scenarios required to design, scale, and maintain
modern reactive applications.
