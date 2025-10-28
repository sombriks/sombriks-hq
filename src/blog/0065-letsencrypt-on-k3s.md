---
layout: blog-base.webc
tags:
  - posts
  - container
  - kubernetes
  - k3s
  - tls
  - ssl
  - https
  - traefik
  - letsencrypt
date: 2024-02-11
draft: false
---
# Free and fast TLS (SSL) for your traefik ingress on k3s

This quick tutorial will help to configure cert-manager and Letsencrypt free SSL
provider on your k3s kubernetes cluster.

## The cluster

Setup it using the [k3s official guide][1].

## The DNS setup

Since it's very provider-dependent, we're not covering it there. But it's not
that hard, just very cloud vendor dependent.

## The application

Any application in need to serve https content will do. Take [this example][2]
as reference.

## The deployment, service and ingress IaC manifests

In order to publish something in a kubernetes cluster, those 3 are the most
common need. We discussed them [in a previous post][3].

By having the app and the basic infrastructure applied in the cluster, we're
supposed to have the app listening, but using a self-signed cert which does not
inspire much security.

## Installing cert-manager

The process is as simple as follow [the official guide][4].

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.2/cert-manager.yaml
```

## Applying the cluster issuer manifest

In this article we'll using a [cluster issuer][7]. It is responsible to talk with
letsencrypt and sign a certificate for the domain name configured previously.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email-here@email.com # change this to your email
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik 
```

## Modifying ingress manifest

Once you got the cluster issuer properly applied (remember, cert-manager first,
cluster issuer manifest later!) you will need to modify ingress manifest to add
the tls terminations.

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-redline-api
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - api.redline.sombriks.org
        - app.redline.sombriks.org
      secretName: letsencrypt-prod # secret name, same as the privateKeySecretRef in the (Cluster)Issuer
  rules:
    - host: api.redline.sombriks.org
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: service-redline-api
                port:
                  number: 3000

```

Note: if you have **more than one ingress** you might end up having to declare
all hosts you want to secure in all ingresses. If you don't, one of the services
might end up not getting a cert.

## Further steps

Now your app has secure connection over the internet and get extra benefits from
it, like work properly on modern browsers, able to declare itself as a [PWA][5]
and so on.

One extra bit of configuration would be the
[automatic http to https request upgrade][6] but it's Carnival and bye bye boys!

Happy hacking!

[1]: https://docs.k3s.io/installation
[2]: https://github.com/sombriks/redline
[3]: /blog/0058-containers-part-4-k8s-with-kind
[4]: https://cert-manager.io/docs/installation/
[5]: https://www.pwabuilder.com/
[6]: https://k3s.rocks/https-cert-manager-letsencrypt/
[7]: https://cert-manager.io/docs/concepts/issuer/
