---
layout: base.webc
tags: 
  - posts
  - java
  - spring-boot
  - datasource configuration
date: 2022-11-20
---
# How to configure two databases on spring-boot

Set up one database on spring boot is practically automatic. All you need to do
is to provide some `spring.datasource` keys in`application.properties` file:

```ini
# application.properties
spring.datasource.url=jdbc:hsqldb:file:./myDb.hsqldb
spring.datasource.driverClassName=org.hsqldb.jdbc.JDBCDriver
spring.datasource.username=sa
spring.datasource.password=hsqldb-password
```

And you're done.

However, if you need, for some reason, a second datasource, well, configuration
isn't automatic anymore.

## Explicit configuration

In order to spring-boot be able to offer all it's commodities to the developer,
the following configuration must be provided:

- DataSource
  - DataSourceProperties
- EntityManagerFactory
  - JpaProperties
- TransactionManager

If you're going to offer more than one data source then you must provide  these
explicit configurations to each one.

Also, you **must** point out which one will be the `@Primary` data source.

## Sample properties file

Take the following application properties file as example:

```ini
# application.properties

# h2 configuration
spring.datasource.h2.url=jdbc:h2:file:./testdb.h2
spring.datasource.h2.driverClassName=org.h2.Driver
spring.datasource.h2.username=sa
spring.datasource.h2.password=h2-password
jpa.properties.h2.hibernate.hbm2ddl.auto=create-drop
jpa.properties.h2.hibernate.hbm2ddl.import_files=db/script.h2.sql

# hsqldb configuration
spring.datasource.hsqldb.url=jdbc:hsqldb:file:./myDb.hsqldb
spring.datasource.hsqldb.driverClassName=org.hsqldb.jdbc.JDBCDriver
spring.datasource.hsqldb.username=sa
spring.datasource.hsqldb.password=hsqldb-password
jpa.properties.hsqldb.hibernate.hbm2ddl.auto=create-drop
jpa.properties.hsqldb.hibernate.hbm2ddl.import_files=db/script.hsqldb.sql

```

First we slightly change properties names so the configurations doesn't clash on
each other.

Then we create the needed `@Configuration` classes to create the beans for each
configuration

## The spring configuration for primary database

```java
package sample.spring.multipledatabases.configuration;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
// need '--add-modules java.sql' in compiler options starting from java 11
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "hsqldbEntityManagerFactory",
        transactionManagerRef = "hsqldbTransactionManager",
        basePackages = {"sample.spring.multipledatabases.repository.hsqldb"})
public class HsqldbDatasourceConfiguration {

    @Bean
    @ConfigurationProperties("spring.datasource.hsqldb")
    public DataSourceProperties hsqldbDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource hsqldbDataSource(
            @Qualifier("hsqldbDataSourceProperties") DataSourceProperties properties
    ) {
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class).build();
    }

    @Bean
    @ConfigurationProperties("jpa.properties.hsqldb")
    public Map<String, String> hsqlJpaProperties() {
        return new HashMap<>();
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean hsqldbEntityManagerFactory(
            EntityManagerFactoryBuilder entityManagerFactoryBuilder,
            @Qualifier("hsqldbDataSource") DataSource dataSource,
            @Qualifier("hsqlJpaProperties") Map<String, String> jpaProperties
    ) {
        return entityManagerFactoryBuilder
                .dataSource(dataSource)
                .packages("sample.spring.multipledatabases.model.hsqldb")
                .persistenceUnit("hsqldbPersistenceUnit")
                .properties(jpaProperties)
                .build();
    }

    @Bean
    @Primary
    public PlatformTransactionManager hsqldbTransactionManager(
            @Qualifier("hsqldbEntityManagerFactory") EntityManagerFactory entityManagerFactory
    ) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

```

The configuration for other databases will be quite the same, except for one
detail: other configs must NOT use the `@Primary` stereotype for the configured
beans.

Other highlights:

- you must indicate distinct packages for models and repositories between
  database configurations (i.e. `sample.spring.multipledatabases.model.hsqldb`
  is a package meant to point into hsqldb models and `sample.spring.multipledatabases.model.h2`
  will house models from h2 database). similar behavior for spring repositories.
- for general database configurations there is a official spring boot bean named
  `DataSourceProperties`. in our configuration all we need to do is to annotate
  the factory method with `@ConfigurationProperties` passing our custom (not so
  custom) properties prefix (_spring.datasource.hsqldb_) and all needed info will
  appear automatically on it
- for JPA properties it isn't that easy but not hard either. JPA properties are
  quite distinct (hibernate properties, plain jpa properties, eclipselink maybe)
  so the prefix chosen was _jpa.properties_. For instance, when declaring in the
  properties file something like **jpa.properties.hsqldb.hibernate.hbm2ddl.auto=create-drop**,
  we are in fact configuring the [hibernate.hbm2ddl.auto](https://vladmihalcea.com/hibernate-hbm2ddl-auto-schema/)
  hibernate property for hsqldb. Which name choose for the custom property is
  pretty much up to you, but don't get too much creative, ;-)

## Conclusion

This article shows how to set two databases, but it will work for as much
databases as you need, as long as you point out which one will be the primary.

For more details, [se the complete source code here](https://github.com/sombriks/sample-spring-multiple-databases)
