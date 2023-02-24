---
layout: blog-base.webc
tags: 
  - posts
  - docker
  - docker-compose
date: 2022-05-04
---
# Containers containers containers

They're everywhere. Even where they aren't needed. But containers aren't bad.
Neither hard. And in fact they can improve the overall quality of life in
software development and production if used correctly.

## It works on my machine

Whenever you question a developer about an issue in the application, it spins up
the fans of its machine and shows you that there is no issue at all. So the
problem must be in the server running the application. The solution is simple at
this point, you grab that overpriced machine from developer and plug it in the
service gateway.

Virtual machines solved the issue about carry heavy hardware up and down the
stairs, since a vm is just a immensely huge file to put into a usb drive.

And finally, containers solved the issue about immensely huge files by replacing
them with just huge regular files being transferred over the internet.

## Containers are running images

The same way a virtual machine spins from a virtual hard drive, a container
spins from an container image. They can be
[very small](https://github.com/sombriks/smallest-container-hello-world) or
[quite massive](https://hub.docker.com/_/fedora) as a virtual machine.

The key difference between images and virtual machines is the origin: you
usually go get your installer image on your own while images usually come from a
[centralized registry](https://hub.docker.com/).

And therefore, the same way you start/stop a virtual machine, you start/stop
your containers.

When you do:

```bash
docker run hello-world
```

It is the same thing as download an iso installer, make a vm and run it. The
difference of course is the virtual machine delivers you an entire operating
system. This newly created container spins just one appliance.

## Containers are dedicated appliances

This is when the differentiation starts from the user point of view.

A true virtual machine delivers an operating system.

A container image knows exactly how to spin your application.

You can run more than one version of your container image. for example, the
previous command created a container based on the
[hello-world image](https://hub.docker.com/_/hello-world). if you run it again:

![docker-hello-world](/assets/post-pics/0030-containers-part-1/docker-hello-world.png)

It might trick you to believe you just ran the same container. But wait!

![docker-hello-world](/assets/post-pics/0030-containers-part-1/docker-ps-a.png)

In fact the _run_ command is misleading. It **creates** _and_ **run** new
containers.

## Remember to name your containers the same way you name your machines

```bash
sombriks@pensusevm:~> docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED         STATUS                     PORTS     NAMES
256e16465dec   hello-world   "/hello"   3 minutes ago   Exited (0) 3 minutes ago             tender_yonath
1e46ba8e5ccf   hello-world   "/hello"   4 minutes ago   Exited (0) 4 minutes ago             tender_kirch

```

As you can see, the relevant common thing between those two containers is the
image, which is the same.

The proper way to spin up a container for the first time is naming it:

```bash
docker run --name hello hello-world
```

That way if by accident you try to create and run the same image again, the
outcome will change:

```bash
sombriks@pensusevm:~> docker run --name hello hello-world
docker: Error response from daemon: Conflict. The container name "/hello" is already in use by container "1182e2b7f10b025f2969a101641ad979c3acdca4c9d0515c9f062b14f3aba386". You have to remove (or rename) that container to be able to reuse that name.
See 'docker run --help'.
```

See, one image, three containers!

```bash
sombriks@pensusevm:~> docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS     NAMES
1182e2b7f10b   hello-world   "/hello"   38 seconds ago   Exited (0) 37 seconds ago             hello
256e16465dec   hello-world   "/hello"   16 minutes ago   Exited (0) 16 minutes ago             tender_yonath
1e46ba8e5ccf   hello-world   "/hello"   17 minutes ago   Exited (0) 17 minutes ago             tender_kirch
```

Now if you want to spin your _hello_ container, use _start_ instead of _run_:

```bash
sombriks@pensusevm:~> docker start hello
hello
```

## Containers should be very discardable. Images not

One reason to containers get funny names if you don't provide one is because
they should be created and destroyed with no major issues.

This is because containers could become a security issue, since they could be
compromised as any other computer can. If they're destroyed often, no worries at
all. _Right?_

## Dockerfile is a blueprint for a computer running one program, docker-compose.yml is blueprint for local infrastructure

A container alone is boring. It just says "hey, my application runs on this
specific set of base OS features and have these special needs: ports,
environments and this java version here."

You can install those things on your host system, it's just a matter of time.

However, when we start to talk about
[docker-compose](https://docs.docker.com/compose/compose-file/), things evolve
to another level.

With compose we start to describe **infrastructure**.

For example, take this
[docker-compose file](https://github.com/sombriks/it-works-on-my-machine/blob/main/docker-compose.yaml):

```yml
version: '3'
services:
  web:
    build: ./web
    environment:
      - VITE_BASE_API=${vite_base_api}
    volumes:
      - ./web:/web:z
    ports:
      - 3000:3000
      - 5050:5050
    network_mode: "host"
    depends_on:
      - app
      - db
  app:
    build: ./app
    environment:
      - GRADLE_OPTS=${gradle_opts}
      - spring_profiles_active=${spring_profiles_active}
    volumes:
      - ./app:/app:z
    ports:
      - 8080:8080
    links:
      - db
    depends_on:
      - db
  db:
    image: postgres
    ports:
      - 5432:5432
    environment:
      - POSTGRES_PASSWORD=${postgres_password}
      - POSTGRES_DB=works_on_my_machine
    volumes:
      - .data:/var/lib/postgresql/data:z
```

We got three computers here:

- one web machine
- one service (app) machine
- one database machine

Except they containers, dedicated appliances, and you flex much less muscles to
download, install, configure infrastructure and run this setup compared with the
effort to do the same on bare metal.

The game then changes from keep a team nursing the servers to just know the
right image to run the desired standard services and know some good images to
use when creating a few custom images.

But it keeps getting better and better.

## Send your images to registers

Whenever you create an image, if you're logged into
[a register](https://hub.docker.com/search?q=), you might push that image into
that register.

[There](https://catalog.redhat.com/software/containers/search)
[are](https://azure.microsoft.com/en-us/services/container-registry/#overview)
[various](https://www.digitalocean.com/products/container-registry)
[registers](https://aws.amazon.com/pt/ecr/)
[available](https://devcenter.heroku.com/articles/container-registry-and-runtime#getting-started).

By doing so, you make your appliance available to more sophisticated
infrastructure configuration.

There are, open, closed, free and paid registers. each one with small
differences, but the key concept remains: make your application bend inside a
container and then be reutilized on every production scenario you create.

## Next steps

Right now we covered the baby steps of devops culture here.

Containers make easier to abstract from application details by choosing the
environment setup from a supermarket shelf instead of craft it piece by piece.

At some point we will cover image publishing on some cloud providers and make that image or images into production
containers.
