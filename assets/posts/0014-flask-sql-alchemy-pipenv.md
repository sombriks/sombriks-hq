# Are you flasking me or life during pipenv time

The [Python](https://www.python.org) language is there as one of the biggest
options to solve _real world problems (TM)_ and it's ecosystem is rich and
healthy.

In this article we'll cover the current state of the art when it comes to REST,
databases and project structure from a pretty pragmatic point of view

## The problem

We'll reuse a
[small pet project](https://github.com/sombriks/rosetta-beer-store).

## The solution

In order to offer a REST API we'll adopt [flask](http://flask.pocoo.org), the
microframework full with good intentions.

To access the database we'll rely on [sqlalchemy](https://www.sqlalchemy.org),
which also offers a way to manage
[schema evolution](https://sqlalchemy-migrate.readthedocs.io/en/latest/).

Finally, all those useful libraries can be found using the
[pip package manager](https://pypi.org/project/pip/), which is widely available
with modern python.

### The python version wars

One good thing about python is that it's everywhere. Easy to install, if it's
not already present.

However, there are two mainstream python versions out there: the python2 and the
python3.

Although python follows [the semver way](https://semver.org), this is a major
release containing breaking changes.

Then it is pretty common on linux machines to find on system path both versions
available: **python** as python 2 and **python3**.

One attempt to solve this issue is the
[virtualenv](https://virtualenv.pypa.io/en/latest/). It creates an entire python
installation inside a folder and offers a few scripts to make it override the
default python installations offered by the system. pretty much like a
[node_modules](https://docs.npmjs.com/files/folders.html#node-modules) folder,
but on steroids.

The downside of using _virtualenv_ directly is that folder containing the
virtualenv itself now is yours to manage. Unlike node, there is no package.json
with the needed information to rebuild it. I mean, there wasn't.

### The pipenv on rescue

So, [pipenv](https://pipenv.readthedocs.io/en/latest/) is something like npm but
with python parents. it solves both package management and the correct python
version with one single hit. It relies on a config file called
[Pipfle](https://github.com/pypa/pipenv/blob/master/docs/basics.rst)
which is able to both create the virtualenv prefix and install the correct
dependencies.

This is what people use to make their python projects easier to manage.

## Building stuff

After [installing pipenv](https://pipenv.readthedocs.io/en/latest/install/#installing-pipenv)
you can install the first dependency:

```bash
$ pipenv install flask --three
Creating a virtualenv for this project...
Pipfile: /Users/sombriks/git/rosetta-beer-store/beer-store-service-python-flask-sqlalchemy/Pipfile
Using /usr/local/bin/python3.7 (3.7.2) to create virtualenv...
⠋ Creating virtual environment...Using base prefix '/usr/local/Cellar/python/3.7.2_2/Frameworks/Python.framework/Versions/3.7'
New python executable in /Users/sombriks/.local/share/virtualenvs/beer-store-service-python-flask-sqlalchemy-5va3oA4a/bin/python3.7
Also creating executable in /Users/sombriks/.local/share/virtualenvs/beer-store-service-python-flask-sqlalchemy-5va3oA4a/bin/python
Installing setuptools, pip, wheel...
done.
Running virtualenv with interpreter /usr/local/bin/python3.7

✔ Successfully created virtual environment!
Virtualenv location: /Users/sombriks/.local/share/virtualenvs/beer-store-service-python-flask-sqlalchemy-5va3oA4a
Creating a Pipfile for this project...
Installing flask...
Adding flask to Pipfile's [packages]...
✔ Installation Succeeded
Pipfile.lock not found, creating...
Locking [dev-packages] dependencies...
Locking [packages] dependencies...
✔ Success!
Updated Pipfile.lock (662286)!
Installing dependencies from Pipfile.lock (662286)...
  🐍   ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ 6/6 — 00:00:02
To activate this project's virtualenv, run pipenv shell.
Alternatively, run a command inside the virtualenv with pipenv run
```

It creates the **Pipfile** and **Pipfile.lock** files so the setup needed to run
the project on another environment will be much easier.

The fancy and honest _flask hello world_ follows:

```python
# app.py
from flask import Flask
app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"
```

You can run this code with the following majestic command line:

```bash
$ FLASK_ENV=development FLASK_APP=app.py pipenv run flask run
 * Serving Flask app "app.py" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 261-176-388
```

This flask service in development mode is ready to detect script changes and
reload accordingly.

### The database

Now we'll install
