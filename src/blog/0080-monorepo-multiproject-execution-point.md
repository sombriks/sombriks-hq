---
layout: blog.pug
tags:
  - posts
  - shorts
  - project configuration
  - project structure
  - monorepo
date: 2025-02-08
draft: false
---
# Monorepo / multiproject and point of execution

In this short, we discuss the issue with execution point in projects using this
kind of repository layout.

## One directory above

When several projects are present in the same repo, it's common to use folders
to organize them, side by side. Other layouts, like a top-level and some nested
projects are possible as well, but the issue remains: Whenever a nested one is
being worked on, the execution point, on most IDE's, will be one directory up.

And why is this an issue?

## Development and production discrepancies

For starters, _try to keep what is said and what is done as close as possible_.
Would be no surprise if the production layout for each project in the repo came
to be radically different from the development layout. Much real for compiled
and/or containerized solutions.

## Resource paths calculation

Certain projects rely on external resources and by running distinct layouts on
development and production add complexity on how those resources are located.
This affects temp folders, templates and anything else not embedded in the final
artifact.

## Solutions

In order to keep the project setup as simple as possible, a few approaches are
possible:

1. Open each project as root in the IDE.
1. Create custom execution configurations in the IDE to use custom execution
  points.
1. Avoid to use monorepos.

In the end, as a software architect, it's preferable to choose the simplest
solution for each situation. Root projects are the best choice for existing
codebases, ditch out the monorepo are the way on green field ones.
