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
'/protected', since you did no special configuration in the security filter.

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
          .requestMatchers("/") // the index is free to access
          .permitAll()
          .anyRequest()
          .authenticated()) // demands previous authentication
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

Check the [login form docs][login-form] for further login form options.

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

The most popular on this field is (**Json Web Token**, or simply **JWT**.

To enable it on your spring boot service, add this dependency first:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

Then you need to provide at a `JwtDecoder` and some extra bits, depending on how
your JWT workflow will work.

Since there is no session, the service is unaware if that user is a returning
one, or even if it's a trusted one.

To be precise, you deal with `JWT` instead of `UserDetails` or
`UserDetailsService`.

`JWT` are signed. The service must have the ability to verify that signature.

To proper provision a `JwtDecoder`, you also must, somehow, provide a
`PublicKey`.

Not necessarily the service itself is responsible to authenticate users, i.e.
the service can delegate the production of signed tokens for a dedicated
authentication server.

That said, for the sake of simplicity of this example, the token encoding will
also be sampled here.

First things first, configure The `JwtEncoder`, `JwtDecoder` and a `KeyPair`:

```java
//
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
public class JwtConfig {

    @Bean
    public KeyPair keyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        return keyGen.genKeyPair();
    }

    @Bean
    public JwtDecoder jwtDecoder(KeyPair keyPair) {
        RSAPublicKey pubKey = (RSAPublicKey) keyPair.getPublic();
        return NimbusJwtDecoder.withPublicKey(pubKey).build();
    }

    @Bean
    public JwtEncoder jwtEncoder(KeyPair keyPair) {
        RSAPublicKey pubKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privKey = (RSAPrivateKey) keyPair.getPrivate();
        JWK jwk = new RSAKey.Builder(pubKey).privateKey(privKey).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }
}
```

The `KeyPair` always has a `PublicJey` and a `PrivateKey`. while the decoder
just needs the public one, the encoder needs both keys.

Once you configured the decoder, you can now configure the security filter to
look for the jwt token:

```java
//
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtDecoder jwtDecoder) {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.decoder(jwtDecoder)))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .build();
    }
}
```

Now the security filter will look for a **Bearer** in **Authentication** header,
decode it and offer a `JWT` instead of an `UserDetails` implementation.

### Performing 'login'

As mentioned before, create signed tokens not necessarily is done in the same
service using them for authentication purposes.

But here goes an example.

First, you provide the service able to handle logins:

```java
//...
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private final JwtEncoder jwtEncoder;
    private final PasswordEncoder passwordEncoder;
    private final MyLoginRepository myLoginRepository;

    public AuthService(
            MyLoginRepository myLoginRepository,
            PasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder) {
        this.myLoginRepository = myLoginRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
    }

    public String getToken(LoginDTO login) {
        // recover user and check if authentication matches
        MyLogin user = myLoginRepository
                .getByLogin(login.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(login.getUsername()));
        if (!passwordEncoder.matches(login.getPassword(), user.getPassword()))
            throw new UsernameNotFoundException(login.getUsername() + " not found");

        // now prepare to build the token
        Instant now = Instant.now();
        Instant exp = now.plus(1, ChronoUnit.DAYS);
        // mount scopes from GrantedAuthorities
        // a frontend app could make use of them
        String scope = user.getPerms()
                .replaceAll(";", " ");
        // JWT claims
        JwtClaimsSet claims = JwtClaimsSet
                .builder()
                .issuedAt(now)
                .expiresAt(exp)
                .issuer("example issuer")
                .subject(user.getEmail())
                .claim("scope", scope)
                .build();
        // finally return the token
        return jwtEncoder
                .encode(JwtEncoderParameters.from(claims))
                .getTokenValue();
    }
}
```

Now you provide a simple endpoint to create the tokens from a pretty standard
post request:

```java
//...
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthCtl {

    private final AuthService authService;
    
    public AuthCtl(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping
    public String auth(@RequestBody LoginDTO login) {
        return authService.getToken(login);
    }
}
```

And since you're serving this endpoint for login attempts, add it to the list of
permitted requests in `SecurityConfig`:

```java
//...
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtDecoder jwtDecoder) {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.decoder(jwtDecoder)))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/","/auth") // added auth here 
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .build();
    }
}
```

One more thing, since you are dealing with `JWT` now, you must change the
authentication object injected in the controllers using `UserDetails`.

In fact, using sessionless authentication means you don't need `UserDetails` and
`UserDetailsService` anymore:

```java
//...
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoCtl {

    @GetMapping
    public String index() {
        return "Hello, stranger!";
    }

    @GetMapping("protected")
    public String authenticated(@AuthenticationPrincipal Jwt principal) {
        return String.format("Hello, %s!", principal.getSubject());
    }

    @GetMapping("admin")
    @PreAuthorize("authentication.principal.claims['scope'].contains('ADM')")
    public String admin(@AuthenticationPrincipal Jwt principal) {
        return String.format("Hello, admin %s!", principal.getSubject());
    }
}
```

And that's it, you can use your JWT security without any further configuration.

## Testing security

Adding security is just one part of the issue you have to deal.

You also must test it, so you can trust the code a little more.

In order to proper test such secure requests, you can use `TestRestTemplate`:

```java
//...
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DemoApplicationTests {

    @Autowired
    TestRestTemplate restTemplate;

    @Test
    void shouldGetHelloStranger() {
        var result = restTemplate
                .getForObject("/", String.class);
        assertThat(result, notNullValue());
        assertThat(result, containsStringIgnoringCase("hello, stranger!"));
    }

    @Test
    void shouldGetHelloUser() {
        var result = restTemplate
                .withBasicAuth("bobby@tables.net", "password")
                .getForObject("/protected", String.class);
        assertThat(result, notNullValue());
        assertThat(result, containsStringIgnoringCase("hello, bobby@tables.net!"));
    }

    @Test
    void shouldGetHelloAdmin() {
        var result = restTemplate
                .withBasicAuth("root@root.com", "password")
                .getForObject("/admin", String.class);
        assertThat(result, notNullValue());
        assertThat(result, containsStringIgnoringCase("hello, admin root@root.com!"));
    }

    @Test
    void shouldNotGetHelloUser() {
        var result = restTemplate
                .getForEntity("/protected", String.class);
        assertThat(result, notNullValue());
        assertThat(result.getStatusCode().is4xxClientError(), is(true));
    }

    @Test
    void shouldNotGetHelloAdmin() {
        var result = restTemplate
                .withBasicAuth("bobby@tables.net", "password")
                .getForEntity("/admin", String.class);
        assertThat(result, notNullValue());
        assertThat(result.getStatusCode().is4xxClientError(), is(true));
    }
}
```

Te test above can be used to test the **basic auth** configuration.
For tis kind of authentication, `TestRestTemplate` offers the `withBasicAuth`
method.

To test JWT based authentication, you need to provide a valid token for each new
request. The easiest way to do that is to perform a login first:

```java
//...
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DemoApplicationTests {

    @Autowired
    TestRestTemplate restTemplate;

    @Test
    void shouldGetHelloStranger() {
        var result = restTemplate.getForObject("/", String.class);
        assertThat(result, notNullValue());
        assertThat(result, containsStringIgnoringCase("hello, stranger!"));
    }

    @Test
    void shouldGetHelloUser() {
        HttpHeaders headers = login("bobby@tables.net", "password");
        var result = restTemplate.exchange("/protected", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);
        assertThat(result, notNullValue());
        assertThat(result.getStatusCode().is2xxSuccessful(), is(true));
        assertThat(result.getBody(), containsStringIgnoringCase("hello, bobby@tables.net!"));
    }

    @Test
    void shouldGetHelloAdmin() {
        HttpHeaders headers = login("root@root.com", "password");
        var result = restTemplate.exchange("/admin", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);
        assertThat(result, notNullValue());
        assertThat(result.getStatusCode().is2xxSuccessful(), is(true));
        assertThat(result.getBody(), containsStringIgnoringCase("hello, admin root@root.com!"));
    }

    @Test
    void shouldNotGetHelloUser() {
        HttpHeaders headers = new HttpHeaders();
        var result = restTemplate.exchange("/protected", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);
        assertThat(result, notNullValue());
        assertThat(result.getStatusCode().is4xxClientError(), is(true));
    }

    @Test
    void shouldNotGetHelloAdmin() {
        HttpHeaders headers = login("bobby@tables.net", "password");
        var result = restTemplate.exchange("/admin", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);
        assertThat(result, notNullValue());
        assertThat(result.getStatusCode().is4xxClientError(), is(true));
    }

    private HttpHeaders login(String username, String password) {
        var token = restTemplate.postForObject("/auth", new LoginDTO(username, password), String.class);
        var headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        return headers;
    }
}
```

Instead of use regular `getForObject` calls, you need to use `exchange` instead.

And the form-login based security can be tested using a `TestRestTemplate` able
to manage cookies.

Tests can be further inspected in the [sample code project][repo].

Happy hacking!

[login-form]: https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html
[repo]: https://github.com/sombriks/spring-security-demo
