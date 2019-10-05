# Why Docker after all?

You see, the very first time i've heard about it, i thought it was... Silly.

I know how to configure a database. Kinda like it.

i know how to install java, node, all the fun things in the party.

Then last week i had no choice but actually use these things and, well...

It's not that bad.

In fact, the following line sets postgresql up in a single stroke, instead the
long path of steps that i know by heart.

```bash
docker run -p 5432:5432 -it sombriks/postgres_pt_br
```

Also, this is not about me. It's about the others.

Many of us already faced how hard is to explain to others how to set up some
environment in order to get people working.

Write it down isn't enough, there are plenty of blogs over the internet, yet
people get stuck with something.

Docker is nice because put people to work became easier.

## Basic concepts

On this land you have two major concepts: **containers** and **images**.






2019-10-05