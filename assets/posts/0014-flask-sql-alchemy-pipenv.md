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

### The database saga

Now we'll install sqlalchemy
[and it's flask binding](http://flask-sqlalchemy.pocoo.org/2.3/) so we can deal
better with databases:

```bash
$ pipenv install sqlalchemy flask_sqlalchemy
Installing sqlalchemy...
Adding sqlalchemy to Pipfile's [packages]...
✔ Installation Succeeded
Installing flask_sqlalchemy...
Adding flask_sqlalchemy to Pipfile's [packages]...
✔ Installation Succeeded
Pipfile.lock (693ac0) out of date, updating to (c17fe3)...
Locking [dev-packages] dependencies...
✔ Success!
Locking [packages] dependencies...
✔ Success!
Updated Pipfile.lock (693ac0)!
Installing dependencies from Pipfile.lock (693ac0)...
  🐍   ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ 8/8 — 00:00:02
To activate this project's virtualenv, run pipenv shell.
Alternatively, run a command inside the virtualenv with pipenv run.
```

And our `app.py` will be this:

```python
# app.py
from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

url = 'sqlite:///beerstore.db'
# if app.config['FLASK_ENV'] == 'development':
#     url ="postgres://postgres:postgres@127.0.0.1/beerstore"
app.config['SQLALCHEMY_DATABASE_URI'] = url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Media(db.Model):
    __tablename__ = "media"
    idmedia = db.Column(db.Integer, nullable=False, primary_key=True)
    creationdatemedia = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    datamedia = db.Column(db.LargeBinary, nullable=False)
    nomemedia = db.Column(db.String(255), nullable=False)
    mimemedia = db.Column(db.String(255), nullable=False)


class Beer(db.Model):
    __tablename__ = "beer"
    idbeer = db.Column(db.Integer, primary_key=True)
    creationdatebeer = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    titlebeer = db.Column(db.String(255), nullable=False)
    descriptionbeer = db.Column(db.Text)
    idmedia = db.Column(db.Integer, db.ForeignKey('media.idmedia'))


@app.route("/status")
def hello():
    return "ONLINE!"


```

This way we have models but hey, they're neither answering on REST endpoints yet
or connected to a real database. Also we didn't managed to create the initial
schema using the
[sqlalchemy-migrate](https://sqlalchemy-migrate.readthedocs.io/en/latest/):

```bash
pipenv install sqlalchemy-migrate
```

Once installed, the **migrate** command will be available to use inside the
project's virtualenv. But remember, we don't interact directly with virtualenv,
we call pipenv for it.

Now create the _migrations_ repository:

```bash
pipenv run migrate create migrations "My beer store repository"
```

The project structure now looks like this:

```bash
beer-store-service-python-flask-sqlalchemy/
├── Pipfile
├── Pipfile.lock
├── app.py
└── migrations
    ├── README
    ├── __init__.py
    ├── manage.py
    ├── migrate.cfg
    └── versions
        ├── __init__.py

4 directories, 10 files
```

Once the repository gets created, it's time to version the database:

```bash
$ pipenv shell
Launching subshell in virtual environment...
(beer-store-service-python-flask-sqlalchemy)$ python3 ./migrations/manage.py version_control sqlite:///beerstore.db migrations
```

And finally make our first migration:

```bash
(beer-store-service-python-flask-sqlalchemy)$  python3 ./migrations/manage.py script_sql sqlite "initial schema" migrations
```

Note that we had to use and keep inside the subshell created by `pipenv shell`.
The project structure now looks like this:

```bash
beer-store-service-python-flask-sqlalchemy/
├── Pipfile
├── Pipfile.lock
├── app.py
├── beerstore.db
└── migrations
    ├── README
    ├── __init__.py
    ├── __pycache__
    │   └── __init__.cpython-37.pyc
    ├── manage.py
    ├── migrate.cfg
    └── versions
        ├── 001_initial_schema_sqlite_downgrade.sql
        ├── 001_initial_schema_sqlite_upgrade.sql
        ├── __init__.py
        └── __pycache__
            └── __init__.cpython-37.pyc
4 directories, 13 files
```

Open the `001_initial_schema_sqlite_upgrade.sql` file and add the sql code for
the schema creation:

```sql
-- name: create-media-table
create table media (
  idmedia integer primary key autoincrement,
  creationdatemedia timestamp not null default CURRENT_TIMESTAMP,
  datamedia blob not null,
  nomemedia varchar(255) not null,
  mimemedia varchar(255) not null
);

-- name: create-beer-table
create table beer (
  idbeer integer primary key autoincrement,
  creationdatebeer timestamp not null default CURRENT_TIMESTAMP,
  titlebeer varchar(255) not null,
  descriptionbeer text,
  idmedia integer,

  foreign key (idmedia) references media(idmedia)
);
```

The `001_initial_schema_sqlite_downgrade.sql` looks like this:

```sql
drop table media;
drop table beer;
```

And you can run the database creation by issuing the upgrade migrate command:

```bash
(beer-store-service-python-flask-sqlalchemy)$ python3 ./migrations/manage.py upgrade sqlite:///beerstore.db migrations
0 -> 1...
done
```

#### upgrade / downgrade what

A quick one:

classically, migrate strategies have an **up** and a **down** phase.

Both runs on transactions and what up does, down undoes.

The down however only has value on **development time**.

You should not perform downgrades on production environments because you might
**lose precious data**!

### initial data load

Since it's getting quite tedious to type database url and migration repository
name/path, edit the manage.py script inside the repository:

```python
#!/usr/bin/env python
# migrations/manage.py
from migrate.versioning.shell import main

if __name__ == '__main__':
    main(repository='migrations', url='sqlite:///beerstore.db', debug='False')
```

Now it became easier to create our second migrate:

```bash
(beer-store-service-python-flask-sqlalchemy)$  python3 ./migrations/manage.py script_sql sqlite "initial load"
```

Once again it will create the upgrade script:

```sql
-- 002_initial_load_sqlite_upgrade.sql
insert into beer (idbeer,titlebeer,descriptionbeer) values (1, 'Brahma', 'A número 1!');
insert into beer (idbeer,titlebeer,descriptionbeer) values (2, 'Antartica Original', 'Pilsen');
insert into beer (idbeer,titlebeer,descriptionbeer) values (3, 'Itaipava', 'A cerveja do verão!');
insert into beer (idbeer,titlebeer,descriptionbeer) values (4, 'Devassa', 'Tropical Lager');
insert into beer (idbeer,titlebeer,descriptionbeer) values (5, 'Corona', 'extra');
insert into beer (idbeer,titlebeer,descriptionbeer) values (6, 'Therezópolis', 'Cerveja especial');
insert into beer (idbeer,titlebeer,descriptionbeer) values (7, 'Budweiser', 'King of Beers');
insert into beer (idbeer,titlebeer,descriptionbeer) values (8, 'Heinenken', 'Premium quality');
insert into beer (idbeer,titlebeer,descriptionbeer) values (9, 'Skol', 'A que desce redondo!');
insert into beer (idbeer,titlebeer,descriptionbeer) values (10, 'Kaiser', 'Cerveja bem cervejada!');
insert into beer (idbeer,titlebeer,descriptionbeer) values (11, 'Eisenbahn', 'Cerveja puro malte');
insert into beer (idbeer,titlebeer,descriptionbeer) values (12, 'Liefmans', 'Fruitesse');
insert into beer (idbeer,titlebeer,descriptionbeer) values (13, 'Bohemia', 'cerveja Pilsen');
```

And the downgrade script:

```sql
-- 002_initial_load_sqlite_downgrade.sql
delete from beer where idbeer in (1,2,3,4,5,6,7,8,9,10,11,12,13);
```

One could be tempted to use the
[SQLAlchemy Models](http://flask-sqlalchemy.pocoo.org/2.3/models/) directly on
migrations (migrations can be python scripts too) but think again: you're
versioning not only the database with schema migrations, but also your source
code using some git repo or mercurial, fossil, svn, cvs or something else.

Since models represents the latest version of your schema, they are unable to
track down the entire evolution history that an agnostic migration strategy can.

Also it's not elegant to speak spanish to french people, i.e. to use python to
talk to a database.

Well, since we're done on the database side (did schema, data load, coffee time)
let's make our rest app work.

### It's server time

Fist things first, the app must always run on the latest schema version.
So let's change our `app.py` script to this:

```python
# app.py
from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from migrate.versioning.api import upgrade, version_control


app = Flask(__name__)

url = 'sqlite:///beerstore.db'
# if app.config['FLASK_ENV'] == 'development':
#     url ="postgres://postgres:postgres@127.0.0.1/beerstore"
app.config['SQLALCHEMY_DATABASE_URI'] = url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

upgrade(url, 'migrations')


class Media(db.Model):
    __tablename__ = "media"
    idmedia = db.Column(db.Integer, nullable=False, primary_key=True)
    creationdatemedia = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    datamedia = db.Column(db.LargeBinary, nullable=False)
    nomemedia = db.Column(db.String(255), nullable=False)
    mimemedia = db.Column(db.String(255), nullable=False)


class Beer(db.Model):
    __tablename__ = "beer"
    idbeer = db.Column(db.Integer, primary_key=True)
    creationdatebeer = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    titlebeer = db.Column(db.String(255), nullable=False)
    descriptionbeer = db.Column(db.Text)
    idmedia = db.Column(db.Integer, db.ForeignKey('media.idmedia'))


@app.route("/status")
def hello():
    return "ONLINE!"
```

This simple `upgrade` call grants that the app always will be running against
the latest schema version.

So let's return some data to the client. Change the `app.py` once more again:

```python
# app.py
from datetime import datetime
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from migrate.versioning.api import upgrade, version_control

app = Flask(__name__)

url = 'sqlite:///beerstore.db'
# if app.config['FLASK_ENV'] == 'development':
#     url ="postgres://postgres:postgres@127.0.0.1/beerstore"
app.config['SQLALCHEMY_DATABASE_URI'] = url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# if app.config['FLASK_ENV'] == 'development':
try:
    version_control(url, 'migrations')
except:
    print("db already versioned!")

upgrade(repository='migrations', url=url, debug='False')


class Media(db.Model):
    __tablename__ = "media"
    idmedia = db.Column(db.Integer, nullable=False, primary_key=True)
    creationdatemedia = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    datamedia = db.Column(db.LargeBinary, nullable=False)
    nomemedia = db.Column(db.String(255), nullable=False)
    mimemedia = db.Column(db.String(255), nullable=False)


class Beer(db.Model):
    __tablename__ = "beer"
    idbeer = db.Column(db.Integer, primary_key=True)
    creationdatebeer = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    titlebeer = db.Column(db.String(255), nullable=False)
    descriptionbeer = db.Column(db.Text)
    idmedia = db.Column(db.Integer, db.ForeignKey('media.idmedia'))


@app.route("/status")
def hello():
    return "ONLINE!"


@app.route("/beer/list", methods=["GET"])
def beerlist():
    page = request.args.get("page")
    pageSize = request.args.get("pageSize")
    return Beer.query.paginate(page, pageSize).items


```

Run the server again and point it to
[http://127.0.0.1:5000/beer/list](http://127.0.0.1:5000/beer/list)

This change is a bit sad because it throws a nasty error:
`TypeError: 'list' object is not callable`

Unlike javascript, json isn't a first class citizen.

Change the `app.py` again:

```python
# app.py
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from migrate.versioning.api import upgrade, version_control

app = Flask(__name__)

url = 'sqlite:///beerstore.db'
# if app.config['FLASK_ENV'] == 'development':
#     url ="postgres://postgres:postgres@127.0.0.1/beerstore"
app.config['SQLALCHEMY_DATABASE_URI'] = url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# if app.config['FLASK_ENV'] == 'development':
try:
    version_control(url, 'migrations')
except:
    print("db already versioned!")

upgrade(repository='migrations', url=url, debug='False')


class Media(db.Model):
    __tablename__ = "media"
    idmedia = db.Column(db.Integer, nullable=False, primary_key=True)
    creationdatemedia = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    datamedia = db.Column(db.LargeBinary, nullable=False)
    nomemedia = db.Column(db.String(255), nullable=False)
    mimemedia = db.Column(db.String(255), nullable=False)


class Beer(db.Model):
    __tablename__ = "beer"
    idbeer = db.Column(db.Integer, primary_key=True)
    creationdatebeer = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    titlebeer = db.Column(db.String(255), nullable=False)
    descriptionbeer = db.Column(db.Text)
    idmedia = db.Column(db.Integer, db.ForeignKey('media.idmedia'))

    def to_dict(self):
        return {
            "idbeer": self.idbeer,
            "creationdatebeer": self.creationdatebeer,
            "titlebeer": self.titlebeer,
            "descriptionbeer": self.descriptionbeer,
            "idmedia": self.idmedia,
        }


@app.route("/status")
def hello():
    return "ONLINE!"


@app.route("/beer/list", methods=["GET"])
def beerlist():
    page = request.args.get("page", default=1, type=int)
    pageSize = request.args.get("pageSize", default=10, type=int)
    return jsonify([
        item.to_dict() for item in Beer.query.paginate(page, pageSize).items
    ])
```

And that's nice, because the code is able to answer the browser correctly.

Visiting [this url](http://127.0.0.1:5000/beer/list?pageSize=5) will produce the
following output:

```json
[
  {
    "creationdatebeer": "Wed, 06 Mar 2019 03:14:01 GMT",
    "descriptionbeer": "A n\u00famero 1!",
    "idbeer": 1,
    "idmedia": null,
    "titlebeer": "Brahma"
  },
  {
    "creationdatebeer": "Wed, 06 Mar 2019 03:14:01 GMT",
    "descriptionbeer": "Pilsen",
    "idbeer": 2,
    "idmedia": null,
    "titlebeer": "Antartica Original"
  },
  {
    "creationdatebeer": "Wed, 06 Mar 2019 03:14:01 GMT",
    "descriptionbeer": "A cerveja do ver\u00e3o!",
    "idbeer": 3,
    "idmedia": null,
    "titlebeer": "Itaipava"
  },
  {
    "creationdatebeer": "Wed, 06 Mar 2019 03:14:01 GMT",
    "descriptionbeer": "Tropical Lager",
    "idbeer": 4,
    "idmedia": null,
    "titlebeer": "Devassa"
  },
  {
    "creationdatebeer": "Wed, 06 Mar 2019 03:14:01 GMT",
    "descriptionbeer": "extra",
    "idbeer": 5,
    "idmedia": null,
    "titlebeer": "Corona"
  }
]
```

### adding cors

Install flask_cors:

```bash
pipenv install flask_cors
```

And change app.py again:

```python
# app.py
from flask_cors import CORS
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from migrate.versioning.api import upgrade, version_control

app = Flask(__name__)
CORS(app)

url = 'sqlite:///beerstore.db'
# if app.config['FLASK_ENV'] == 'development':
#     url ="postgres://postgres:postgres@127.0.0.1/beerstore"
app.config['SQLALCHEMY_DATABASE_URI'] = url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# if app.config['FLASK_ENV'] == 'development':
try:
    version_control(url, 'migrations')
except:
    print("db already versioned!")

upgrade(repository='migrations', url=url, debug='False')


class Media(db.Model):
    __tablename__ = "media"
    idmedia = db.Column(db.Integer, nullable=False, primary_key=True)
    creationdatemedia = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    datamedia = db.Column(db.LargeBinary, nullable=False)
    nomemedia = db.Column(db.String(255), nullable=False)
    mimemedia = db.Column(db.String(255), nullable=False)


class Beer(db.Model):
    __tablename__ = "beer"
    idbeer = db.Column(db.Integer, primary_key=True)
    creationdatebeer = db.Column(
        db.DateTime, nullable=False, default=datetime.now)
    titlebeer = db.Column(db.String(255), nullable=False)
    descriptionbeer = db.Column(db.Text)
    idmedia = db.Column(db.Integer, db.ForeignKey('media.idmedia'))

    def to_dict(self):
        return {
            "idbeer": self.idbeer,
            "creationdatebeer": self.creationdatebeer,
            "titlebeer": self.titlebeer,
            "descriptionbeer": self.descriptionbeer,
            "idmedia": self.idmedia,
        }


@app.route("/status")
def hello():
    return "ONLINE!"


@app.route("/beer/list", methods=["GET"])
def beerlist():
    page = request.args.get("page", default=1, type=int)
    pageSize = request.args.get("pageSize", default=10, type=int)
    search = request.args.get("search", default="")
    items = Beer.query.filter(Beer.titlebeer.contains(
        search)).paginate(page, pageSize).items
    return jsonify([item.to_dict() for item in items])

```

## Making things easier

This is a small yet worthy update. You can add a `[scripts]` section on your 
**Pipfile** and not only make your life easier but also explain to project
newcomers how to rock the boat:

```ini
[[source]]
name = "pypi"
url = "https://pypi.org/simple"
verify_ssl = true

[dev-packages]
pep8 = "*"
autopep8 = "*"

[packages]
flask = "*"
sqlalchemy = "*"
flask_sqlalchemy= "*"
sqlalchemy-migrate = "*"
flask-cors = "*"

[requires]
python_version = "3.7"

[scripts]
dev = "bash -c 'FLASK_ENV=development FLASK_APP=app pipenv run flask run'"
migrations = "python3 ./migrations/manage.py"

```

Like package.json or Make, Pipfile becomes *executable documentation* :-)

## Conclusion

At this point the project is pretty much stable and next steps should be fancy
things like divide this big script into smaller modules so it could grow more
healthy.

Flask ecosystem can deliver a pretty decent solution with little effort, and
comes as a first class player on backend game.

As usual, the complete source code can be found
[here](https://github.com/sombriks/rosetta-beer-store/tree/master/beer-store-service-python-flask-sqlalchemy).

Happy hacking.

2019-03-06
