# My developer setup

Times to times we need to upgrade our systems, and there is that moment when the
upgrade involves hardware.

Usually this is when we need to reinstall everything from scratch and you
realize "oh my, what do i really need in order to work???"

In this post i'll share what i did to properly prepare
[physalis](https://exvius.gamepedia.com/Physalis), the machine succeeding
[ramza](https://exvius.gamepedia.com/Ramza), for it's maiden workday ride.

## What to do with new Hardware? Pour more hardware on it!

This is a [Lenovo IdeaPad S145-15API](https://www.lenovo.com/br/pt/laptops/ideapad/ideapad-s-series/Lenovo-IdeaPad-S145-15API/p/88IPS101327) 
with expandable memory and a free sata slot. So i put a 16GB RAM module on it
and a kingston 480GB SSD drive on it.

## What about the software?

The machine comes with windows 10 installed on a fancy, tiny m2 SSD. I just
leave it alone.

### Operating system

The new SSD got a pretty default [Fedora 32](https://getfedora.org/)
installation, since it was the latest release by the time of this writing.

### Applications repositories

Whenever you prepare a fedora box, it's important to make the
[rpmfusion](https://rpmfusion.org/Configuration/) setup.

### SDK's needed for pay the rent and for fun

Nowadays i do a lot of [vue](https://vuejs.org/),
[postgresql](https://www.postgresql.org/) and 
[java](https://jdk.java.net/java-se-ri/8-MR3). And
[a container](https://podman.io/) times to times.

If you want to play with vue you'll need [nodejs](https://nodejs.org/en/), since
the bad dogs deal with it using [vue-cli](https://cli.vuejs.org/).

On my [old stuff](https://sombriks.wordpress.com/2012/03/03/configuracao-inicial-do-postgresql-2/)
i already have the step-by-step on preparing a postrgesql database.

The 'news' here is [dbeaver](https://dbeaver.io/), the state of the art of
database management. Forget that *admin* silly things, what you really need is
**dbeaver**.

In order to deal with the sweet dread of java stuff, you'll need not only the
jdk itself, you'll need the [npm](https://www.npmjs.com/) predecessors.

Even if fedora can bring you some of them with its 
[dnf](https://fedoraproject.org/wiki/DNF) package management, a cleaner way to
get these java things running (for instance, ant, maven and gradle) is
[sdkman](https://sdkman.io/). Install it and get all the tooling you will need.

Oh, [git](https://git-scm.com/) comes with fedora, so do not fear nothing.

### Corporative communications

There is a [rpm package for slack](https://slack.com/intl/pt-br/downloads/linux)
and Discord offers a [tarball](https://discord.com/new/download) containing a 
.desktop file which you can edit and put inside `~/.local/share/applications`
folder.

Seriously edit it.

### IDE galore

Install [vscode](https://code.visualstudio.com/).

Install [eclipse](https://www.eclipse.org/downloads/).

If the boss is paying, install
[Intellij IDEA Ultimate](https://www.jetbrains.com/pt-br/idea/).

Oh, by the way, remember the `/etc/sysctl.conf` setup regarding max file size an
user can watch:

```bash
[sombriks@physalis ~]$ cat /etc/sysctl.conf 
# sysctl settings are defined through files in
# /usr/lib/sysctl.d/, /run/sysctl.d/, and /etc/sysctl.d/.
#
# Vendors settings live in /usr/lib/sysctl.d/.
# To override a whole file, create a new file with the same in
# /etc/sysctl.d/ and put new settings there. To override
# only specific settings, add a file with a lexically later
# name in /etc/sysctl.d/ and put new settings there.
#
# For more information, see sysctl.conf(5) and sysctl.d(5).
fs.inotify.max_user_watches = 524288
```

## Then we work.

That's it. this is what i do on my machines nowadays in order to get ready for
war.

See you, space cowboy!

2020-07-14
