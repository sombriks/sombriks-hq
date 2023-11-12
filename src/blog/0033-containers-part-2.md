---
layout: blog-base.webc
tags: 
  - posts
  - docker
  - podman
  - container
  - container registry
  - docker-compose
  - aws
date: 2022-05-23
---
# Containers (almost) everywhere

In the [previous article](#/blog/0030-containers-part-1.md) we introduced the
basics of local image and container management.

But the fun starts when you publish those images to some online registry so your
images can be used on cloud infrastructure.

## Login, build, tag and push

The basic drill is simple. All you need to do is build and tag your image.

After that, you need to push it into a registry.

For some registries this s a very straightforward operation. The
[public docker hub](https://hub.docker.com/) for instance will be the default
choice when using docker:

```bash
$ docker login 
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: 
Password: 
WARNING! Your password will be stored unencrypted in /home/sombriks/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

If you go with podman it will offer you some extra registries configured in
`/etc/containers/registries.conf`:

```bash
$ podman login docker.io
Username: sombriks
Password: 
Login Succeeded!

# or even:
$ podman login quay.io
Username: sombriks
Password: 
Error: error logging into "quay.io": invalid username/password
```

You can also create your own registry. Let's make one in amazon:

```bash
$ aws ecr create-repository --repository-name my-repo
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:us-east-1:912830451493:repository/my-repo",
        "registryId": "912830451493",
        "repositoryName": "my-repo",
        "repositoryUri": "912830451493.dkr.ecr.us-east-1.amazonaws.com/my-repo",
        "createdAt": "2022-05-23T17:48:21-03:00",
        "imageTagMutability": "MUTABLE",
        "imageScanningConfiguration": {
            "scanOnPush": false
        },
        "encryptionConfiguration": {
            "encryptionType": "AES256"
        }
    }
}
```

Now we do login almost as usual, just need a trick to get the repo password:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 912830451493.dkr.ecr.us-east-1.amazonaws.com 
```

Let's build our image as usual. I'll use
[this sample code](https://github.com/sombriks/sample-typescript-backend-service)
for this purpose.

```bash
$ podman build -t 912830451493.dkr.ecr.us-east-1.amazonaws.com/my-repo:latest .
STEP 1/11: FROM node:14-alpine
STEP 2/11: LABEL MAINTAINER="sombriks"
--> Using cache 01a07954891403b4a102c3eceebd28cd926142bc455b1833b9e333b37ffea5d8
--> 01a07954891
STEP 3/11: ENV NODE_ENV=production SECRET=ch4ng3-m3
--> Using cache f82fd0cb223439fec4b0c5bf1393cf80d603eaa436323dd4531df5c1f1f372b9
--> f82fd0cb223
STEP 4/11: EXPOSE 3000
--> 5b0212fe7c1
STEP 5/11: ADD .eslintrc.js .prettierrc knexfile.js nest-cli.json package.json tsconfig.build.json tsconfig.json /app/ 
--> feb7c817ede
STEP 6/11: ADD src /app/src
--> 126ec36fc35
STEP 7/11: ADD test /app/test
--> db27af1a8ed
STEP 8/11: ADD migrations /app/migrations
--> 4b61b3f4ea1
STEP 9/11: WORKDIR /app
--> 147299da03c
STEP 10/11: RUN npm install ; npm run build

> sqlite3@5.0.8 install /app/node_modules/sqlite3
> node-pre-gyp install --fallback-to-build

[sqlite3] Success: "/app/node_modules/sqlite3/lib/binding/napi-v6-linux-musl-x64/node_sqlite3.node" is installed via remote

> @nestjs/core@8.4.5 postinstall /app/node_modules/@nestjs/core
> opencollective || exit 0

npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.2 (node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN ajv-keywords@3.5.2 requires a peer of ajv@^6.9.1 but none is installed. You must install peer dependencies yourself.

added 268 packages from 311 contributors and audited 857 packages in 28.242s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities


> sample-typescript-backend-service@0.0.1 prebuild /app
> rimraf dist


> sample-typescript-backend-service@0.0.1 build /app
> npx @nestjs/cli build

npx: installed 246 in 6.528s
--> 267c5f2c89f
STEP 11/11: ENTRYPOINT npm start
COMMIT 912830451493.dkr.ecr.us-east-1.amazonaws.com/my-repo:latest
--> 89aa74d21c4
Successfully tagged 912830451493.dkr.ecr.us-east-1.amazonaws.com/my-repo:latest
89aa74d21c459392c3281ba0201f4a093b4b1c19af6a5a5475c2ae8c32e362eb

```

Note how we tagged the image building. All we need to do now is to push the
image into this registry:

```bash
$ podman push 912830451493.dkr.ecr.us-east-1.amazonaws.com/my-repo:latest
Getting image source signatures
Copying blob 723977e5b666 done  
Copying blob eca70a37a12e done  
Copying blob 6c676cf66a34 done  
Copying blob 4fc242d58285 done  
Copying blob 154d9e329190 done  
Copying blob c8e8f8cbc5e1 done  
Copying blob 29cc6a1f60fc done  
Copying blob f511c5eb27b3 done  
Copying blob 0e7276fa728b done  
Copying config 89aa74d21c done  
Writing manifest to image destination
Storing signatures
```

Similar moves can be done
[with](https://devcenter.heroku.com/articles/container-registry-and-runtime)
[other](https://cloud.google.com/container-registry/docs/pushing-and-pulling)
[cloud](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli?tabs=azure-cli)
[providers](https://docs.digitalocean.com/products/container-registry/quickstart/).

## Compose with images only

Using docker-compose / podman-compose to orchestrate image building is cool, but
it's even cooler when you use it with already built images. Major advantage is
separation between construction and execution.

If the image hits the container then it means it build correctly.

If you're running on images, that's great, just tear down for a moment to use
new images and life goes on.

On the other hand, if you tear down to perform a new image building and it went
bad, there might not be easy to rollback to previous version.

```bash
# tag it back to docker.io pattern <username>/<image> for commodity
podman tag 912830451493.dkr.ecr.us-east-1.amazonaws.com/my-repo sombriks/my-sample-backend-service

# push it. it may take a while
podman push sombriks/my-sample-backend-service:latest 
```

Now your docker-compose file will take no build step:

```yml
# sample-docker-compose.yml
version: 3
services:
  web:
    image: sombriks/my-sample-backend-service
    ports:
      - 3000:3000
    environment:
      - POSTGRES_USERNAME=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sample_service
    links:
      - db
    depends_on:
      - db
  db:
    image: postgres
    ports:
      - 5432:5432
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sample_service
```

```bash
podman-compose -f sample-docker-compose.yml up
```

## What's next

So far we published images over the internet and eve tried different registries
instead just primary docker hub.

Next step is to run custom container on cloud infrastructure instead of local
compose orchestration.
