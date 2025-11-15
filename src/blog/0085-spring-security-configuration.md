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

For the `UserDetailsService`, it's a quite simple interface: given a *username*,
return the proper `UserDetails`.

Since you need to implement it based on your own domain, you can compose with
the service responsible to get `MyLogin` instances, something like this:

```java
//
@Service
public class MyLoginUserDetailsService implements UserDetailsService {

  private final MyLoginRepository repository;

  public MyLoginUserDetailsService(MyLoginRepository repository){
    this.repository = repository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // create a custom call on your repository to return MyLogin by username
    // Optional<MyLogin> getByLogin(String login);
    return repository
            .getByLogin(username)
            .map(UserDetailsDTO::new)
            .orElseThrow(() -> new UsernameNotFoundException(username));
  }
}
```

And spring security will identify and use your bean *automagically*.

On the other hand, such simple interface could be functional. Another good
(maybe better) way to do it is directly in a configuration:

```java
// 
@Configuration
public class AuthConfig {
  
  @Bean
  public UserDetailsService userDetailsService(MyLoginRepository repository) {
    return username -> {
      // create a custom call on your repository to return MyLogin by username
      // Optional<MyLogin> getByLogin(String login);
      return repository
              .getByLogin(username)
              .map(UserDetailsDTO::new)
              .orElseThrow(() -> new UsernameNotFoundException(username));
    };
  }
}
```

To set things up to a minimal working configuration, provide a `PasswordEncoder`
so the base spring security configuration will know how to challenge passwords
from login attempts.

This part is easy, simply provide a `BCryptPasswordEncoder` bean in a
configuration. It comes bundled with spring security:

```java
// 
@Configuration
public class AuthConfig {

  // other auth-related beans...

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
```

And *voilá*, the basic configuration, which does nothing yet.

But we need to talk about *session* and *sessionless* authentication now.

## Session-based configurations

Session-based authentication means that the server *remembers* the user. While
HTTP itself is a stateless protocol, it's possible to keep track of returning
users, thanks to the magic of headers and cookies.

Therefore, it's possible to keep a persistent conversation with users.

### Basic authentication

Most basic of auth configuration, all you need to set it up is to use this
security filter:

```java
// ...
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
                .httpBasic(withDefaults())
                .build();
    }
}
```

This is enough to allow free navigation except for paths/resources in need of an
authenticated user.

Take this controller as example:

```java
// ...
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoCtl {

    @GetMapping
    public String index() {
        return "Hello, stranger!";
    }

    @GetMapping("protected")
    public String authenticated(@AuthenticationPrincipal UserDetails userDetails) {
        return String.format( "Hello, %s!", userDetails.getUsername());
    }

    @GetMapping("admin")
    @PreAuthorize("hasAuthority('ADM')")
    public String admin(@AuthenticationPrincipal UserDetails userDetails) {
        return String.format( "Hello, admin %s!", userDetails.getUsername());
    }
}
```

By visiting <http://localhost:8080/>, you get properly greeted.

But visiting <http://localhost:8080/protected> or <http://localhost:8080/admin>,
authentication popup will ask for credentials.

Visit <http://localhost:8080/admin> will only be allowed if the user has the
proper granted authority in its list of grants.

You might end up with an internal server error when visiting first '/' and later
'/protected', since we did no special configuration in the security filter.

To fix this, enforce better security rules:

```java
// ...

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) {
    return http
      .httpBasic(withDefaults())
      .authorizeHttpRequests(authorizeRequests ->
        authorizeRequests
          .requestMatchers("/")
          .permitAll()
          .anyRequest()
          .authenticated())
      .build();
  }
}
```

That way you can list in `requestMatchers` a list of unprotected paths.

### Form authentication

Form authentication is easy to configure too. It offers some extra options when
compared to basic authentication, but the defaults are good enough to get
started quickly.

Sporing security configuration goes like this is order to use login form:

```java
// ...

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) {
    return http
      .formLogin(withDefaults())
      .authorizeHttpRequests(authorizeRequests ->
        authorizeRequests
          .requestMatchers("/")
          .permitAll()
          .anyRequest()
          .authenticated())
      .build();
  }
}
```

### CSRF issues

A quick note in case you host the client application along with the service: if
your app users fetch or ajax requests, you will need to disable the
**cross site request forgery** protection. This is also quite easy:

```java
// ...

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) {
    return http
      .csrf(AbstractHttpConfigurer::disable)
      .formLogin(withDefaults())
      .authorizeHttpRequests(authorizeRequests ->
        authorizeRequests
          .requestMatchers("/")
          .permitAll()
          .anyRequest()
          .authenticated())
      .build();
  }
}
```

## JWT based (sessionless) configuration

Another approach on security, quite popular along rich client applications, is
sessionless tokens.

The most popular on this field is (**Json Web Token**, or simply JWT.

## Testing security

## Further readings
