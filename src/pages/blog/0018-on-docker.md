---
layout: base.webc
tags: 
  - posts
  - docker
date: 2019-10-05
---
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

Images are machine definitions. You likely will describe them with a **Dockerfile**
and a context folder. Keep in mind that the folder where you're storing the file
is important.

Usually you have a folder with the Dockerfile inside it.

To build the image simply use the **docker build** command:

```bash
cd my-new-machine
docker build .
```

Containers are the "running machine".  you can either run them on the foreground
using the **-it** arguments or put them on the background with the **-d**
argument.

You only can run containers from images you know the name or you have built. In
both cases, you must have access to the [docker registry](https://hub.docker.com/).

You can also **attach** to a running container by doing something like this:

```bash
docker exec -it placid_torvalds /bin/bash
```

Where *placid_torvalds* is the name of the running container and /bin/bash is
the shell executable *inside* the container.

Funny fact is the names given by the docker to containers, :-)

## The Dockerfile

This file is a recipe.

It can be a bit confusing sometimes, like the difference between RUN, CMD and
ENTRYPOINT, but usually it is pretty straightforward.

It defines the image.

Images can inherit from other images using the **FROM** statement.

## Port binding and mount volumes

When issuing a **docker run** command you awlays can add -p and -v parameters:

```bash
docker run -it -p 8080:8080 -v /path/on/host:/path/on/container:z drunk_swan
```

The **:z** thing is to solve SELinux issues.

The **-p 8080:8080** is pretty much the *-v*, first port is on host, second is
on container.

Volumes are nice if you want to share content with the container. Files from
some project you're developing, for example.

## Publishing your images

Do the docker login so you can create, tag and commit your images to the public
registry.

No need to mention to avoid to publish sensitive information on public
repositories :-)

That's it, things can be simplified once you decide to accept docker on your
life.

Also you can write up [docker-compose](https://docs.docker.com/compose/) files,
but at this point you can read the official docs by yourself.

---
Tags:
{%- for tag in tags -%}
[{{tag}}](/blog/?tag={{tag | slugify}})
{%- endfor -%}
