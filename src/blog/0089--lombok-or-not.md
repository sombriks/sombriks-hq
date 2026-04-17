---
layout: blog-layout.pug
tags:
  - posts
  - java
  - spring
  - lombok
date: 2026-04-18
draft: false
---
# Lombok: the good, the bad and the ugly

If you ask on the streets what people think about lombok, you get mixed answers.

There is neat syntax sugars, productivity goodies and other small gifts offered
by this lib, yet a whole new set of issues come along when it is added to the
project dependencies.

## The good parts

Add `@AllArgsConstructor`, a magic annotation on your class and get a handy
constructor so spring can inject yur dependencies:

```java
//...
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/boards")
public class BoardController {

    private final BoardRepo boardRepo;
    private final AssigneeRepo assigneeRepo;
    private final TaskRepo taskRepo;
    //...
}
```

Add `@Builder` and `@With` to get a [builder][builder] and a
[fluent interface][fluent]:

[builder]: https://en.wikipedia.org/wiki/Builder_pattern
[fluent]: https://en.wikipedia.org/wiki/Fluent_interface

```java
package example.lombok.demo.models;

import example.lombok.demo.dtos.TaskView;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@With
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private Assignee assignee;
    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    public static Task from(TaskView taskView) {
        return Task.builder()
                .id(taskView.id())
                .description(taskView.description())
                .build();
    }
}
```

## The bad parts

Some annotations affects the java code behavior more heavily than others.

Annotations like `@Data`, `@SneakyThrows` or `val` alters too much the expected
code behavior and should be avoided.

## The ugly parts

The biggest issue is when the generated, runtime-only, code gets in your way,
like the classic error in he `hashCode()` function that does not exist.

Taste it by running [this test][test].

[test]: https://github.com/sombriks/lombok-issues/blob/main/src/test/java/example/lombok/demo/DemoApplicationTests.java

For reference, by simply [delomboking][delombok] the project, most erros are
gone for good.

[delombok]: https://projectlombok.org/features/delombok

## Rationale

This is a rather simple example on how things can go off track quickly in a
lombok project. This is not even a complex example.

In a real project, the issue would not be that obvious.

So, what to do?

### This is a small proof of concept

No worries, go lombok all the way down.

### I have a tight schedule on this project

_And I need builders, magic constructors and fluent interfaces for free._

Go ahead, just avoid the bad parts and try to. avoid the ugly ones.

### This is a curated, long planned piece of code

_With a well-documented architecture and will be maintained by other people_

So, you're not staying around on this, instead you're going to evolve/create
**`The nex big thing?`**.

In that case, The discipline over the codebase involves code quality, The
industry's best practices documented in the literature and the active evasion of
any tool and pattern that is not future-proof or compliant with all related to
the good architectural standards.

Lombok can be called future-proof, although it can, theoretically, break with no
previous notice, but the fact that it has this error surface exposed, this is
enough to assume that those bad items and ugly ones are subject to happen.

Maybe not with you. Maybe not with me. But with the poorl soul looking at a
collapsed stacktrace hiding a call to a method that does not exists, wrapped
inside an unrelated exception.

## What is the moment of your project?

Lombok Is a productivity tool. This is undeniable.

But if long-term maintenance is important, then The mentality changes.

That said, lombok has an error surface that is not ignorable.

Think about the future.

Check the sample code [here][repo].

[repo]: https://github.com/sombriks/lombok-issues
