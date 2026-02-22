---
layout: blog-layout.pug
tags:
  - posts
  - gitlab-ci
  - recipes
  - CI/CD
date: 2026-02-22
draft: false
---
# Simple recipes for Gitlab ci

Today we talk about pipelines.

Well, to be specific, how we write pipelines nowadays. For [Gitlab][gitlab].

[gitlab]: https://gitlab.com

## What is a workflow

A sequence of automated tasks to be performed on your code to produce an
expected output, that is a workflow.

Run tests? Coverage or code quality reports? artifact generation? deployment?
All of it, step by step? This is a pipeline.

For gitlab-hosted projects, the pipeline is declared in a file called
[.gitlab-ci.yml][glciyml]

[glciyml]: http://docs.gitlab.com/ci/

In this file, you declare [jobs][job].

[job]: https://docs.gitlab.com/ci/jobs/

## The simplest possible job

On a gitlab project, create a `.gitlab-ci.ynl` file:

```yml
# .gitlab-ci.ynl
---
simplest-job:
  script: echo 'hello world'
```

Whenever you push code, it runs.

## 1 pipeline, 2 jobs

You can declare, of course, more than one job:

```yml
# .gitlab-ci.ynl
---
ping:
  script: echo 'ping!'

pong:
  script: echo 'pong!'

```

The jobs will run **concurrently**.

## Create stages for your pipeline

Gitlab supports a concept called [stages][stage]. it's the easiest way to create
a sequence of steps for your pipeline:

[stage]: https://docs.gitlab.com/ci/yaml/#stage

```yml
# .gitlab-ci.ynl
---
stages:
  - first
  - second
  - third

ping:
  stage: first
  script: echo 'ping!'

pong:
  stage: first
  script: echo 'pong!' 

foo:
  stage: second
  script: echo 'foo!' 

bar:
  stage: second
  script: echo 'bar!' 

result:
  stage: third
  script: |
    echo 'in the end we got:'
    ls -la

```

Now you know how to get parallel and sequential jobs. How about to make them
talk to each other?

## Run jobs, make artifacts

The way to left some intermediary product to be processed by the next job is
using [artifacts][artifacts].

[artifacts]: https://docs.gitlab.com/ci/yaml/#artifacts

```yml
# .gitlab-ci.ynl
---
stages:
  - first
  - second
  - third

ping:
  stage: first
  script: echo 'ping!' > ping.txt
  artifacts:
    paths:
      - ping.txt

pong:
  stage: first
  script: echo 'pong!' > pong.txt
  artifacts:
    paths:
      - pong.txt

foo:
  stage: second
  script: echo 'foo!' > foo.txt
  artifacts:
    paths:
      - foo.txt

bar:
  stage: second
  script: echo 'bar!' > bar.txt
  artifacts:
    paths:
      - bar.txt

result:
  stage: third
  script: |
    echo 'in the end we got:'
    cat ping.txt
    cat pong.txt
    cat foo.txt
    cat bar.txt
    
```

Now you know how to connect one job output into another job input.

## Define a docker image for the job

You might need distinct tools for distinct jobs. Set a docker image for a job
is easy:

```yml
# .gitlab-ci.ynl
---
stages:
  - part1
  - part2

python-build:
  stage: part1
  image: python
  script:
    - python --version > python-build.txt
  artifacts:
    paths: [python-build.txt]

node-build:
  stage: part1
  image: node
  script:
    - node --version > node-build.txt 
  artifacts:
    paths: [node-build.txt]

check-results:
  stage: part2
  script:
    - echo 'results:'
    - cat node-build.txt
    - cat python-build.txt

```

## Better control of job execution

The default trigger is a push.

However, you can tweak your pipeline to fire on [other kinds of evens][job-ctl]:

[job-ctl]: https://docs.gitlab.com/ci/jobs/job_control/

```yaml
# .gitlab-ci.ynl
---
automatic:
  script: echo 'i run always.'
not-automatic:
  script: echo 'trigger me!'
  when: manual
```

## Reusing job declarations

When things get truly bigger, makes sense to use [reusable job components][rjc]
to ease pipeline maintenance.

[rjc]: https://docs.gitlab.com/ci/components/

## Further reading

Check the [complete source code here][repo].

Check the [GitHub version here][gh].

[repo]: https://gitlab.com/sombriks/pipeline-playground
[gh]: ./0061-github-actions-recipes

Happy hacking!
