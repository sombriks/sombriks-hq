---
layout: blog-base.webc
tags:
  - posts
  - docker
  - docker-compose
  - container
  - kubernetes
  - pod
  - deployment
  - stateful-set
  - persistent-volume
  - persistent-volume-claims
  - volumeClaimTemplates
date: 2023-12-30
draft: false
---
# The Ephemeral Nature of Containers and Persistent Things

For many learning how to do things using kubernetes it's often quite a surprise
to see everything vanishes after a simple image update on some simple manifest.

It happens because [containers are ephemeral by nature][ephemeral]. If you
haven't faced [docker][docker] or [docker compose][docker-compose] before, that
behavior inside kubernetes is quite similar.

If you have to change something in your image then you recreate all running
containers.

## The Data We Don't Want To Lose: Volumes

It implies however in several issues, specially if your container has some long,
durable, side-effects, like store data into a folder or database.

This is where the concept of [volumes][volumes] comes in.

Im very simple terms, a volume maps a container path to a host path. Or
somewhere else.

### Volumes in Docker and Docker Compose

In docker it's as simple as:

```bash
# make sure that data folder exists
mkdir data ; chmod a+rw data
docker run --rm -it \
-v ./data:/var/lib/postgresql/data \
-e POSTGRES_PASSWORD=postgres postgres:16-alpine
```

For docker compose:

```yml
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
    expose:
      - 5432
    volumes:
      # make sure that data folder exists
      - ./data:/var/lib/postgresql/data
```

### Volumes in Kubernetes: PV and PVC

For kubernetes you can use a few manifests like this:

```yml
# Define the volume in the cluster so it can be offered to pods
apiVersion: v1
kind: PersistentVolume
metadata:
  name: simple-pv
spec:
  accessModes:
    - ReadWriteOnce # it must be this value because local-path is bound to one single node
  capacity:
    storage: 2Gi
  storageClassName: local-path # this class resolves to a directory in one cluster node
  local:
    path: /opt/data # make sure the data folder exists in the node
  persistentVolumeReclaimPolicy: Retain # avoid automatic data deletion
  nodeAffinity: # needed since it's a local-path
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values:
                - spekkio # node hostname
```

A [PersistentVolume][PersistentVolume] is a way to define what a cluster has to
offer to it's containers regarding storage.

Keep in mind that what kind of volume you can offer is up to the specific k8s
implementation. [k3s][k3s] for example
[ditches off almost all storage plugins][k3s-volumes].

But let's move on, since the persistent volume is just half of the configuration.
Once you proper set up the PC, you need to define a [PersistentVolumeClaim][pvc]:

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: simple-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 2Gi
```

This configuration is a way to define what a container wants from the cluster
regarding storage.

### How To Proper Use a PVC in Kubernetes

You can consume a _claim_ by declaring it as a volume for your _workload_.

In this example we declare a simple [Pod][pod] with a volume:

```yml
apiVersion: v1
kind: Pod
metadata:
  name: postgres-pod
spec:
  containers:
    - name: postgres-container
      image: postgres:16-alpine
      ports:
        - containerPort: 5432
      env:
        - name: POSTGRES_PASSWORD
          value: postgres
      volumeMounts:
        - name: data-volume
          mountPath: /var/lib/postgresql/data
  volumes:
    - name: data-volume
      persistentVolumeClaim:
        claimName: simple-pvc
```

This approach is cool, but what happens if we decide to use a more robust
workload?

Defining, for example, a [Deployment][deployment], you can benefit from better
resource management, ReplicaSet history (so rollbacks are possible) and more.

But storage is a limited resource and having multiple containers writing at the
same resource isn't a great idea.

One solution is to make sure that you have only one replica:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
  labels:
    app: postgres
spec:
  replicas: 1 # avoid double writes issue, but at what cost?
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres-container
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_PASSWORD
              value: postgres
          volumeMounts:
            - name: data-volume
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: data-volume
          persistentVolumeClaim:
            claimName: simple-pvc
```

Another alternative is to define a [StatefulSet][stateful] and use a
[volumeClaimTemplates][vct] instead of a volume section.

The advantage is that StatefulSets are not that ephemeral and the volume claim
template provisions a pvc for each stateful replica instead of point all of them
to the same one:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-stateful-set
  labels:
    app: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
          env:
            - name: POSTGRES_PASSWORD
              value: postgres
          ports:
            - containerPort: 5432
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: data-volume
  volumeClaimTemplates:
    - metadata:
        name: data-volume
      spec:
        accessModes:
          - ReadWriteOnce # if PV can only be used by the local node
        resources:
          requests:
            storage: 1Gi
```

Like everything else in the kubernetes world, which approach to adopt depends on
your workflow.

## Conclusion

Keep data safe and sound over infrastructure updates is key to not lose valuable
business information in modern infrastructure daily chores.

There is much more on this topic, hope it helps to bootstrap the boat and see
things running.

[ephemeral]: https://docs.docker.com/engine/reference/commandline/compose_down/
[docker]: https://docs.docker.com/engine/reference/run/#clean-up---rm
[docker-compose]: https://docs.docker.com/compose/gettingstarted/#step-4-build-and-run-your-app-with-compose
[volumes]: https://docs.docker.com/storage/volumes/#create-and-manage-volumes
[PersistentVolume]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[k3s]: https://k3s.io/
[k3s-volumes]: https://docs.k3s.io/storage
[pvc]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#lifecycle-of-a-volume-and-claim
[pod]: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
[deployment]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[stateful]: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
[vct]: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#volume-claim-templates
