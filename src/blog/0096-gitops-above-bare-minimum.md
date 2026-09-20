---
layout: blog-layout.pug
date: 2026-09-20
tags:
  - git
  - linux
  - cron
  - bash
  - GitOps
  - podman
  - docker-compose
  - cockpit
  - caddy
  - sql
  - postgres
  - knex
  - node
  - htmx
  - bulma
  - alpinejs
  - fastify
  - date-fns
  - jwt
draft: false
---
# GitOps Above Bare Minimum

You might not need kubernetes for your blog, you know? On the other hand, pure
bare-metal management is proved to be so troublesome that people prefer to waste
resources on huge orchestrators. Today we'll explore a slightly to the left 
approach, delivering a simple pull-based GitOps approach. So, buckle up!

## Where GitOps really begin?

In continuous integration / continuous delivery (CI/CD) context, GitOps is a 
methodology that emphasizes the use of Git as the single source of truth for
managing infrastructure and applications.

But what is infrastructure? Does it make sense to manage _all of it_ with git?

Is your database infrastructure?
And your API Gateway?

There is clearly a difference between those two, and o e of them wight suffer 
changes more often than the other.

So we must choose wisely what we're going to manage with git.

Things that make total sense to manage with infrastructure as code:

- The application servers
- The database
- Cache servers
- Message brokers

Those items are tightly related to the application context.

## Where GitOps ends?

More foundational concerns go beyond the application scope:

- Domain names
- Server ports
- Operating system version and features

It makes little sense to attempt to abstract those if your scope does not 
demand too much. Specifically, if you don't need a cluster now, then don't 
pretend you need one right now.

## But i might need to manage 'X' at some point in the future

Do it in the future and focus your resources on the actual problem.

Nothing forbids you to scale up in the future.

## So, why don't we just install k3s?

Even though lightweight kubernetes implementations exist, they still arre 
complex beasts. Anyone who did the basic to run a simple application inside 
kubernetes knows the feeling.

Also, your server might not have the resources for that.

## Let's keep it simple

In this example, we have a simple node application consuming a postgres database
and serving htmx templates. It will face the internet so public DNS and 
reverse proxy are needed.

We also need it to be up to date automatically whenever a nem change is 
 committed to git, so the continuous delivery happens.

So, our server **must have a properly configured git client**.

## Secure reverse proxy

For reverse proxy, we can use [Caddy][Caddy], which has a nice, free and
transparent SSL configuration.

[Caddy]: https://caddyserver.com/

So, we install caddy in **bare metal**, since DNS goes in bare metal or in 
cloud provider panels. It is easier to maintain like that.

## Container runtime

Although [docker is simple to install][docker], no installation is even better.

Most linux boxes come with [podman][podman] nowadays, and the compatibility is
great. All we need is to make sure to install the
[podman-compose][podman-compose] extension. For example:

[docker]: https://docs.docker.com/engine/install/
[podman]: https://podman.io/
[podman-compose]: https://github.com/containers/podman-compose

```bash
sudo dnf install podman-compose
```

## Above bare minimum: cron+bash+git+compose

Now, let's turn our eyes to the application itself:

```bash
worhou
├── app
│   ├── configs
│   │   ├── auth.js
│   │   ├── database.js
│   │   ├── email.js
│   │   └── server.js
│   ├── controllers
│   │   ├── onboarding.js
│   │   ├── profile.js
│   │   ├── teams.js
│   │   ├── timelog.js
│   │   └── worksheet.js
│   ├── infra
│   │   ├── database.yml
│   │   ├── Dockerfile
│   │   ├── fetch.sh
│   │   ├── install.sh
│   │   ├── production.yml
│   │   └── worhou.caddyfile
│   ├── main.js
│   ├── main.spec.js
│   ├── migrations
│   │   ├── common
│   │   ├── development
│   │   ├── knexfile.js
│   │   ├── migration.js.stub
│   │   ├── production
│   │   └── test
│   ├── models
│   │   ├── _base.js
│   │   ├── logins.js
│   │   ├── logins_types.js
│   │   ├── timelogs.js
│   │   ├── users.js
│   │   ├── users_settings.js
│   │   └── worksheets.js
│   ├── services
│   │   ├── auth.js
│   │   ├── auth.spec.js
│   │   ├── email.js
│   │   ├── login-device.js
│   │   ├── login-email.js
│   │   ├── settings.js
│   │   ├── timelog.js
│   │   └── worksheet.js
│   ├── static
│   │   ├── theme-override.css
│   │   ├── worhou.css
│   │   └── worhou.js
│   └── templates
│       ├── components
│       ├── index.pug
│       ├── layouts
│       ├── pages
│       └── partials
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

It's a very ordinary node application, but note the `app/infra` directory: 
In this directory, we have all the infrastructure code that is required to run
the application:

- a development database compose.
- a production compose with everything we'll need.
- a Caddyfile for proper reverse proxy.
- a couple of shell scripts to verify and fetch application updates.

## The caddyfile and the hardcoded ports

The `caddyfile` goes like this:

```caddyfile
# install under /etc/caddy/Caddyfile.d/
worhou.getsheetdone.net {
    reverse_proxy localhost:3010 localhost:3011 localhost:3012 {
        lb_policy round_robin
        fail_duration 10s
        max_fails 3
    }
}
```

The reverse proxy con figuration with ssl enabled is just that simple. But 
note the hardcoded ports.

Due to the nature of processes, manage your ports carefully. Each service you 
provision on the server will need knowledge of those.

Assuming that you don't have hundreds of services, it's ok and you'll be fine.

## Production compose

```yaml
---
x-app: &app
  image: sombriks/worhou:${VERSION:-latest}
  restart: unless-stopped
  environment:
    VERSION: ${VERSION:-latest}
    DB_PASSWORD: ${DB_PASSWORD:-worhou}
    DB_USER: ${DB_USER:-worhou}
    DB_HOST: ${DB_HOST:-db}
    NODE_ENV: ${NODE_ENV:-production}
    HOST: ${HOST:-0.0.0.0}
    PORT: ${PORT:-3000}
    AUTH_KEY: ${AUTH_KEY}
    AUTH_EXPIRES_IN: ${AUTH_EXPIRES_IN:-1d}
    EMAIL_API_URL: ${EMAIL_API_URL}
    EMAIL_API_USERNAME: ${EMAIL_API_USERNAME}
    EMAIL_API_PASSWORD: ${EMAIL_API_PASSWORD}
  healthcheck:
    test: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://$HOST:$PORT/ || exit 1" ]
    start_period: 5s
    interval: 30s
    timeout: 5s
  depends_on:
    db:
      condition: service_healthy
name: worhou
services:
  app1:
    <<: *app
    ports:
      - "3010:${PORT:-3000}"
  app2:
    <<: *app
    ports:
      - "3011:${PORT:-3000}"
  app3:
    <<: *app
    ports:
      - "3012:${PORT:-3000}"
  db:
    image: postgres:18-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:-worhou}
      POSTGRES_USER: ${DB_USER:-worhou}
      POSTGRES_DB: ${DB_USER:-worhou}
    volumes:
      - type: bind
        source: ${PG_DATA:-../../pg-data}
        target: /var/lib/postgresql
        bind:
          selinux: Z
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      start_period: 5s
      interval: 10s
      timeout: 5s
      retries: 5
```

The production compose declares a humble yet decent setup: one database and 
three application instances, as seen in the `caddyfile`.

## Installation with good and old bash scripts

At this point, we can already checkout the project and run the compose file 
and get something up and running.

However, in order to get it running automatically, we can take the steps 
needed and save them as bash scripts.

Finally, a cron job can solve the pull-based service update.

## Some simple management with cockpit

The project and the cron are enough to keep the service running, but would 
be nice to take care of the resources in a more administrative way.

so we install [cockpit][cockpit] and configure it:

[cockpit]: https://cockpit-project.org/

```bash
sudo dnf install cockpit
sudo systemctl enable --now cockpit.socket
```

Cockpit will appear at port `9090` and a self-signed certificate. That's not 
the ideal.

Since we already have caddy, we can configure a caddyfile for cockpit:

```caddyfile
# /etc/caddy/Caddyfile.d/cockpit.caddyfile 
# open cockpit access
cockpit.sombriks.org {
  reverse_proxy localhost:9090
}
```

Next, we configure cockpit to accept connection through the reverse proxy.

If the file `/etc/cockpit/cockpit.conf` doesn't exist, create one:  
```

```ini
[WebService]
Origins = https://cockpit.getsheetdone.net
ProtocolHeader = X-Forwarded-Proto
```

## General key points

- Application images are managed locally. This setup can evolve to check 
  updated images, but to keep it simple this one moving part is out form 
  this sample setup.
- Cockpit is chosen because it offers a decent podman plugin where you can 
  check easily on the containers and resource usages. 

## Conclusion

Check [the complete source code here][worhou].

[worhou]: https://github.com/sombriks/worhou

Happy hacking!
