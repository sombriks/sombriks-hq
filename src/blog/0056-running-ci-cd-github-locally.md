---
layout: blog-base.webc
tags:
  - posts
  - github
  - action
  - act-cli
  - docker
  - environment-variables
date: 2023-08-27
draft: false
---
# Your pipeline is in another computer

And there is plenty of issues as consequence of this.

The other day a team member was frenetically committing changes into the project
so he could make pipeline changes and see it run. As a result, everyone else
mailboxes where overflowing with messages.

You might know the scenario, either receiving the emails or being the one
causing them!

## The problem

[CI/CD github pipeline code](https://github.com/features/actions) are supposed
to _run on the [runner](https://docs.github.com/actions/using-github-hosted-runners/about-github-hosted-runners)_
but during pipeline creation phase one can end up in a few errors and other
annoyances.

Then the naive approach is to perform several commits, fixing
[the workflow file](https://docs.github.com/actions/using-workflows/about-workflows#about-workflows).

When the solution takes longer to come, mailbox flood begins.

## The solution: [ACT](https://github.com/nektos/act) over the problem

Act is a command-line tool that allows you to run github pipelines locally,
thanks to a clever combination of [docker](https://www.docker.com/) and
[self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners).

It solves the need of commit every single change made in the pipeline; instead
of commit, just change and run. Neat.

### Pre-requisites

You will need docker running locally. If on linux, follow the
[docker engine](https://docs.docker.com/engine/install)
[for linux instructions](https://docs.docker.com/engine/install/linux-postinstall/).

Docker desktop should work too, but in this article i just tested with docker
engine.

Not mandatory, but [github cli](https://docs.github.com/en/github-cli/github-cli/quickstart)
is also nice to have because you can check the pipeline status without leaving
the terminal, therefore less context-switching, more focus.

Then go ahead and [install act](https://github.com/nektos/act/wiki/Installation).

```bash
# i use fedora btw
sudo dnf copr enable rubemlrm/act-cli
sudo dnf install act-cli
```

### Working with pipelines

By default, act will try to run a push event if no event is provided:

```bash
[sombriks@lucien simple-knex-koa-example]$ act
[Node.js CI/build-1] 🚀  Start image=catthehacker/ubuntu:act-latest
[Node.js CI/build-3] 🚀  Start image=catthehacker/ubuntu:act-latest
[Node.js CI/build-2] 🚀  Start image=catthehacker/ubuntu:act-latest
[Node.js CI/build-2]   🐳  docker pull image=catthehacker/ubuntu:act-latest platform= username= forcePull=true
[Node.js CI/build-3]   🐳  docker pull image=catthehacker/ubuntu:act-latest platform= username= forcePull=true
[Node.js CI/build-1]   🐳  docker pull image=catthehacker/ubuntu:act-latest platform= username= forcePull=true
[Node.js CI/build-3]   🐳  docker create image=catthehacker/ubuntu:act-latest platform= entrypoint=["tail" "-f" "/dev/null"] cmd=[]
[Node.js CI/build-2]   🐳  docker create image=catthehacker/ubuntu:act-latest platform= entrypoint=["tail" "-f" "/dev/null"] cmd=[]
[Node.js CI/build-1]   🐳  docker create image=catthehacker/ubuntu:act-latest platform= entrypoint=["tail" "-f" "/dev/null"] cmd=[]
[Node.js CI/build-1]   🐳  docker run image=catthehacker/ubuntu:act-latest platform= entrypoint=["tail" "-f" "/dev/null"] cmd=[]
[Node.js CI/build-3]   🐳  docker run image=catthehacker/ubuntu:act-latest platform= entrypoint=["tail" "-f" "/dev/null"] cmd=[]
[Node.js CI/build-2]   🐳  docker run image=catthehacker/ubuntu:act-latest platform= entrypoint=["tail" "-f" "/dev/null"] cmd=[]
[Node.js CI/build-1]   ☁  git clone 'https://github.com/actions/setup-node' # ref=v3
[Node.js CI/build-2]   ☁  git clone 'https://github.com/actions/setup-node' # ref=v3
[Node.js CI/build-3]   ☁  git clone 'https://github.com/actions/setup-node' # ref=v3
[Node.js CI/build-1] 🧪  Matrix: map[node-version:16.x]
[Node.js CI/build-1] ⭐ Run Main Checkout
[Node.js CI/build-1]   🐳  docker cp src=/home/sombriks/git/simple-knex-koa-example/. dst=/home/sombriks/git/simple-knex-koa-example
[Node.js CI/build-1]   ✅  Success - Main Checkout
[Node.js CI/build-1] ⭐ Run Main Use Node.js 16.x
# more and more logs
```

In the project example above, there is
[one single workflow](https://github.com/sombriks/simple-knex-koa-example/blob/main/.github/workflows/node.js.yml)
with a build matrix of three node versions.

Since we invoked act without arguments, it tries to run the default workflow
event, [the push](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#push).

To try other events, they can be provided as command line arguments, but keep in
mind that:

- the event is supposed to exists
- you might need to provide more arguments to proper simulate the event

### Environment variables and secrets

Som pipelines involves the use of external variables, info about what is being
built or credentials for publishing.

In those cases one can proper configure them into the proper section in the
github project, something like `https://github.com/<owner>/<repo>/settings/secrets/actions`.

This is also where github cli becomes handy, instead of visit the url repo and
let the comfy terminal behind, you can simply ask gh cli to list repo's secrets
and variables:

```bash
[sombriks@lucien koa-api-builder]$ gh secret list
NAME       UPDATED
NPM_TOKEN  about 14 hours ago
```

Of course, a secret is a secret, you can't retrieve it, only know it's existence
or set a new one.

But act can't use it directly from the repository. Instead, you need to create a
`.env` and/or a `.secret` file in the root of the project.

The funny part is, such file as the `.env` might already exists on your repo --
providing the exact same information.

That way, actions like [this one](https://github.com/sombriks/koa-api-builder/blob/main/.github/workflows/npm_tag_publish.yml)
will behave well either running locally or in the cloud runners in github-land:

```yaml
name: Publish npm package

on:
  push:
    tags:
      - '*'
    
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Configure Node
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Publish tag on npm
        run: |
          npm ci
          npm test 
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  
```

### Payload for event simulation

Some github action events has additional info and without it they won't behave
exactly like the real runners if not provided to `act`.

The action above depends on a
[tag push to github](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#running-your-workflow-only-when-a-push-of-specific-tags-occurs).
It can be simulated with the following command line:

```bash
[sombriks@lucien koa-api-builder]$ act -e .push-tag-event.json -w .github/workflows/npm_tag_publish.yml 
# act output
```

You must create the `.push-tag-event.json` and the `.secrets` files:

```json
{
  "ref": "refs/tags/0.2.4"
}
```

```bash
# .secrets
NPM_TOKEN=<your npm token>
```

That way you can run that tricky event with several steps by simply having
reasonable event configuration inside a file.

Regular rules applies here: **do not push to version control secrets**.

## Conclusion

Modern pipelines like github actions are very user-friendly and very extensible
thanks to the way actions can be
[created and used](https://github.com/marketplace?category=&query=&type=actions&verification=).

Even though sometimes we need extra tooling to perform our duties properly, in
time and without flooding mailboxes around the world.

Act is for sure one of those tools.

Happy hacking!
