---
title: 'Introduction and the Authorisation Server'
date: '2024-08-01'
tags: ['java', 'spring boot', 'spring security', 'oauth2']
images: ['/articles/distributed-chat-system/banner.png']
summary: 'An introduction to the chat system, including the design and implementation of its authorisation server.'
authors: ['mohamed-elmedany']
theme: 'blue'
serie: 'distributed-chat-system'
---

In this deep dive, we will explore my approach to implementing a chat system designed to be secure, distributed, and scalable. We will break down the technical challenges, decisions, and technologies involved in building this system

Whether you are interested in the fundamentals of distributed architecture or simply want to understand what goes into creating a high-performance chat application, this article series will guide you through the process in a friendly and engaging way.

So, let's dive in!

## Introduction

First, let's have a look at the desired end architecture.

![distributed-chat-system](/articles/distributed-chat-system/architecture.svg)

- **Authorisation Server:** Handles user registration, authentication and authorisation centrally, ensuring secure access to the system.
- **Chat API:** Provides the core chat functionalities, enabling users to send / receive messages, create and manage conversations.
- **Chat Web Client:** Offers a user-friendly interface through which users can interact with the chat system via web browsers.
- **Messaging Channel:** Enables the reliable and asynchronous exchange of messages between system components.
- **Websockets Server:** Provides real-time update functionalities to users by keeping track of online / offline users and push update when online.

Each of these components is a standalone service that can run independently. When we connect all the components, like pieces of a puzzle, we achieve the desired functionality.

In this first part, we'll focus on the initial component: **The Authorisation Server**.

## Authorisation Server

The Authorisation Server is the first component in our system, responsible for securing access to system resources using the OAuth 2.0 protocol. It handles the registration and authentication of user accounts and client applications, issues access and refresh tokens, and enforces access scopes. This ensures that only authorised parties can access and benefit from system resources. Let's break this down into specific functional requirements to better understand the functionality and ensure effective implementation and testing.

### Functional Requirements

- Token-based authentication using [opaque tokens](https://auth0.com/docs/secure/tokens/access-tokens#opaque-access-tokens)
- Client application registration, authentication and authorisation
- User account registration, authentication and authorisation

### Technologies

- Java 21
- Spring boot and Spring Data (3.3.2 the current latest release)
- Spring Security with OAuth 2.0 Authorization Server (6.3.1 the current latest release)
- Flyway
- Postgres
- Gradle

### Implementation

First, we will create an empty directory to serve as the root of our monorepo for all system components. Next, we will set up a separate directory specifically for the authorisation server.

Inside the authorisation server directory, we will create a `build.gradle` file and add the following dependencies:

```gradle
dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.passay:passay")

  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-authorization-server")

  implementation("org.springframework.boot:spring-boot-starter-data-jpa")

  annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")

  runtimeOnly("org.postgresql:postgresql")
  runtimeOnly("org.flywaydb:flyway-database-postgresql")
}
```

Next, we will add `AuthorizationServerConfiguration.java` and `SecurityConfiguration.java` to configure the security of our server:

```java
@Configuration
public class AuthorizationServerConfiguration {
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain authorizationSecurityFilterChain(HttpSecurity http, ApiAuthenticationProvider apiAuthenticationProvider) {
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);

        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                .tokenEndpoint(tokenEndpoint -> tokenEndpoint
                        .accessTokenRequestConverter(apiAuthenticationConverter())
                        .authenticationProvider(apiAuthenticationProvider));

        return http.build();
    }

    @Bean
    public ApiAuthenticationProvider apiAuthenticationProvider(UserDetailsService userDetailsService,
                                                               OAuth2TokenGenerator<?> tokenCustomizer,
                                                               OAuth2AuthorizationService authorizationService,
                                                               PasswordEncoder passwordEncoder) {
        return new ApiAuthenticationProvider(authorizationService, tokenCustomizer, userDetailsService, passwordEncoder);
    }

    @Bean
    public OAuth2AuthorizationService authorizationService(JdbcOperations jdbcOperations,
                                                           RegisteredClientRepository registeredClientRepository) {
        return new JdbcOAuth2AuthorizationService(jdbcOperations, registeredClientRepository);
    }

    @Bean
    public ApiAuthenticationConverter apiAuthenticationConverter() {
        return new ApiAuthenticationConverter();
    }

    @Bean
    public RegisteredClientRepository jdbcRegisteredClientRepository(JdbcTemplate jdbcTemplate) {
        return new JdbcRegisteredClientRepository(jdbcTemplate);
    }
}
```

Here, we configure the authorisation server's main `securityFilterChain` bean with the following:

- `apiAuthenticationProvider` bean, which is responsible for handling authentication for the defined grant type.
- `authorizationService` bean, which is used by the authorisation provider as the backing service for authorisation CRUD operations.
- `apiAuthenticationConverter` bean, which validates the required request parameters for our defined grant type.
- `jdbcRegisteredClientRepository` bean, which is used by authorization service for registered clients CRUD operations.

`RegisteredClient` represents an authorised client application registered with the authorisation server, such as the Chat API. It includes information about the client application, such as its credentials, authorisation grants, and redirect URIs.

Both `JdbcOAuth2AuthorizationService` and `JdbcRegisteredClientRepository` require an accessible datasource with a predefined schema to perform CRUD operations on authorisations and registered clients. We will define this setup in the application properties.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http,
                                                          ApiAuthenticationExceptionFilter apiAuthenticationExceptionFilter,
                                                          OpaqueTokenIntrospector tokenIntrospector) {
        return http.cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests.requestMatchers("/v1/**").hasAuthority("write")
                        .anyRequest().authenticated())
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(LogoutConfigurer::permitAll)
                .addFilterAfter(apiAuthenticationExceptionFilter, ExceptionTranslationFilter.class)
                .oauth2ResourceServer(oauth2ResourceServer -> oauth2ResourceServer
                        .opaqueToken(opaqueTokenConfigurer -> opaqueTokenConfigurer.introspector(tokenIntrospector)))
                .build();
    }

    @Bean
    public OpaqueTokenIntrospector tokenIntrospector(OAuth2AuthorizationService authorizationService) {
        return new TokenIntrospector(authorizationService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
```

Here, we configure the default `securityFilterChain` bean with the following:

- Require all requests to `/v1/**,` the exposed API in our authorisation server, to have `write` scope. This scope must be assigned to the client application making the requests.
- `apiAuthenticationExceptionFilter` bean, which handles authentication exceptions.
- `tokenIntrospector` bean, which make it possible to internally introspect and authenticate API calls to our authorisation server. In other words, the authorisation server also functions as a resource server.

Next, we add `TokenConfiguration.java` configuration for access and refresh token generation and customization:

```java
@Configuration
public class TokenConfiguration {
    @Bean
    public OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator(OAuth2TokenCustomizer<OAuth2TokenClaimsContext> accessTokenCustomizer) {
        OAuth2AccessTokenGenerator accessTokenGenerator = new OAuth2AccessTokenGenerator();
        accessTokenGenerator.setAccessTokenCustomizer(accessTokenCustomizer);
        OAuth2RefreshTokenGenerator refreshTokenGenerator = new OAuth2RefreshTokenGenerator();

        return new DelegatingOAuth2TokenGenerator(accessTokenGenerator, refreshTokenGenerator);
    }

    @Bean
    public OAuth2TokenCustomizer<OAuth2TokenClaimsContext> accessTokenCustomizer() {
        return context -> {
            UserDetails userDetails = extractUserDetails(context.getPrincipal());
            validateUsername(userDetails);

            context.getClaims()
                    .claim(CLAIMS_AUTHORITIES_KEY, getAuthorities(userDetails))
                    .claim(CLAIMS_USERNAME_KEY, userDetails.getUsername());
        };
    }
}
```

We need to add `UserDetailsServiceImpl.java`, which implements `UserDetailsService` to retrieve user accounts by username from the database:

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) {
        Optional<User> dbUser = userRepository.findByUsernameIgnoreCaseAndActive(username, true);

        return dbUser.map(u -> User.builder()
                        .username(u.getUsername())
                        .password(new String(u.getPassword()))
                        .authorities(getAuthorities(u.getRoles()))
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("No account found for given username."));
    }
}
```

Finally, we add `application.properties` file to define our server properties:

```properties
server.port=9000

spring.datasource.url=jdbc:postgresql://localhost:5432/<database_name>?stringtype=unspecified&serverTimezone=UTC
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.jdbc-url=${spring.datasource.url}
spring.datasource.hikari.username=postgres

spring.flyway.enabled=true
spring.flyway.user=postgres
spring.flyway.encoding=UTF-8
spring.flyway.locations=classpath:db/migrations
spring.flyway.schemas=public
spring.flyway.table=migrations_log
spring.flyway.baseline-on-migrate=true
spring.flyway.url=${spring.datasource.url}
```

Here, we define the server port, configure the Spring datasource, and set up Flyway for database migrations. If you're not familiar with database migrations, you can read more about them in [Flyway documentation](https://documentation.red-gate.com/fd/why-database-migrations-184127574.html).

In the [db/migrations](https://github.com/melmedany/buzzy/tree/main/buzzy-sso/src/main/resources/db/migrations) directory, we have the essential SQL migration scripts to initialise the required database tables. These scripts define the schema for `RegisteredClient` and `OAuth2Authorization`.

**This is the configuration required so far,** covering the **first functional requirement.** Next, we will address the remaining requirements, taking a methodical approach and ensuring each component is fully functional before moving on to the next.

### Account registration

**We can’t chat without having an account first, can we?** So, we need to register new accounts. For this, we will create an endpoint to receive requests, a service to process them, and a database to store the accounts. It might seem like a lot, but it’s just the standard setup for account CRUD operations.

Let’s start from the bottom up. First, we define our `users` database table:

```sql
CREATE TABLE IF NOT EXISTS users (
    id             UUID             PRIMARY KEY,
    username       VARCHAR(50)      UNIQUE NOT NULL,
    password       BYTEA            NOT NULL,
    firstname      VARCHAR(100),
    lastname       VARCHAR(100),
    active         BOOLEAN          NOT NULL ,
    created_at     TIMESTAMP        NOT NULL,
    updated_at     TIMESTAMP        NOT NULL
)
```

Next, we add `User.java` as the user entity class:

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = true)
    private String username;
    @Column(name = "password", columnDefinition = "bytea")
    private byte[] password;
    private String firstname;
    private String lastname;
    private boolean active;
    @CreationTimestamp
    private OffsetDateTime createdAt;
    @UpdateTimestamp
    private OffsetDateTime updatedAt;
}
```

**Note that passwords are defined as a byte array instead of a `String` object.** This improves security because `String` objects are immutable and remain in memory until garbage collection, making them vulnerable. Byte arrays can be cleared from memory immediately after use, reducing the risk of exposure. Additionally, once the password is validated, it will be encrypted, and no further string operations will be performed on it.

Next, we will add `UserRepository.java` interface, extending Spring's `JpaRepository`:

```java
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsernameIgnoreCaseAndActive(String username, boolean active);
}
```

And `RegistrationService.java`:

```java
@Service
public class RegistrationService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public RegistrationService(PasswordEncoder passwordEncoder, UserRepository userRepository, UserMapper userMapper) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public void createUser(SignupRequest signupRequest) {
        if (usernameExists(signupRequest.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists.");
        }

        User user = userMapper.toUser(signupRequest);
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()).getBytes(StandardCharsets.UTF_8));
        user.setActive(true);

        userRepository.save(user);
    }

    private boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}
```

Then `RegistrationController.java`:

```java
@RestController
@RequestMapping("/v1")
public class RegistrationController {
    private static final Logger LOGGER = LoggerFactory.getLogger(RegistrationController.class);

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping(value = "signup", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE})
    public ResponseEntity<APIResponse<Void>> signup(@Valid @RequestBody SignupRequest registrationRequest) {
        LOGGER.debug("Creating new user account");
        registrationService.createUser(signupRequest);
        return new ResponseEntity<>(APIResponse.emptyResponse(), HttpStatus.CREATED);
    }
}
```

Finally, we add `SignupRequest.java`, which contains the account details to be created:

```java
public class SignupRequest {
    @NotBlank(message = "firstname cannot be null or empty.")
    @Size(min = 3, max = 100, message = "firstname accepts only characters and it should be between 3 and 100 characters.")
    private String firstname;
    @NotBlank(message = "lastname cannot be null or empty.")
    @Size(min = 3, max = 100, message = "lastname accepts only characters and it should be between 3 and 100 characters.")
    private String lastname;
    @NotBlank(message = "username cannot be null or empty.")
    @Size(min = 3, max = 50, message = "username accepts only characters and it should be between 3 and 50 characters.")
    private String username;
    @NotBlank(message = "password cannot be null or empty.")
    @ValidPassword
    private String password;
}
```

Here, we use Spring validation to apply rules for valid account details. The `@NotBlank` and `@Size` annotations are provided by Spring, and I introduced `@ValidPassword` to enforce custom password rules using `Passay` library. You can find the defined rules in [PasswordConstraintsValidator.java](https://github.com/melmedany/buzzy/blob/main/buzzy-sso/src/main/java/io/buzzy/sso/registration/validation/PasswordConstraintsValidator.java).

Now that we have added the necessary classes, we are ready to start testing the registration functionality. Let’s start up the authorisation server and give it a go!

### SignUp

As we explained earlier, only registered clients can access our authorisation server via the grant flow. Otherwise, all requests will be rejected with an access denied exception. A signup request creates an account on the authorisation server, which will later be used to access the resource server. Therefore, it must be authorised and authenticated. To facilitate this, [V001\_\_init_registered_clients](https://github.com/melmedany/buzzy/blob/main/buzzy-sso/src/main/resources/db/migrations/V001__init_registered_clients.sql) migration script inserts a registered client into the database, available for us to use. This fulfils the **second functional requirement**, which we will verify in the later steps.

#### Test Case 1: Unauthorised client call

We will first try to create a new account with a valid request body and headers but leave out the `Authorization` header. What do you think we will get in response?

Correct, we can expect a `403 Forbidden` exception since we did not provide any authentication.

![signup-unauthenticated](/articles/distributed-chat-system/signup-unauthenticated.png)

#### Test Case 2: Obtain access token with client credentials grant flow

To avoid the exception we encountered in the first case, we need first to obtain an access token for the client application using the `client_credentials` grant flow, as we need to authenticate the client to call the API without involving any user account. We can do this by calling the `/oauth2/token` endpoint with `Authorization` header containing the client ID and secret, and setting `grant_type` to `client_credentials`.

![client-credentials-success.png](/articles/distributed-chat-system/client-credentials-success.png)

#### Test Case 3: Successful signup

We can now retry the same call as in the first test case, but with the correct `Authorization` header. This time, we will be able to successfully create a new user account.

![signup-success](/articles/distributed-chat-system/signup-success.png)

### Login

Now that we have covered account registration, we will use the newly created account to obtain an access token (i.e., login), which can later be used to access system resources. Unlike the `client_credentials` grant flow, this process involves the client application using the account credentials along with its own client ID and secret to first authenticate itself to the authorisation server and then obtain an access token for the account. This grant type is known as the `Resource Owner Password Credentials` or `ROPC` grant.

#### Test Case 1: Successful login

![login-success](/articles/distributed-chat-system/login-success.png)

The tokens can now be stored securely, preferably on the backend, and used to access system resources on behalf of the user. Note that the expiry date is also part of the response, so the client application knows in advance when the access token will no longer be valid

> **_Caution:_** According to the latest OAuth 2.0 Security Best Practices, using `ROPC` grant flow is discouraged due to the insecure exposure of passwords to the client application. However, we're using it here for simplicity. Be careful when using it in public-facing applications. [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics-19#section-2.4).

#### Test Case 2: Wrong credentials

To further test our implementation, we will make the same call again but with an invalid password. What do you think will happen?

Correct again! We will get a `401 Unauthorized` exception since the credentials, in this case, the password, are not valid.

![login-failure](/articles/distributed-chat-system/login-failure.png)

### Refresh Token

**The access token does not last forever, does it?** As we saw in the successful login case, it will eventually expire. That is why we issue a refresh token along with the access token. The refresh token can be used to obtain a new access token without requiring the user to log in again. This ensures continuous access to the system resources without frequent logins and reduces the load on the authorisation server from repeated authentication.

To refresh the access token, we need to call the `/oauth2/token` endpoint with `Authorization` header containing the client ID and secret. Set `grant_type` to `refresh_token` and provide the refresh token that we securely saved earlier.

![refresh-token-success](/articles/distributed-chat-system/refresh-token-success.png)

Here, we have invalidated both the old access and refresh tokens; only the new ones are valid. I trust you now know where to securely store the new values.

### Logout

Finally, we can manually revoke the access token (i.e., logout) when needed. This will invalidate the access token, ensuring it can no longer be used even before its expiry date. To do this, we need to call the `/oauth2/revoke` endpoint with the `Authorization` header containing the client ID and secret, and the token parameter with the value of the token to be invalidated.

![revoke-token-success](/articles/distributed-chat-system/revoke-token-success.png)

With that complete, we have covered the basics of the functional requirements and tested our implementation to ensure it works as expected.

### Source Code & Examples

Some code snippets are intentionally omitted to keep this article concise. Additionally, there are further enhancements and features not covered here. The complete source code and the latest implementation, can be found at this [GitHub](https://github.com/melmedany/buzzy/) repository.

## Conclusion

**We have covered the first component of the system:** configuring and using an authorisation server to manage authentication, authorisation, and registration with the help of the Spring Framework. This setup can be extended to incorporate more complex or custom functionalities based on specific use cases or business requirements.

In the next part, we will dive into post-account registration actions, the messaging channel, and the Chat API. Stay tuned!

### References

- [Spring Authorization Server](https://docs.spring.io/spring-authorization-server/reference/getting-started.html)
- [SpringBoot - Flyway database migrations](https://docs.spring.io/spring-boot/docs/2.0.0.M5/reference/html/howto-database-initialization.html#howto-execute-flyway-database-migrations-on-startup)
- [The Passay API](https://www.passay.org/reference/)
- [Client Credentials Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)
