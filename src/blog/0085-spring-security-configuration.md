---
layout: blog-layout.pug
tags:
  - posts
  - java
  - spring-boot
  - spring-security
  - test
date: 2025-11-15
---
# Spring security, the easy way

Today we will discuss spring security. Like jakarta-ee, spring offers
convenient tools to easily enable identification and authorization in your
service.

## Key abstractions

For any minimal security strategy, you need to identify the user and list what
that user can do.

In jakarta-ee there is JAAS, with roles and principals to deal with.

In spring there are UserDetails and GrantedAuthority.

You **must** implement those and also implement a service able to get the user,
so spring-security can handle them.

In short, implement those:

- UserDetails
- GrantedAuthority
- UserDetailsService

The rest is just configuration.

## Dependencies

Simply add the starter:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Then create a new **@Configuration** for security:

```java
// package and imports
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
      return http
        // several config options
              .build();
    }
}
```

This is the minimal skeleton for the security filter.

As mentioned before, is up to you to bridge your application details and the
interfaces and service needed by spring security.

For example, let's say you have on your application domain a model called
`MyLogin`.

Either make `MyLogin` implement `UserDetails` directly (bad!) or create a DTO
implementing `UserDetails` and construct it from a `MyLogin` instance (good!):

```java
//
public UserDetailsDTO implements UserDetails {

  private final MyLogin login;

  public UserDetailsDTO(MyLogin login) {
    this.login = login;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    // return some lst full with GrantedAuthority implementations
    //return grants;
  }

  @Override
  public String getPassword() {
    // use your user model to provide a password 
    // return password;
  }

  @Override
  public String getUsername() {
    // use your model to provide an username
    // return username;
  }
}
```

## Session-based configurations

### Basic authentication

### Form authentication

### CSRF issues

## JWT based configurations

## Further readings
