---
layout: blog.pug
tags:
  - posts
  - nginx
  - certbot
  - letsencrypt
  - cockpit
  - reverse proxy
date: 2023-04-06
---
# nginx reverse proxy on fedora 37 with let's encrypt ssl certificate

This is the thing that you google fiercely during one or two hours and find the
solution.

Hopefully this guide might help you to do that in half hour, ;-)

## TL;DR

- register your domain
- configure it with dns from your cloud provider
- configure the domain and subdomains into your cloud provider zone
- spin up a fedora 37 machine
- install nginx (`sudo dnf install nginx`)
- `sudo dnf install python3-certbot-nginx`
- configure reverse proxies sections on nginx.conf for domain and subdomains
- call certbot (`certbot --nginx --redirect -d mydomain.cc -d sub1.mydomain.cc -d sub2.mydomain.cc -m your@email.com --agree-tos`)
- `sudo setsebool -P httpd_can_network_connect 1`

## Buy some domains

[Just](https://godaddy.com)
[buy](https://www.dreamhost.com/domains/)
[something](https://registro.br/).

## Hand them to your cloud provider

Most services that sells domains also tries to sell you hosting, email, online
shops, things like that.

Other providers like
[aws](https://aws.amazon.com/pt/console/),
[digital ocean](https://cloud.digitalocean.com/),
[gcp](https://console.developers.google.com/),
[oci](https://cloud.oracle.com/),
[ibm cloud](https://cloud.ibm.com/),
[red hat](https://cloud.redhat.com)
[and](https://console.scaleway.com)
[others](https://portal.azure.com)
offer a wider range of products to use along those domain names.

The drill is the same on almost every case:

- buy domain on registrars
- set cloud provider dns name servers on them
- go back to cloud provider and configure a zone
- point domain and subdomains to as many services as you want (to pay for!)

And yes, you can create as many subdomains you wish!

To our example let's pretend we bought `mydomain.cc` and we'll use two
subdomains: `sub1.mydomain.cc` and `sub2.mydomain.cc`.

## Spin up a machine

Just install fedora 37, create a user and make him a sudoer:

```bash
adduser myuser
usermod -a -G wheel myuser
# don't forget to create a password for this guy!
passwd myuser
```

Use that user for now on.

Most cloud providers has some sort of console available to access newly created
machines, others ask you for an ssh key, and you get root access when using it.

## Installing and configuring nginx

Now the fun starts.

```bash
sudo dnf install nginx
sudo dnf install python3-certbot-nginx # more details later
```

It gives you a shiny new nginx acting as a server with a config at
`/etc/nginx/nginx.conf` which looks like this (comments removed for readability:

```bash
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include            mime.types;
    default_type       application/octet-stream;
    sendfile           on;
    keepalive_timeout  65;
    
    server {
        listen         80;
        server_name    localhost;
    
        location / {
            root       html;
            index      index.html index.htm;
        }
    
        error_page     500 502 503 504  /50x.html;
    
        location = /50x.html {
            root       html;
        }
    }
}
```

You need to add your reverse proxy configuration on that file.

Nginx allows much cleaner configurations using `/etc/nginx/conf.d` and
`/etc/nginx/default.d` directories, but the certbot plugin will fail if it
doesn't find the reverse proxy configurations for your domains and subdomains.

So you'll need to do something like this (again comments removed):

```bash
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include            mime.types;
    default_type       application/octet-stream;
    sendfile           on;
    keepalive_timeout  65;
    
    server {
        listen         80;
        server_name    localhost;
    
        location / {
            root       html;
            index      index.html index.htm;
        }
    
        error_page     500 502 503 504  /50x.html;
    
        location = /50x.html {
            root       html;
        }
    }
    
    server {
      listen                   80;
      server_name              mydomain.cc;
  
        location / {
            proxy_pass         http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_buffering    off;
            gzip               off;
        }
    }
    
    server {
      listen                   80;
      server_name              sub1.mydomain.cc;
  
        location / {
            proxy_pass         http://127.0.0.1:8080;
            proxy_http_version 1.1;
            proxy_buffering    off;
            gzip               off;
        }
    }
    
    server {
      listen                   80;
      server_name              sub2.mydomain.cc;
  
        location / {
            proxy_pass         http://127.0.0.1:9090;
            proxy_http_version 1.1;
            proxy_buffering    off;
            gzip               off;
        }
    }
}
```

In this configuration, nginx will proxy external requests from your domains and
subdomains to some internal services.

Now we're good to call certbot. register your domains:

```bash
sudo certbot --nginx --redirect -d mydomain.cc -d sub1.mydomain.cc -d sub2.mydomain.cc -m my@email.com --agree-tos
```

That should be enough.

If you hit some error, try to install the certs one by one:

```bash
sudo certbot install -v --cert-name mydomain.cc
sudo certbot install -v --cert-name sub1.mydomain.cc
sudo certbot install -v --cert-name sub2.mydomain.cc
```

If you are unsure if you have any certs at all, see them with this command:

```bash
sudo certbot certificates
```

After installing the certs, the nginx.conf file will look like this:

```bash
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include            mime.types;
    default_type       application/octet-stream;
    sendfile           on;
    keepalive_timeout  65;
    
    server {
        listen         80;
        server_name    localhost;
    
        location / {
            root       html;
            index      index.html index.htm;
        }
    
        error_page     500 502 503 504  /50x.html;
    
        location = /50x.html {
            root       html;
        }
    }
    
    server {
      listen                   80;
      server_name              mydomain.cc;
  
        location / {
            proxy_pass         http://127.0.0.1:3000;
            proxy_set_header   Host $host;
            proxy_set_header   X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_buffering    off;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
            gzip               off;
        }
        
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/mydomain.cc/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/mydomain.cc/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    }
    
    server {
      listen                   80;
      server_name              sub1.mydomain.cc;
  
        location / {
            proxy_pass         http://127.0.0.1:8080;
            proxy_set_header   Host $host;
            proxy_set_header   X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_buffering    off;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
            gzip               off;
        }
        
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/sub1.mydomain.cc/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/sub1.mydomain.cc/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    }
    
    server {
      listen                   80;
      server_name              sub2.mydomain.cc;
  
        location / {
            proxy_pass         http://127.0.0.1:9090;
            proxy_set_header   Host $host;
            proxy_set_header   X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_buffering    off;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
            gzip               off;
        }
        
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/sub2.mydomain.cc/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/sub2.mydomain.cc/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    }
    
    server {
      if ($host = mydomain.cc) {
          return 301 https://$host$request_uri;
      } # managed by Certbot
  
      listen         80;

      server_name    mydomain.cc;
      return 404; # managed by Certbot
    }
    
    server {
      if ($host = sub1.mydomain.cc) {
          return 301 https://$host$request_uri;
      } # managed by Certbot
  
      listen         80;

      server_name    sub1.mydomain.cc;
      return 404; # managed by Certbot
    }
    
    server {
      if ($host = sub2.mydomain.cc) {
          return 301 https://$host$request_uri;
      } # managed by Certbot
  
      listen         80;

      server_name    sub2.mydomain.cc;
      return 404; # managed by Certbot
    }
}
```

That should be fine to restart your nginx service:

```bash
sudo systemctl restart nginx.service
```

## Sampling an app: cockpit

Cockpit is a tool to remotely manage your server and is very honest and good
enough for day-to-day tasks.

You can install it this way:

```bash
sudo dnf install cockpit cockpit-system cockpit-storaged cockpit-podman cockpit-packagekit
```

In order to make cockpit behave with nginx, add this config into
`/etc/cockpit/cockpit.conf`:

```bash
[WebService]
Origins = https://sub2.mydomain.cc wss://sub2.mydomain.cc http://127.0.0.1:9090 ws://127.0.0.1:9090
ProtocolHeader = X-Forwarded-Proto
AllowUnencrypted = true

[Log]
Fatal = /var/log/cockpit.log

[Session]
IdleTimeout = 15
```

Now enable it:

```bash
sudo systemctl enable --now cockpit.socket
```

You might run into permission denied issues thanks to selinux:

```bash
2023/04/06 19:01:14 [crit] 4973#4973: *1 connect() to 127.0.0.1:9090 failed (13: Permission denied) while connecting to upstream, client: xxx.xx.xxx.xx, server: sub2.mydomain.cc, request: "GET /favicon.ico HTTP/1.1", upstream: "http://127.0.0.1:9090/favicon.ico", host: "sub2.mydomain.cc", referrer: "http://sub2.mydomain.cc/"
```

In order to resolve that, simply hit this command:

```bash
sudo setsebool -P httpd_can_network_connect 1
```

Now cockpit is supposed to attend on `https://sub2.mydomain.cc`, you can spin up
a firewall and close everything but 80 and 443 now. All you need is cockpit.

## Conclusion

It's still nice to see that foundation ops technologies still viable and working
with little to zero vendor lock-in.

Modern cloud providers gives us more and more nice toys which on one hand makes
us totally forget about tooling and infrastructure, like
[Digital ocean apps](https://www.digitalocean.com/pricing/app-platform),
[Google App Engine](https://cloud.google.com/appengine),
[Amazon Lightsail](https://aws.amazon.com/lightsail/pricing),
[Heroku](https://www.heroku.com/pricing),
[IBM Code Engine](https://cloud.ibm.com/codeengine/overview)
and so on, but in contrast makes our lives harder if we need to switch clouds or
build some resiliency across several providers.

This guide might or might not work on other linux distros.

Happy hacking!

## References

- <https://godaddy.com>
- <https://www.digitalocean.com>
- <https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-web-server-and-reverse-proxy-for-apache-on-one-ubuntu-18-04-server>
- <https://serverfault.com/a/1083516/48288>
- <https://linuxize.com/post/how-to-add-user-to-group-in-linux>
- <https://www.vultr.com/docs/setup-letsencrypt-on-linux>
- <https://github.com/cockpit-project/cockpit/issues/12802#issuecomment-535274091>
- <https://cockpit-project.org/running#fedora>
- <https://github.com/cockpit-project/cockpit/wiki/Proxying-Cockpit-over-NGINX#insecure-connections>
- <https://stackoverflow.com/questions/23948527/13-permission-denied-while-connecting-to-upstreamnginx>
