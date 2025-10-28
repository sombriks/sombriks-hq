---
layout: blog-layout.pug
tags:
  - posts
  - tools
  - docker
  - kubernetes
  - kubectl
  - aws-cli
  - kind
  - helm
  - environment-setup
date: 2023-11-17
draft: false
---
# Quick setup your DevOps environment on Fedora 39

Last week i did a SSD upgrade on my openSUSE Tumbleweed box and decided to not
clone the old disk, doing a fresh install instead. This one i had KDE instead of
GNOME, but decided to put the new Fedora 39 on it. The KDE spin.

Sooner i realized out the tools i had to install back in order to get it ready
for daily work.

Installation process itself i'll lend no comments because it's dead simple, the
Fedora media installation is also a live cd, so you can try before touch your
system.

## Hostname

One thing i recommend if to proper set the hostname _before_ install chrome, if
you're a chrome user:

```bash
# replace 'thanatos' with a cool name for your machine
sudo hostnamectl hostname thanatos
```

Do this in order to not get hit by [this bug][1].

## Install developer tools just in case

Fedora has the concept of [package groups][2], a set of packages which are
commonly installed together therefore there is an alias to do so more quickly:

```bash
sudo dnf groupinstall "Development Tools"
```

Check `dnf grouplist` for other cool package groups.

## AWS cli

Fedora offers several cloud tools directly from its repositories.

Just install aws command line client:

```bash
sudo dnf install awscli2
```

This fedora package also delivers proper [cli completion][3] out of the box.

## Docker

Follow the [official docker guide][4] and don't forget the
[post-installation steps][5].

```bash
# installation
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```bash
# proper configuration
sudo systemctl enable docker
sudo systemctl start docker
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

```bash
# testing installation
docker run hello-world
```

## Kubectl

[kubectl][6] is the tool needed to interact with [kubernetes clusters][7].
Everything runs on kubernetes clusters nowadays so you have to have it ready for
tests, emergency deploys or any other cryptic need.

### Official tool

One way to get this is to follow the official guide:

```bash
# configure yum repo for installation and updates
# This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/repodata/repomd.xml.key
EOF
```

```bash
# install the cli
sudo dnf install kubectl
```

### From fedora repo

Another way is to simply:

```bash
sudo dnf install kubernetes-client
```

### Bash completion

Remember to configure completion for kubectl:

```bash
# configure autocomplete
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
```

## Helm

[Helm][8] is a kind of package manager for kubernetes. it makes easier to
install popular apps. It's available directly from official fedora 39 repos as
first-class citizen:

```bash
# install the cli
sudo dnf install helm
```

It's up to you however to proper configure helm autocomplete:

```bash
# configure autocomplete
helm completion bash | sudo tee /etc/bash_completion.d/helm > /dev/null
sudo chmod a+r /etc/bash_completion.d/helm
```

## Kind

[Kind][9] is the easiest and cleaner way to install kubernetes into a
development machine.

Real deal kubernetes can be a [resource hog][10], [minikube][11] and others
relies on virtual machines. Kind is designed to be light. But most important,
i like it more than the other tools, :-)

Install kind using the "source" installation, but before do that you need to...

### Install go

Kind (and several other tools from the DevOps ecosystem) is written in [Go][12]
and it's dead easy to install go on Fedora 39:

```bash
sudo dnf install golang
```

### Use go to install kind

Then install kind:

```bash
go install sigs.k8s.io/kind@latest
```

### Configure your $PATH

This installation isn't system-wide like we did for the other tools. That one is
just for you.

Therefore add those two lines on your `.bashrc` file:

```bash
export PATH="$PATH:$HOME/go/bin"
source <(kind completion bash)
```

### Check ~/.kube/config

In order to interact with the cluster using kubectl, you will need a valid
`~/.kube/config`.

Kind generates one for you when you [create a cluster](https://kind.sigs.k8s.io/docs/user/quick-start/#creating-a-cluster).

## Use k0s instead of kind

Regarding the local cluster, other cool option is [k0s][13].

But keep in mind, **pick only one provider for local cluster**. You need a clean
house in order to proper mess around and find out, ;-)

### Installing

Directly from [quickstart guide][13]:

```bash
curl -sSLf https://get.k0s.sh | sudo sh
sudo k0s install controller --single
sudo k0s start
```

One cool thing about k0s is it already comes with [metrics-server][14]:

```bash
[sombriks@lucien ~]$ sudo k0s kubectl get deployments --all-namespaces -o wide
NAMESPACE     NAME             READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS       IMAGES                                                 SELECTOR
kube-system   coredns          0/1     1            0           20h   coredns          quay.io/k0sproject/coredns:1.11.1                      k8s-app=kube-dns
kube-system   metrics-server   0/1     1            0           20h   metrics-server   registry.k8s.io/metrics-server/metrics-server:v0.6.4   k8s-app=metrics-server
```

### Bash completion and ~/.kube/config

And as you can imagine, you can install completion for that tool too:

```bash
source <(k0s completion bash)
```

But unlike kind, it does not perform automatic setup local user to interact with
the cluster. Do this:

```bash
touch ~/.kube/config
sudo k0s kubeconfig admin > ~/.kube/config
chmod 600 ~/.kube/config
```

There! We're good to go.

## Use k3s instead of kind or k0s

Regarding the local cluster, another cool option is [k3s][16].

```bash
curl -sfL https://get.k3s.io | sh -
```

And as you can imagine, you can install completion for that tool too:

```bash
source <(k3s completion bash)
```

The cool thing about k3s is it comes with metrics and a [ingress controller][17]
out of the box, so you don't have to install one. You can see what else comes
bundled with k3s [here][18].

### ~/.kube/config

Once installed, you can set up your local user to interact with the cluster by
using this command:

```bash
touch ~/.kube/config
sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/config
chmod 600 ~/.kube/config
```

## Combine kubectl configs with yaml-merge

Dealing with several clusters, local and remote, can be cumbersome.

Each tool has a way to provide `~/.kube/config` for you, but they don't talk to
each other out of the box.

One simple solution is to generate several configs and merge them using
[yaml-merge][15].

Quite easy to install:

```bash
sudo npm -g install yaml-merge
```

Quite easy to use:

```bash
# let's take an eks cluster
aws eks update-kubeconfig --name my-cluster
# and our local k0s cluster
sudo k0s kubeconfig admin > ~/.kube/config-k0s
# then merge those
mv ~/.kube/config ~/.kube/config-eks
yaml-merge ~/.kube/config-k0s ~/.kube/config-eks > ~/.kube/config
```

Of course, there are several ways to get tha merge done, but the tool is useful!

## Install VSCode and/or Intellij Ultimate

Both IDE's offer a decent kubernetes plugins which comes to be very handy when
inspecting cluster.

You, like me, will need an IDE for coding anyways.

- [VSCode kubernetes plugin][19]
- [Intellij IDEA Ultimate plugin][20]

## Install k9s

[k9s][21] is a must-have tool to use alongside kubectl itself. It helps to
better visualize what's happening and to perform quick actions on the cluster.

The simpler way to install is using go:

```bash
go install github.com/derailed/k9s@latest
```

In order to proper work all you have to do is to setup your `~/.kube/config`.

## Wrap up

There! next time i need to gear up for DevOps, this is the minimum i need. The
minimum you need.

Happy Hacking!

[1]: https://bugs.chromium.org/p/chromium/issues/detail?id=367048
[2]: https://docs.fedoraproject.org/en-US/fedora/latest/release-notes/welcome/Hardware_Overview/#hardware_overview-graphics-desktops
[3]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-completion.html
[4]: https://docs.docker.com/engine/install/fedora/
[5]: https://docs.docker.com/engine/install/linux-postinstall/
[6]: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-using-native-package-management
[7]: https://kubernetes.io/
[8]: https://helm.sh/docs/intro/quickstart/
[9]: https://kind.sigs.k8s.io/
[10]: https://linuxconfig.org/linux-system-requirements-for-kubernetes
[11]: https://minikube.sigs.k8s.io/docs/start/
[12]: https://go.dev/learn/#guided-learning-journeys
[13]: https://docs.k0sproject.io/latest/install/#install-k0s
[14]: https://github.com/kubernetes-sigs/metrics-server
[15]: https://github.com/alexlafroscia/yaml-merge
[16]: https://docs.k3s.io/quick-start
[17]: https://kubernetes.io/docs/concepts/services-networking/ingress
[18]: https://docs.k3s.io/installation/packaged-components#packaged-components
[19]: https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools
[20]: https://www.jetbrains.com/help/idea/kubernetes.html
[21]: https://github.com/derailed/k9s?tab=readme-ov-file#installation
