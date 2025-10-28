---
layout: blog-layout.pug
tags:
  - posts
  - container
  - kubernetes
  - github actions
  - GitOps
  - CI/CD
  - ArgoCD
date: 2023-12-16
draft: false
---
# Containers and deployment pipelines

In the [previous article](/blog/0058-containers-part-4-k8s-with-kind)
we discussed how to publish a containerized software solution in a kubernetes
cluster.

However we did it 'manually' and this is not how a modern software deployment
strategy works. We have automatic pipelines and a lot of opinions on how to do
automatic publishing.

In this article, I'll go through one way to do this, the [GitOps][gitops] way.
But first let's fast forward some base concepts.

## What is an environment

All computational resources needed to run a software solution which fulfill some
purpose we call [environment][environment].

Hardware, operating system, application servers and distinct configuration
options that make possible our app to run and work as expected. This is an
environment.

## What is a deployment

Whenever we install or update our app into an environment we call it a
[deployment][deployment].

It differs from environment setup because install or update, for example, a
configuration, does not changes the application, just influence it's behavior.

## What is a Pipeline

Several steps might be needed to deploy an app, and let it to be done manually
is a well-proven way to get failures and other issues.

Then you write code (scripts) to automatize such processes.

We call those automation scripts [pipelines][pipeline] nowadays.

## What is Continuous Integration

The common practice of build pipelines closely tied to version control systems
like git and perform unit, integration and e2e tests, code analysis and other
development-related operations we call Continuous Integration, o just CI.

Everything that contributes to grow our confidence on the purpose and quality of
the app code, and can be done by a robot, automatically, enters in this pipeline
category.

## CI/CD (Delivery) x CI/CD (Deployment)

The pipelines involved in make the code run goes under the 'CD' acronym.

Funny part is: there is two distinct meanings!

### Delivery

Whenever you just need to publish the result of your compilation/building
somewhere, you call it delivery.

A desktop app is delivered to a download server so the users can go and grab a
shiny new copy. This is delivery. Sounds unfamiliar? You are not old enough!

A node library goes published on npm registry, under a version number and maybe
a few lines of release notes. This is delivery.

A container image is built and gets published into a container registry, either
public, private or even both! This is delivery.

Key characteristic of delivery is **we stop once the app or library is built.**

### Deployment

Whenever you do a pipeline that put new app version to run, that's delivery.

If your [Jenkins][jenkins] pipeline runs a bash script to stop the application,
update it to the latest version and then run it again, that's deployment.

If your [Java Web Start Application][thats-old] is updated on every client in a
transparent way, that's deployment.

Your [Heroku App][heroku] or [DO App Platform][do-app] or
[AWS Lightsail][lightsail] or [Google Cloud Run][gcloud-run] get a git push and
moments later a newer version is live? That's deployment.

Key characteristic of deployment is **we stop only when the app is running.**

## Github Actions

[GitHub Actions][gh-actions] is what happens when [yaml files][yaml] and
[bash scripts][bash] decide to bear a child.

It's a tool to ease creation of pipelines using the GitHub infrastructure.

See [my previous article][0061] for detailed info.

### Delivery with GitHub Actions

There is a [github actions marketplace][marketplace-integration] offering ready
to use pipelines for continuous integration and continuous delivery.

But you can create your own either from scratch or reusing actions from the
marketplace. The example bellow publishes a npm package whenever a git tag is
pushed to the repo:

{% raw %}

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
          npm run test:coverage 
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        
```

{% endraw %}

This workflow observers push events, then runs one job called `publish`. The job
has 3 steps: **Checkout**, **Configure Node** and **Publish tag on npm**. First
two reuses actions from marketplace, last one issues bash commands as if it was
a developer with access to npm registry, thanks to the token defined as
environment variable. See the project using this action [here][sample-1].

And of course, a [valid npm account][npm] is needed to get the package published.

Another example: publish a docker image for every tag push:

{% raw %}

```yaml
name: Publish git tag as Docker image

on:
  push: 
    tags: ['*'] 

env:
#  DOCKER_REGISTRY: registry.hub.docker.com
  SERVICE_NAME: ${{ github.event.repository.name }}
  DOCKERFILE: ./infrastructure/Dockerfile
  GIT_TAG: ${{ github.ref_name }}
  DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
  DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Run Node.js tests before build the image
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      - run: |
          npm ci
          npm run build --if-present
          npm run test:coverage

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in into Docker Hub
        uses: docker/login-action@v2.2.0
        with:
#          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ env.DOCKER_USERNAME }}
          password: ${{ env.DOCKER_PASSWORD }}

      # This step is tailored specifically for docker hub,
      # see the action docs for other registries
      - name: Build and publish image on Docker hub
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ${{ env.DOCKERFILE }}
          tags: |
            ${{ env.DOCKER_USERNAME }}/${{ env.SERVICE_NAME }}:${{ env.GIT_TAG }}
            ${{ env.DOCKER_USERNAME }}/${{ env.SERVICE_NAME }}:latest
          platforms: linux/amd64,linux/arm64
          push: true
```

{% endraw %}

This one goes all-in with marketplace actions for publishing, and again observes
a tag push event.

You need a [valid docker hub account][docker-hub] for this noe work.

Usually, CD pipelines also includes CI ones, this is why we're seeing commands
like `npm run test:coverage` on both examples. CI/CD can be joined, like pipes,
one to another. Therefore the pipeline name.

### Deployment with GitHub Actions example

Continuous deployment challenges are similar to the ones seen in continuous
delivery, but there are some catches:

- When delivering, previous versions are unaffected. A deployment however
  replaces current running app
- For delivering, there is time to gather all changes, create a changelog, put
  a release page to present your new baby to the world properly. Deployments on
  the other hand, happens more frequently and usually after a single push to a
  branch representing the current state of things.
- There are much more moving parts involved in continuous deployment than in
  continuous delivery. Therefore much more opportunities of failure. Longer pipe
  means more leaking and breaking.

The following example Does the first two parts of a deployment: image publishing
and desired state update:

{% raw %}

```yaml
name: Deploy new version

on:
  push:
    branches: [ "main" ]

jobs:
  version-bump:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Use Node.js 20
      uses: actions/setup-node@v3
      with:
        node-version: 20.x
        cache: 'npm'
    - id: version-minor
      name: Bump npm version
      run: |
        git config user.name github-actions
        git config user.email github-actions@github.com
        export tag=$(npm version minor)
        echo "tag=$tag" >> $GITHUB_OUTPUT
        git push origin $tag
        git push
    outputs:
      tag: ${{steps.version-minor.outputs.tag}}

  run-test-deploy:
    needs: [version-bump]
    uses: ./.github/workflows/_base.yml
    permissions:
      contents: write
    secrets: inherit
    with:
      PUBLISH: true
      UPDATE_DESIRED_STATE: true
      TAG: ${{needs.version-bump.outputs.tag}}
```

{% endraw %}

It runs whenever code is merged on main branch, which represents the current app
state.

There are two jobs, first one just perform a tag bump in the branch, so a proper
docker image tag can be built based on it. The second job uses another workflow,
which basically performs Continuous integration and delivery steps. Remember,
pipelines, one pipe into another.

On that second workflow file, the noteworthy part is that one:

{% raw %}

```yaml
# ...
  update-desired-state:
    if: ${{inputs.UPDATE_DESIRED_STATE == true}}
    runs-on: ubuntu-latest
    needs: [publish-image, prepare-git-tag]
    env:
      image: ${{secrets.DOCKER_USERNAME}}/${{inputs.SERVICE_NAME}}:${{ needs.prepare-git-tag.outputs.git-tag }}
    permissions:
      contents: write
    
    steps:
    - name: Checkout source code
      uses: actions/checkout@v4

    - name: Pull tag changes
      run: git pull

    - name: Update docker-compose.yml
      uses: fjogeleit/yaml-update-action@v0.13.2
      with:
        valueFile: ${{inputs.COMPOSEFILE}}
        propertyPath: 'services["knex-koa-app"].image'
        value: ${{env.image}}
        commitChange: false

    - name: Update k8s app-deployment.yml
      uses: fjogeleit/yaml-update-action@v0.13.2
      with:
        valueFile: ${{inputs.DEPLOYMENTFILE}}
        propertyPath: 'spec.template.spec.containers[0].image'
        value: ${{env.image}}
        commitChange: false
    
    - name: Commit desired state
      run: |
        git config user.name github-actions
        git config user.email github-actions@github.com
        git add .
        git commit -m "manifests image bump to ${{env.image}}"
        git push
```

{% endraw %}

For git-based deployment strategies, the current state of the repository is used
as [Single Source of Truth][ssot]. That means whatever app version is running
right now, it must be the latest version on version control.

Therefore it's very important to automate small to big things, like a version
label, a git tag or a kubernetes deployment manifest file or docker compose file
with the latest created image. That part is paramount on continuous delivery
pipelines.

The complete pipelines files can be found [here][cicd].

One thing to note: this workflow actually does not deploy the new app version.
It could, but this one just updates the [desired cluster state][k8s-deployment].

Pipelines that also does the publication based on the desired state are called
[push-based deployments][push-based].

They are usually simpler to understand yet more verbose and somewhat less secure
because your pipeline knows too much: it will need credentials for get the code,
build and publish in some registry and then access to your production
environment.

That leads us to...

## GitOps pull-based Deployment

Pull-based deployments relies on some agent peeking time to time the most recent
or desired state present in the git repository. If there is something new, the
running app is stopped and a new version is pulled and provisioned.

The second part for that continuous deployment presented here (fist part being
all those GitHub Actions files) is [Kubernetes][k8s] with [ArgoCD][argocd].

Kubernetes is used to be sure that scaling, up or down, won't be an issue.

ArgoCD watches the manifest files in the latest version on git branch and if
there is a difference it applies new manifests automatically. That way the
desired state will always be the same from the single source of truth.

## Conclusion

Modern pipelines can be a little overwhelming sometimes. But keep in mind that
by solving one piece at time it's possible to tame the beast and make it tow the
cargo for you, granting more time to think about the real day to day issues,
like which color should be used into a button or if that endpoint should return
400, 422 or something else.

The complete source code examples presented in this article you can find
[here][here].

Happy hacking!

[gitops]: https://www.redhat.com/topics/devops/what-is-gitops
[environment]: https://www.sciencedirect.com/topics/computer-science/computing-environment
[deployment]: https://en.wikipedia.org/wiki/Software_deployment
[pipeline]: https://www.atlassian.com/devops/devops-tools/devops-pipeline
[jenkins]: https://www.jenkins.io/doc/pipeline/tour/hello-world/
[thats-old]: https://www.java.com/download/help/java_webstart.html
[heroku]: https://www.heroku.com/
[do-app]: https://www.digitalocean.com/products/app-platform
[lightsail]: https://aws.amazon.com/pt/free/compute/lightsail
[gcloud-run]: https://cloud.google.com/run
[yaml]: https://yaml.org/
[bash]: https://www.gnu.org/software/bash/
[gh-actions]: https://docs.github.com/en/actions/quickstart
[0061]: /blog/0061-github-actions-recipes/
[marketplace-integration]:https://github.com/marketplace?category=continuous-integration&type=actions
[sample-1]: https://github.com/sombriks/koa-api-builder
[npm]: https://www.npmjs.com/
[docker-hub]: https://hub.docker.com/
[ssot]: https://en.wikipedia.org/wiki/Single_source_of_truth
[cicd]: https://github.com/sombriks/simple-knex-koa-example/tree/develop/.github/workflows
[k8s-deployment]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[push-based]: https://about.gitlab.com/blog/2022/05/18/pull-based-kubernetes-deployments-coming-to-gitlab-free-tier/
[k8s]: https://kubernetes.io/
[argocd]: https://argo-cd.readthedocs.io/en/stable/
[here]: https://github.com/sombriks/simple-knex-koa-example
