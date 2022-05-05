# Another very opinionated comparison

[Back in time](#0007-vue-and-react-side-by-side.md) i did a similar comparison
but boy time flies.

But this time let's focus. on the global source of truth solution.

## About global state / source of truth

Programmers born in the internet age passed years listening about the bad things
that can happen when using global variables. Your requests could end up mixing,
several race conditions could cripple your web page on heavy loads situations.

Bud modern web isn't a dumb terminal anymore (computers tend to have that tide
which sends important processing from mainframe/server to terminal/application
time to time) and the current client state become complex and expensive to
maintain using the old ways that a browser where meant to do.

Therefore we have that mix of smart servers and smart clients, and the client
information needs more efficient ways to share information across all their
smart components.

## Why global state is a thing

This one is easy to answer.

Take this scenario for instance:

![sample-screen](post-pics/0031-redux-vs-pinia/products.jpg)

I want a certain set of behaviors here:

1. Login/logoff resets the filter and paginator.
1. Filter changes resets the paginator.
1. Each named element is a distinct component.

That said, how to solve it without using a global source of truth?
