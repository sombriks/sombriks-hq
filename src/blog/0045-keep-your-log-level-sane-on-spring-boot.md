---
layout: blog-base.webc
tags:
  - posts
  - java
  - spring-boot
  - dotenv-flow
  - mongodb
  - log-level
  - bug-solving
date: 2023-03-18
---

# On the importance of a good log level

Other day i went into a mysterious issue from a work colleague.

One `@PostMapping` from a spring `@RestController` simply wasn't working.

No exception, no message. Only a solid 404 on every request.

That poor soul lost a good amount of time on it, so i jumped in to check it out.

## The mistery

Everything seemed perfect.

- Frontend with the proper api url
- Other controllers, even other request handlers, working properly

However, no hit on the handler.

And no log message as well.

So i
[built a sample project](https://github.com/sombriks/sample-spring-web-jackson-issue)
to study the problem, and tried to my surprise i got it in my first attempt!

## The log silence

One thing that was supposed to happen was log messages, but they weren't there.

So the first action was to
[raise the log noise to DEBUG](https://github.com/sombriks/sample-spring-web-jackson-issue/blob/ea8c174f566f494c3e9bbb69993be103c164b7c5/src/main/resources/application.properties#L8):

```properties
# general db info
spring.data.mongodb.username=${MONGO_INITDB_ROOT_USERNAME}
spring.data.mongodb.password=${MONGO_INITDB_ROOT_PASSWORD}
spring.data.mongodb.authentication-database=admin
spring.data.mongodb.database=books

# remember to enable this if running into unexpected issues
logging.level.web=DEBUG

```

Then it came out!

```bash
2023-03-18 01:32:14.988 DEBUG 104393 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : POST "/books/faulty", parameters={}
2023-03-18 01:32:14.991 DEBUG 104393 --- [nio-8080-exec-1] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped to io.github.sombriks.sample.controller.BooksController#faultyMapping(FaultyDocument)
2023-03-18 01:32:15.016 DEBUG 104393 --- [nio-8080-exec-1] o.s.web.method.HandlerMethod             : Could not resolve parameter [0] in public void io.github.sombriks.sample.controller.BooksController.faultyMapping(io.github.sombriks.sample.model.FaultyDocument): JSON parse error: Cannot deserialize value of type `java.lang.Byte` from String "true": not a valid Byte value; nested exception is com.fasterxml.jackson.databind.exc.InvalidFormatException: Cannot deserialize value of type `java.lang.Byte` from String "true": not a valid Byte value
 at [Source: (org.springframework.util.StreamUtils$NonClosingInputStream); line: 1, column: 21] (through reference chain: io.github.sombriks.sample.model.FaultyDocument["shouldBeABoolean"])
2023-03-18 01:32:15.017  WARN 104393 --- [nio-8080-exec-1] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.http.converter.HttpMessageNotReadableException: JSON parse error: Cannot deserialize value of type `java.lang.Byte` from String "true": not a valid Byte value; nested exception is com.fasterxml.jackson.databind.exc.InvalidFormatException: Cannot deserialize value of type `java.lang.Byte` from String "true": not a valid Byte value<EOL> at [Source: (org.springframework.util.StreamUtils$NonClosingInputStream); line: 1, column: 21] (through reference chain: io.github.sombriks.sample.model.FaultyDocument["shouldBeABoolean"])]
2023-03-18 01:32:15.018 DEBUG 104393 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed 400 BAD_REQUEST
```

## The Jackson serializer "issue"

Te more silent log was hiding a rich, educational and clear jackson serializer
error behind zero lines at the problematic project and just a single line in the
issue exploration project.

The faulty entity was something like this:

```java
package io.github.sombriks.sample.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class FaultyDocument {

    @Id
    private String id;

    private Byte shouldBeABoolean;
}
```

The correction obviously was to use Boolean instead of byte.

Using the simple http requester available on intellij was also possible to
properly identify the issue:

![http-requester.png](/assets/post-pics/0045-keep-your-log-level-sane-on-spring-boot/http-requester.png)

## The end

Problem was simpler than they painted to me and i ended up playing a little with
mongodb proper setup, making sure secrets could be shared between the
[sidecar](https://learn.microsoft.com/pt-br/azure/architecture/patterns/sidecar)
running mongo and the spring application thanks to the
[spring-dotenv library](https://github.com/paulschwarz/spring-dotenv), but the
other experiment (testcontainers) didn't work as expected.

But the day was already saved, and new challenges yet to come.

Happy Hacking!
