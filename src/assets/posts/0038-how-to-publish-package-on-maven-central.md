# How to publish a maven package on maven central

In a previous article we published a maven package on github registry. It it
quite ok but the drawback is the dependency on a custom settings.xml file as
seen.

Instead of rely on this, we can publish the package directly on maven central,
making it available not only to our personal projects, but also to anyone
interested on it with mucho ease.

## Legal notes

Maven central provides open source libraries, so **DO NOT** publish that
sensitive code from your company.

Make sure your library will be released under a proper open source license.

## General steps

In order to get your package published, you will need:

- A sonatye jira account
- A proper configured pom.xml and settings.xml
- A gpg key to sign your package artifacts

## The sonatype acount

First things first, [read this guide](https://central.sonatype.org/publish/publish-guide/).

## The pom.xml and settings.xml

Your project must be prepared to deploy the package.

Usually a maven project declare a few coordinates and dependencies:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>sample.project</groupId>
  <artifactId>sample-project</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>sample-project</name>
  <url>http://www.example.com</url>

  <properties>
    <!-- some properties -->
  </properties>

  <dependencies>
    <!-- some dependencies -->
  </dependencies>

</project>
```

But in order to publish it on maven central, it should look more like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>sample.project</groupId>
    <artifactId>sample-project</artifactId>
    <version>1.0-SNAPSHOT</version>

    <name>sample-project</name>
    <url>http://www.example.com</url>

    <properties>
        <!-- some properties -->
    </properties>

    <dependencies>
       <!-- some dependencies -->
    </dependencies>

    <build>
        <plugins>
            <!-- must have source, javadoc and gpg plugins -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>3.2.1</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>3.3.0</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>3.0.1</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <licenses>
        <!-- at least one license -->
    </licenses>

    <scm>
        <!-- url tag with git url -->
    </scm>

    <developers>
        <developer>
            <!-- developer info -->
        </developer>
    </developers>

    <distributionManagement>
        <repository>
            <id>s01-sonatype</id>
            <name>maven central</name>
            <url>https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        </repository>
    </distributionManagement>
</project>
```

Sources, javadoc and signatures are mandatory for packages being published on
maven central, so simply put it on your pom.

The distribution management is needed so you can publish 
[staging versions](https://help.sonatype.com/repomanager2/staging-releases/configuring-the-staging-suite)
of your package which can be promoted to release later.

Please note that in order to publish your library, you'll also need to
authenticate into the sonatype server. The easiest way to do that is configuring
your [jira sonatype credentials](https://central.sonatype.org/publish/publish-guide/#create-a-ticket-with-sonatype)
under a custom settings.xml like this one:

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd">
    <servers>
        <server>
            <id>s01-sonatype</id>
            <username>${username}</username>
            <password>${password}</password>
        </server>
    </servers>
</settings>
```

Either put this file under your $HOME/.m2 folder or point to it when runing
maven from command line. You also can hardcode your credentials. If you dare :-) 

## The gpg signature

Under linux, you can create a signature key easily with those commands:

```bash
$ gpg --generate-key
gpg (GnuPG) 2.3.8; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Note: Use "gpg --full-generate-key" for a full featured key generation dialog.

GnuPG needs to construct a user ID to identify your key.

Nome completo: my name
Endereço de correio eletrónico: my@name
Você selecionou este identificador de utilizador:
    "my name <my@name>"

Change (N)ame, (E)mail, or (O)kay/(Q)uit? o
gpg: revocation certificate stored as '/home/sombriks/.gnupg/openpgp-revocs.d/8F02F5AD97DA51D426235889668D1F5CA610FD70.rev'
chaves pública e privada criadas e assinadas.

pub   ed25519 2022-12-31 [SC] [expires: 2024-12-30]
      8F02F5AD97DA51D426235889668D1F5CA610FD70
uid                      my name <my@name>
sub   cv25519 2022-12-31 [E] [expires: 2024-12-30]
```

Please use a valid email.

By default maven will use te default key to sign things, so if you are creating
the key for the first time, this one will be the default key.

Once you create the key, you must publish it into a verification service. The
command to do that is quite easy to use too:

```bash
$ gpg --export my@name | curl -T - https://keys.openpgp.org
Key successfully uploaded. Proceed with verification here:
https://keys.openpgp.org/upload/TmyI2ZERAhexdHxghzzHufu5u9m3e36vTecjjv83CiRscG9QENfptVj1Q8TIks4cO_wGUkgZNZEw2OLiha1MSaYIFr9SIFxfdYA3qGw-FLPLb76KxWt0ks0N2Wk-kEWar-1QP7XoSPdYC468HgUumM8DaczGH1s3d6uFihbwRu55q7WOcGgLBLjwUPeEZekGMuU8jnny
```

Then open the provided link and validate your key:

![validate key](/post-pics/0038-how-to-publish-package-on-maven-central/validating-gpg-key.png)

Make sure to create and safely store a backup for your signature. Guard the
.gnupg folder with care!

## Signing and deploying

From command line, using this approach to set up everything, all you need to do
in order to deploy yur staging library is this command:

```bash
mvn verify deploy -s settings.xml -Dusername=<your-sonatype-username> -Dpassword=<your-sonatype-password> -Dgpg.passphrase=<your-gpg-password>
```

This command builds all artifacts, sign them and uploads everything to the
staging phase of this process.

Once successfull, login into [nexus](https://s01.oss.sonatype.org/#stagingRepositories)
and proceed with [closing and promoting the library](https://help.sonatype.com/repomanager2/staging-releases/managing-staging-repositories):

![staging repositories](/post-pics/0038-how-to-publish-package-on-maven-central/staging-repositories.png)

## Further steps

With this guide you will be able to publish you library into maven central from
your development environment. 

In the future let's setup a github action or something like that to automate it.

You can see the source code of the sample package [here](https://github.com/sombriks/simple-java-run-cmd).

2022-12-31