---
layout: blog-layout.pug
tags:
  - posts
  - kotlin
  - test
  - mockito
date: 2023-05-20
draft: false
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

Although hard, it usually worths not mock complex test scenarios. Question is
how to create a near real test scenario.

[Most](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.profiles)
[frameworks](https://docs.micronaut.io/snapshot/guide/index.html#environments)
[supports](https://quarkus.io/guides/config-reference#profiles) different
application profiles and using them properly is the key for testing without mock
things.

### Not mocking the database

The most common integration test scenario is the database. If possible, avoid to
mock your database and create tests against the real thing. Or the most real as
possible thing.

For example, you can use a
[h2 embedded database](http://www.h2database.com/html/main.html) to run your
tests. Just prepare your test application profile to use it.

The drawback here is the dialect differences between the production database and
the testing database. Sometimes the application uses very specific functions
that aren't present in all database flavors. H2 will behave
[mostly well](http://h2database.com/html/advanced.html#recursive_queries).

You can see an example of
[h2 for tests](https://github.com/sombriks/exercicio-spring-angular/blob/main/backend/src/test/resources/application.properties)
and
[something else for production](https://github.com/sombriks/exercicio-spring-angular/blob/main/backend/src/main/resources/application.properties)
[here](https://github.com/sombriks/exercicio-spring-angular/blob/main/backend/src/test/java/exercicio/java/angular/backend/BackendApplicationTests.java).

There is also [testcontainers](https://www.testcontainers.org/), but it relies
on a proper docker installation into the test runner machine.

### Not mocking the REST service

This one is easier or the hardest one, depending on context.

Keep a second REST service endpoint solely for testing purposes.

Keep a _staging_ endpoint.

It can be easy if you call the shots on the service being consumed, but hard if
there is no such thing already offered by your supplier.

### Not mocking redis

Some redis [test solutions](https://www.baeldung.com/spring-embedded-redis) can
spin it up for you so your tests will have a redis queue available for tests.

## If going to mock, how to do that properly

You where been warned.

Even so, if you still wat to mock things here goes a few advices in order to do
a decent damage control.

Mocks are lies. If you're going to lie, at least come up with a good one.

### Try to sound as much real as possible

The following test mock passes but it's a lousy lie:

```kotlin
package foo.company.service

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.MockitoAnnotations

class FooBarServiceTest {

    @InjectMocks
    lateinit var fooBarService: FooBarService

    @Mock
    lateinit var fooBarRepository: FooBarRepository

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
        Mockito.`when`(fooBarRepository.list().thenReturn(emptyList())
    }

    @Test
    fun `should get products`() {
        val products = FooBarService.list()
        assert(products.size == 0)
    }
}
```

Instead of return an empty list, return one with reasonable values, similar to
the ones from the real database if possible.

### Let the code flow as much as possible

Mock repositories, let controllers, services and any other layers run for real:

```kotlin
package foo.company.controller

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.kotlin.anyOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@WebMvcTest(ProductsController::class)
class ProductsControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var metadataRepository: MetadataRepository

    @MockBean
    private lateinit var authService: AuthService

    @Value("\${mock.token}")
    private var mockToken: String = ""

    @BeforeEach
    fun setUp() {
        Mockito.`when`(authService.validate(anyOrNull()))
                .thenReturn(true)
        Mockito.`when`(metadataRepository.getMetadata())
            .thenReturn(mapOf("data" to "true"))
    }

    @Test
    fun shouldGetMetadata() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/metadata")
                    .header("Authorization", "Bearer $mockToken")
            ).andExpect(
                MockMvcResultMatchers
                    .status()
                    .isOk()
            ).andExpect(
                MockMvcResultMatchers.content()
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(
                MockMvcResultMatchers
                    .jsonPath("$.data")
                    .value("true")
            )
    }
}
```

Sometimes some silver lining is needed (ex. a third party authentication) but
less mock in mocks is always good.

### Keep your mocks up to date

Finally, remember that the real application keeps evolving, so your mocks. It's
a necessity to combe back to your mocked data regularly to tidy things and keep
your mocks as real as possible.

## Conclusion

Mock integration tests remains something i still don't recommend, however the
scenarios we face on day to day modern development might forces us to compromise
and deliver good instead of excellent.

See you later and happy hacking!
