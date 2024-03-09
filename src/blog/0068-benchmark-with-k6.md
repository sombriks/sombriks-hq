---
layout: blog-base.webc
tags:
  - posts
  - k6
  - benchmark
  - node
  - java
  - koa
  - javalin
  - htmx
date: 2024-03-09
draft: true
---
# Benchmark node and java using k6

Benchmark code is fun. Results not always, but do the tests always are.

## Why perform load tests at all?

Back in time a friend of mine told a story about that fancy java solution that
delivered about 90% of needed code to create a ERP solution in java. It was
called [jCompany][jcompany] i think.

The sales guy was also a techie and he opened the code editor during pitch sales
and used to create things in seconds in front of the stakeholders. They got
mesmerized and opened their wallets.

A few months later the in-house development team started to smell something
funny and after a small benchmark they discovered that, no matter how much
resources they threw at it, the framework always died after 4 concurrent users.

Deals undone, [they went full JSF/JEE5][jee5] (which was the state of the art
back then) and got a reliable solution.

TL;DR: **Do a test-drive, don't fall in the salesman tricks.**

## Test real, production code or just a small sample?

One good question before dive into the benchmark world: Should i test specially
tailored code for testing purposes or should i point a stress tool to a business
endpoint and hit hard the gas?

On one hand, real, running code has several, mixed concerns. It is harder to say
we're testing processing or I/O.

On the other hand, write a piece of code specifically for processing, other for
memory usage and another just for I/O operations can deliver general
capabilities of the selected stack.

The key advantage of real code is it's already there, delivering results good
enough for your current reality.

You can take advantage of code created specifically for benchmarking when
comparing candidate platforms.

## Benchmark tool of choice: k6

There is something special about [k6][k6]

## Code under test

## Test hardware specs

## Results

## What's next

[jcompany]: https://www.devmedia.com.br/artigo-java-magazine-64-aplicacoes-corporativas-com-jcompany-free/11397
[jee5]: https://www.ibm.com/docs/en/rsas/7.5.0?topic=applications-java-ee-overview
[k6]: https://k6.io/
