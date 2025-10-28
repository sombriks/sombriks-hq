---
layout: blog.pug
tags:
  - posts
  - shorts
  - golang
  - git
  - ssh
  - private modules
date: 2025-01-12
draft: false
---
# Consuming private modules in golang

Most modern ecosystems offers 3rd party modules and with modern golang wouldn't
be any different.

## It's all about git really

Modules usually comes from VCS and VCS is usually git. If you have access to the
private module then so your golang project.

For example, if you checkout projects using ssh, make sure the server hosting
the private module can use that key too:

In your `~/.ssh/config`:

```ssh-config
Host github.com
  User git
  IdentityFile ~/.ssh/id_rsa
```

Alternatively, do the configuration at git level:

```bash
git config core.sshCommand 'ssh -i ~/.ssh/id_rsa'  #specific private key
```

That should work, assuming the key is configured in your github account.

## But i used https

If you checkout using https, a similar move is needed. Thing is, server might
need authentication info, so you must provide it.

Let's say you checkout with github personal access token. Then you need to configure git to do the same:

```bash
git config url.https://$GH_ACCESS_TOKEN@github.com/.insteadOf github.com
```

And that's it, private  golang modules from your organization or your secret
works will checkout normally.
