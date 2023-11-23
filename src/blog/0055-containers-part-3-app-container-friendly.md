---
layout: blog-base.webc
tags:
  - posts
  - node
  - koa
  - knex
  - docker
  - container
  - docker-compose
  - environment-variables
  - container-orchestration
  - container-observability
date: 2023-07-08
draft: false
---
# Containers to serve configuration-friendly applications

One nice thing about containers is they kinda standardized how applications
should be distributed. You still need to understand the specifics of adopted
technology stack, yes, but when it comes to put it to run, just create an image,
publish it into some registry and then spin that image somewhere. We already
talk about that [here](https://sombriks.com/blog/0033-containers-part-2) and
[here](https://sombriks.com/blog/0030-containers-part-1).

But to get the state of the art, your container image must not be an opaque and
hard to get inside coconut, it must offer some flexibility and be somewhat
configurable from the outside world.

## TL;DR

[Just](https://docs.oracle.com/javase/tutorial/essential/environment/env.html)
[use](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs/)
[environment](https://docs.python.org/3/library/os.html#file-names-command-line-arguments-and-environment-variables)
[variables](https://pkg.go.dev/os@go1.20.5#Getenv)
[and](https://docs.docker.com/engine/reference/builder/#arg)
[pass](https://docs.docker.com/engine/reference/builder/#env)
[them](https://docs.docker.com/compose/compose-file/05-services/#environment)
[to the container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/).

## Long version

Most modern applications will end up having to deal with some degree of state
management, and solutions like queues, databases and event brokers will take
place.

Those components are usually external to the application and need configurations
to proper serve us.

And even if not mandatory, it is a best practice to make those configurations
sensible to the current application environment.

For all those needs, all modern operating systems offers a solution:
**environment variables**.

### What is an environment variable?

They are one of the ways that the current shell has to pass runtime information
to a child process.

If your application needs external information, it can receive input from user,
query the network or the filesystem or check variables from parent process,
usually [the shell](https://www.gnu.org/software/bash/).

### What kind of information my app should grab from it?

External information that changes **runtime behavior** are a great start:

- build and/or version tags
- database address and credentials
- service api keys
- feature flags

Note also that kind of externalization precedes all that container stuff in
decades. To get your configuration externalized is a common practice since
[the dawn of modern age computing](https://plato.stanford.edu/entries/computing-history/).

### How my application can externalize things?

Most languages and frameworks already have neat ways to recover info from
external resources:

- [spring-boot](https://docs.spring.io/spring-boot/docs/1.5.6.RELEASE/reference/html/boot-features-external-config.html)
  [cascades environment variables](https://stackoverflow.com/questions/35531661/using-env-variable-in-spring-boots-application-properties)
  into it's properties in a transparent way
- [dotenv-flow](https://www.npmjs.com/package/dotenv-flow) performs similar job
  on backend node js projects
- [vite](https://vitejs.dev/guide/env-and-mode.html) and
  [similar tools](https://create-react-app.dev/docs/adding-custom-environment-variables/)
  do the same for frontend development

That kind of development style implies sometimes tha a application profile or
application mode exists and there is some specifications about that, like the
[twelve factor app methodology](https://12factor.net/).

### Building configuration-friendly images

To build a configuration-friendly image we start with a configuration-friendly
application, as we debated in previous section.

In [this example](https://github.com/sombriks/simple-knex-koa-example) we can
see a reasonable configurable application depending on these key environment
variables:

```bash
# also depends on NODE_ENV
ALG=aes-256-cbc
SECRET=CH4NG3M3CH4NG3M3CH4NG3M3CH4NG3M3
DEBUG=knex:query,knex:bindings,koa:*
```

[A Dockerfile to package this app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)
would be something like this:

```dockerfile
FROM node:18-alpine

# some useful description
LABEL name=simple-knex-koa-example \
      description="small koa.js service consuming database using knex.js"

# files needed to proper build and run this.
ADD index.mjs package.json .env.production .env.test /app/

# mind the trailing '/' in app/, it's important!
ADD app/ /app/app/

# switching for our working directory inside de image filesystem
WORKDIR /app/

# environment configuration.
ENV PORT=3000 \
    NODE_ENV=production \
    PG_CONNECTION_URL='please configure database url connection properly'

# informing the port this image will expose to the outside world
EXPOSE $PORT

# install deps and show image folder structure so it can be checked on logs
RUN npm install; echo "some results: "; pwd; ls -la; ls -la app # ; npm run test

# how this app runs
ENTRYPOINT npm start

```

Important things to note:

- the `Dockerfile` usually gets versioned along the rest of the source code. Do
  not save sensitive data (like the
  [database connection url](https://stackoverflow.com/a/20722229/420096)) here.
- The variables can be used during image build **and** container runtime. To be
  more specific, you can declare your variables on Dockerfile, use them as-is to
  build the image and then override any of them before start the container.
- If some variable is needed **ONLY** during build time, it's better to use
  [build-args](https://docs.docker.com/engine/reference/commandline/build/#build-arg).

The image build command follows:

```bash
# from the root directory, which usually has the Dockerfile
docker build -t sombriks/simple-knex-koa:latest .
```

### Running the image

Now, run the application image and replace the variables accordingly:

```bash
docker run --name sample-container -p 3000:3000 \
  -e PG_CONNECTION_URL=postgres://username@password@host/database_name \
  -d sombriks/simple-knex-koa:latest
```

There!

This is how you override your sensitive configuration.

### Some orchestration

[Container orchestration](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/orchestration)
is one of the modern design patterns for microservices and containerized
applications.

It goes one step forward application packaging and starts to define how
different applications can collaborate with each other.

Using a [docker-compose](https://docs.docker.com/compose/gettingstarted/) file,
it's possible to not only indicate how to find out a postgresql database, but
provide one to team up with our application. See example file bellow:

```yaml
version: "3.5"
services:
  knex-koa-app:
    # build: .
    image: sombriks/simple-knex-koa
    environment:
      PG_CONNECTION_URL: postgres://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db/${POSTGRES_DB:-books}
    ports:
      - "3000:3000"
    expose:
      - 3000
    healthcheck:
      test: [ "CMD", "wget", "-S", "--spider", "http://127.0.0.1:3000/status" ]
      interval: 30s
      timeout: 30s
      retries: 30
    restart: on-failure
    depends_on:
      db:
        condition: service_healthy
  # https://hub.docker.com/_/postgres
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-books}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    expose:
      - 5432
    healthcheck:
      # https://www.postgresql.org/docs/9.4/app-pg-isready.html
      test: [ "CMD-SHELL", "pg_isready" ]
      interval: 30s
      timeout: 30s
      retries: 30
    restart: on-failure
```

This also samples a bit about
[observability](https://kubernetes.io/blog/2022/12/01/runtime-observability-opentelemetry/),
since we have restart and healthcheck operations.

Most orchestration solutions try to offer such commodities so we not only run
packaged applications, but make sure they will keep running and answering when
the bell rings.

## Cool Tools to deal with containers

Intellij Ultimate has a nice plugin to deal with images, containers and
registries:

![sample-docker-compose-healthy.png](/assets/post-pics/0055-containers-part-3/sample-docker-compose-healthy.png)

## Conclusion

In this example we used a node application, but the same applies to other
languages and stacks.

If your application was configurable already then it's a matter of write the
packaging stuff for it, publish the image (or build locally) and provision some
infrastructure to it.

See you in the nex article, happy hacking!
