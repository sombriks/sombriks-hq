---
layout: blog.pug
tags:
  - posts
  - node
  - git
  - deployment
  - GitOps
  - CI/CD
  - backend
date: 2023-12-22
draft: false
---
# Deploy your service the easiest possible way

Just push and done, it will deploy.

## The git-based-deployment Era

[On][containers1] [Previous][containers2] [Articles][containers3]
[We][containers4] [Discussed][containers5] complex ways to prepare software to
run in production environments and one could ask "is it all really necessary?"
and no one could blame such question as dumb.

To be fair, industrial-level solutions like kubernetes are not about ease of use
but resource control instead. This issue is not new but it is also not a problem
affecting everyone. Small business and freelancers just need the application up
and running somewhere and that's it.

In fact, There are several services that solves the deployment issue in a simple
and neat way, let's see a few just as example.

## Key characteristics

Before we advertise services for free, these are the key benefits we seek on
this kind of solution:

- Able to run actual code; if we wanted to just serve static content,
  [there][firebase] [are][vercel] [several][netifly] free options over the
  internet already.
- Integration with git workflows (and with git providers like **GitHub** or
  **GitLab**)
- As cheap as possible (free tier sometimes)
- As transparent as possible (not a single code change related to the deployment
  process should be made or minimal if any)

So let's get started.

## Heroku

[Heroku][heroku] is one of the oldest and best git-based-deployment solutions in
activity. It used to have a free tier, but now it's gone.

All setup can be made using the web dashboard, it asks for permissions on your
git repository, asks for a branch and that's it, one push merged, one deploy.

There is no free-tier anymore and by the time this article was written, the
cheapest option would cost $5 USD.

## Digital Ocean App Platform

[DO App Platform][doapp] is one of the newest services providing publish and
forget solutions.

All setup can be made using the web dashboard, it asks for permissions on your
git repository, asks for a branch and that's it, one push merged, one deploy.

There is no free-tier in practice; what they offer for $5 USD is a container
serving static content and by the time this article was written, the cheapest
real option to run a node project would cost $12 USD.

## Google Cloud Run

[Cloud Run][gcrun] has interesting features like Docker container support and
vpc integration so you can integrate and grow to a more complex cloud solution
over the time. But luckily it's pretty much the same as any other
git-based-deployment solutions.

All setup can be made using the web dashboard, it asks for permissions on your
git repository, asks for a branch and that's it, one push merged, one deploy.

There is a [free tier][gcr-free] based on usage, which is nice because you can
use that one for your pet projects with no worries or surprises in the
credit-card bill.

## Render

[Render][render] offers a free tier but with some limitations. It does, however,
a full featured git deployment once you authorize the application to access your
GitHub or GitLab account.

## Transparency

The [sample project][node-simple] has zero knowledge of those service providers
yet [it went live][example] in less than 5 minutes.

This is good because there is no vendor lock-in and also shows that all those
services tend to respect some defaults, like the $PORT variable environment and
the default entrypoint for application type (`npm start` for our example).

## Conclusion

Get code up and running should not be a challenge specially if you are the
entire team or if your budget isn't that great.

[Dig][google] and you will find a lot more options.

Happy hacking!

[containers1]: /blog/0030-containers-part-1/
[containers2]: /blog/0033-containers-part-2/
[containers3]: /blog/0055-containers-part-3-app-container-friendly/
[containers4]: /blog/0058-containers-part-4-k8s-with-kind/
[containers5]: /blog/0062-containers-part-5-gitops/
[heroku]: https://dashboard.heroku.com/
[doapp]: https://cloud.digitalocean.com/apps
[gcrun]: https://console.cloud.google.com/run
[firebase]: https://firebase.google.com/docs/hosting
[vercel]: https://vercel.com/
[netifly]: https://www.netlify.com/
[render]: https://render.com/
[gcr-free]: https://cloud.google.com/run/pricing
[node-simple]: https://gitlab.com/sombriks/node-simple
[example]: https://node-simple-f24wxjc6wa-uc.a.run.app/todos
[google]: https://google.com?q=git+based+deploy+solutions
