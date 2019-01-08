# How to use git

This is a well covered theme over the internet but it does not harm to put it
in my own words. Let's do it.

## Installing

On windows machines get it [here](https://git-scm.com/downloads).

On linux boxes it might be there already. If not, check the package manager of
your [distro](https://distrowatch.com), it will be there.

On macOS you might find it by typing this command on your terminal:

```bash
xcode-select --install
```

Oh, by the way, there are lots of GUI tools for git. We'll see none of them.

## Init, Add, Commit, Log, Checkout

First of all, make a folder. Inside the folder make a text file.

```bash
mkdir foobar
cd foobar
echo "hello you" > myfile.txt
```

The deal with git is that you can memorize forever the folder content.
For example:

```bash
$ git init
# ...
$ git add myfile.txt
$ git commit -m 'first works version'
[master (root-commit) b49e993] first works version
 1 file changed, 1 insertion(+)
 create mode 100644 myfile.txt
```

This file now is committed. Every relevant change you do in your files can be
secured by a new commit:

```bash
echo "hello again" >> myfile.txt
git add . # adds everything in the current folder
git commit -m 'more works'
```

You can see how many commits you have with git log:

```bash
$ git log
commit 5188c9ac3c766b192478640b2835f585168297d1 (HEAD -> master)
Author: sombriks <sombriks@gmail.com>
Date:   Tue Jan 8 12:58:31 2019 -0300

    more works

commit b49e993c0c95e3e8a11bedd14b913e7c7a158cdc
Author: sombriks <sombriks@gmail.com>
Date:   Tue Jan 8 12:52:07 2019 -0300

    first works version
```

And you can checkout a commit to see things as they used to be:

```bash
$ git checkout b49e993c0c95e3e8a11bedd14b913e7c7a158cdc
# lots of scary but harmless things...
$ cat myfile.txt
hello you
$ git checkout master
$ cat myfile.txt
hello you
hello again
```

## Deleting

The easier path to delete files is to actually delete them and add the folder
modifications:

```bash
$ rm -rf myfile.txt
$ git add .
$ git commit -m "throw works away"
[master 0ef23d7] throw works away
 1 file changed, 2 deletions(-)
 delete mode 100644 myfile.txt
```

Note that even deleted, the file now lies in the git history, so you can
checkout it back if needed.

## Branch

## Merge

## Remote

## Clone

## Pull, Push

## Common workflows
