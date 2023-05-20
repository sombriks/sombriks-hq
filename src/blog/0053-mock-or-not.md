---
layout: blog-base.webc
tags:
  - posts
  - kotlin
  - mockito
  - h2
  - test
date: 2023-05-14
draft: true
---
# To mock or not to mock, that is the question

Any day in the week, if you ask me "should i mock my beans for testing", i'll
say no.

But there are scenarios where mock things is the best approach to keep trusting
the code.

## Why test at all?

One could ask "why waste time writing tests?" and i could answer "to save time".

The test suite present in the source code is the first documentation a
programmer can access when joining a new project, it is supposed to cover all
main scenarios and also a fully working test suite with decent coverage means
there is some degree of correctness in the code presented to us.

## Why mock tests?

Sometimes the scenario where application is supposed to run is quite complex,
involving databases, external rest services, event brokers, queues and so on.

Because of that, the test scenario itself become utterly complex and hard to
reproduce.

This is also why [there is difference](https://circleci.com/blog/unit-testing-vs-integration-testing)
between unit test suites and integration test suites.

## How to avoid to mock things

Although hard, it usually worths not mock complex test scenarios.

## If going to mock, how to do that properly

## Conclusion
