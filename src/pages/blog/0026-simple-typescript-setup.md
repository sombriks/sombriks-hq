---
layout: base.webc
tags: 
  - posts
  - node
  - typescript
date: 2021-12-09
---
# Simple typescript setup

I don't really get too serious on typescript at first. It's transpilled, we can
ignore errors, it tries to be Java.

But i am kinda wrong.

Types and static analysis are good, the fact it doesn't blows up your runtime is
no excuses to diminish value in development time checks.

So i decided to master configs and setups for projects with typescript.

But how to start?

## Big things has small beginnings

To get started, all you really need is
[tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
working from your command line.

To install tsc, you must do this in your terminal:

```bash
sudo npm -g i typescript
```

And if you don't have npm, install [node.js](https://nodejs.org/en/download/).
Sometimes it's already in your machine

Now we can already 'compile' and run our first typescript script:

```ts
// hello.ts
type Person = {
  name: string,
  age?: number,   
}

const bob: Person = {name:"Bob"}
console.log(`Hello, ${bob.name}`)
```

now save it and compile:

```bash
tsc hello.ts 
```

run it:

```bash
node hello.js 
```

And of course, if you try to step ouf of the line with your types, tsc will
complain a little:

```ts
// hello.ts
type Person = {
  name: string,
  age?: number,   
}

const bob: Person = { name:"Bob", hair:"Green" }
console.log(`Hello, ${bob.name}`)
```

try to compile and...

```bash
$ tsc hello.ts 
hello.ts:7:35 - error TS2322: Type 'string' is not assignable to type 'number'.

7 const bob: Person = { name:"Bob", age:"young" };
                                    ~~~

  hello.ts:4:3
    4   age?: number,
        ~~~
    The expected type comes from property 'age' which is declared here on type 'Person'


Found 1 error.
```

Yea, static typing!

## Growing up the setup

But just one file, a compiler and an idea in the head isn't enough for modern
development.

You need a project.

Make a folder and init a npm project. Then add the typescript magic on it:

```bash
mkdir simple-typescript-setup
cd simple-typescript-setup/
npm init -y
tsc --init
npm i --save-dev @types/node
echo "node_modules" > .gitignore
echo "dist" >> .gitignore
mkdir src
touch src/index.ts
git init .
```

You will end up with a project layout more or less like this:

```bash
$ tree .
.
├── node_modules/
├── package.json
├── package-lock.json
├── src
│   └── index.ts
└── tsconfig.json
```

Then modify your package.json:

```json
{
  "name": "simple-typescript-setup",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^16.11.12"
  }
}

```

And then open `tsconfig.json` and add those properties:

```json
{
  "compilerOptions": {
  // several properties
  "rootDir": "./src",
  "outDir": "./dist",
  // more several properties
  }
}  
```

We're almost done. Modify now your `src/index.js`:

```ts
export interface Person {
  name: string;
  age?: number;
}

const bob: Person = { name: "Robert" };

console.log(bob);
```

Since we set a npm script for start, just do it:

```bash
$ npm run build
# no news is good news
$ npm start

> simple-typescript-setup@1.0.0 start /home/sombriks/git/simple-typescript-setup
> node dist/index.js

{ name: 'Robert ' }
```

Nice thing on having a decent project setup is to be able to modularize it
better, for instance, create `src/lib/Person.ts`:

```ts
export interface Person {
  name: string;
  age?: number;
}
```

Then modify your src/index.ts again:

```ts
import { Person } from "./lib/Person";

const bob: Person = { name: "Robert" };

console.log(bob);
```

It will compile every dependency your entrypoint needs without any further
configuration.

## Next steps

This project is kinda proof of concept but leads to improvements on how to add
more tools related to serious development with typescript. For instance, add a
decent unit tests runtime and cool things like rest services or database access
becomes easier for this point.

You can see the code of this article in
[this repo](https://github.com/sombriks/simple-typescript-setup).
