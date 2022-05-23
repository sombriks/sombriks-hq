# Containers (almost) everywhere

In the [previous article](#/blog/0030-containers-part-1.md) we introduced the
basics of local image and container management.

But the fun starts when you publish those images to some online registry so your
images can be used on cloud infrastructure.

## Build, tag and push

The basic drill is simple. All you need to do is build and tag your image.

After that, you need to push it into a registry.

For some registries this s a very straightforward operation. The
[public docker hub](https://hub.docker.com/) for instance will be the default
choice when using docker, but if you go with podman it will ask you which
registry you want to use.
