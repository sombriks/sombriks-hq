---
layout: base.webc
tags: 
  - posts
  - misc
  - long rant
date: 2023-01-29
---
# Light rant about embedded solutions for Jakarta EE

_update 2023-02-01_ the [microprofile specification](https://microprofile.io/)
might be what i want.

Unlike [spring-boot](https://spring.io/projects/spring-boot),
[JakartaEE](https://jakarta.ee/) applications usually organizes application code
apart from server code.

Java web projects used to be packaged into [war](https://en.wikipedia.org/wiki/WAR_(file_format))
or [ear](https://www.ibm.com/docs/en/baw/19.x?topic=modules-ear-file-overview)
files and the server was managed separately.

**I am trying to find a project layout for JakartaEE projects that comply with separation but behaves more like a
springboot app** and, in order to get it, i am exploring the embedded app servers approach.

So far, i am thinking on a multiproject layout, one with regular JEE style structure and another with an embedded app
server consuming the first one. Gradle and maven both supports it:

- <https://docs.gradle.org/current/userguide/multi_project_builds.html>
- <https://books.sonatype.com/mvnex-book/reference/multimodule-sect-simple-parent.html>

For the embedded app server i found these samples so far:

- <https://blog.payara.fish/what-is-payara-embedded>?
- <https://www.ibm.com/docs/en/was-liberty/zos?topic=liberty-embedding-server-in-your-applications>
- <https://stackoverflow.com/questions/71383171/simple-embedded-tomcat-10-example>
- <https://github.com/wildfly/wildfly-core/blob/main/embedded/src/test/java/org/wildfly/core/embedded/EmbeddedServerFactorySetupUnitTestCase.java>
- <https://www.eclipse.org/jetty/documentation/jetty-11/programming-guide/index.html#creating-helloworld-class>

A good article on this topic follows:

- <https://www.baeldung.com/executable-jar-with-maven>

For the project layout i don't have much ideas yet, i am only sure about the
separation of the two modules. A few questions so far:

- should the embedded final jar file be an [uber jar](https://imagej.net/develop/uber-jars)?
- should the war/ear artifact be repackaged?
- why this approach isn't more popular, given the clear success of spring boot?

Any comment on this topic is
welcome [on this thread](https://stackoverflow.com/questions/75274795/embedded-portable-jakartaee-application-design-approach).

---
Tags:
{%- for tag in tags -%}
[{{tag}}](/blog/?tag={{tag | slugify}})
{%- endfor -%}
