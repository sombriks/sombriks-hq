---
layout: blog.pug
tags:
  - posts
  - shorts
  - software architecture
  - mvc
  - mvp
  - mvvm
  - reactivity
  - hateoas
  - htmx
date: 2025-02-02
draft: false
---
# Where HATEOAS fits in software architectures

In my recent experiments i created small applications playing with the core
concept of HATEOAS - Hypermedia as the application state.

While the concept is not new, it got traction with [modern web libraries][htmx]
which delivers simpler tooling and lesser layers in architecture.

But how does it fits in bigger architectural concepts? Let's discuss.

## Why care about architecture

Good software not only works, it is also easy to change, evolve. To be sure that
quality is present. The [separation of concerns][concerns] technique is applied.

A software architecture is a particular way of how to apply this into the code.

## Model View Control

Classic and most fundamental architectural pattern, it defines 3 major concerns
and is also the base for the others. It is called sometimes as
**"pattern of patterns"**. It consists in 3 layers:

- **Model** will handle data, state.  File, database, broker and cache access
  are managed here. SQL language is often applied in this layer.
- **View** will handle how to present data. Elements, controls and templates are
  common approaches to render the user interface.
- **Controller** will mediate the communication between the other two. This
  layer does not store state but for send it to the View. It abstracts the UI
  details when sending data to the model to be stored. The Control layer is also
  house for low level validations and high level business rules which not always
  can be properly presented or safely enforced at UI or database.

## Model View Presenter

The Presenter layer does not replace the Control. Instead, think about this new
name as a "movement" trying to get the Control layer closer to the view but
still unaware of full ui details.

It got traction with mobile development becoming multi-platform and the same
codebase sharing implementation for android and ios.

To try to deliver a simple example of what does it means, "i know that i'll need
a button and an input, but i don't know the details about it in this layer".

## Model View ViewModel

The ViewModel layer, as the Presenter discussed previously, does not replace the
Control layer but extends it.

In a way, it puts the control even closer to the UI because the fetched from
model gets even more easily accessible to the View layer, which instead of just
receive data from Control layer, now has direct access to the fetched state.

It got popular due the huge jump of popularity of web development making heavy
use of javascript and rich client approach.

It also often pairs with a technique called *reactivity*.

### Reactivity

In simple terms, reactivity aims to make state changes declarative like modern
user interfaces are. No need to write the code for receive data from the UI and
and apply it into the current fetched state. The fetched state knows how to
propagate the changes. [Knockout.js][knockout] and [Vue.js][vue] are examples of
reactive web frameworks.

## How HATEOAS combines with those

In this technique, View layer is Hypermedia and fetched state is already blended
into it. Control layer does not holds the job of "the source of truth" of the
fetched data from the Model layer.

It is less sophisticated than a Reactive ViewModel but in a good way, since it
removes complexity. In fact, **it honors classical MVC perfectly**.

On the other hand, it will drag you down if you already using an architecture
which delegates fetched state to a specialized Control layer component, like MVP
or MVVM.

## Conclusion

Make sure to adopt a software architecture pattern that fits your needs. Complex
and modern javascript tooling delivers powerful applications, but the
specializations narrows down concerns too much.

[htmx]: https://htmx.org
[concerns]: https://en.wikipedia.org/wiki/Separation_of_concerns
[knockout]: https://knockoutjs.com
[vue]: https://vuejs.org
