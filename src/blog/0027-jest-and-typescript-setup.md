---
layout: blog.pug
tags: 
  - posts
  - node
  - jest
  - typescript
  - test
date: 2021-12-15
---
# You can test your typescript code too

And of course you should test.

Adopting the static type checking is just one step forward better code quality,
adding a test suite is the next natural step.

In the
[previous article](https://sombriks.com.br/#/blog/0026-simple-typescript-setup.md)
we did a very humble typescript setup and now we add [jest](https://jestjs.io/)
as our testing framework. [There](https://www.chaijs.com/)
[are](https://jasmine.github.io/) [other](https://github.com/avajs/ava)
[options](https://mochajs.org/), but jest it the popular one, maintained by
facebook, and you should choose technology as one chooses a bar: go where there
is more people.

## Basic project setup

As usual in any npm project, you should start by create a folder, do npm init on
int and install development dependencies:

```bash
mkdir simple-typescript-test-setup
cd simple-typescript-test-setup
npm init -y
npm i -D typescript jest ts-jest @types/node @types/jest
```

For this setup all we'll need will be the typescript (if you don't have the tsc
compiler available from command line, add it as dependency so npm will have it),
jest itself, ts-jest to enable jest to understand typescript and a few
[type](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html)
[definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/) to enable
better quality on autocomplete on
[your favorite IDE](https://code.visualstudio.com/).

Now let's laid down our folder structure and a few files:

```bash
echo "node_modules" > .gitignore
echo "coverage" >> .gitignore
echo "dist" >> .gitignore
mkdir -p src/components
touch src/index.ts
touch src/components/validador.{test.ts,ts}
```

In this project we'll have a simple index entrypoint and a component called
`validator.ts`. We'll cover with tests it's functionality on `validator.test.ts`.

Next step is to initialize git, typescript and jest configs:

```bash
git init
npx tsc --init
npx ts-jest config:init
```

After that make sure you define `rootDir` and `outDir` in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "rootDir": "./src",    
    "outDir": "./dist",                                 
    "target": "es2016",  
    "module": "commonjs",                          
    "esModuleInterop": true,                 
    "forceConsistentCasingInFileNames": true,           
    "strict": true,                                     
    "skipLibCheck": true                               
  }
}
```

Next configure your `jest.config.js`:

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist']
};
```

It's important to ignore the `dist` folder to keep jest from test/cover the
resulting js files that will be present there.

Now adjust the script section on your `package.json`:

```json
{
  "name": "simple-typescript-test-setup",
  "version": "1.0.0",
  "description": "simple-typescript-test-setup",
  "main": "index.js",
  "scripts": {
    "start": "node dist/index",
    "build": "tsc",
    "test": "jest --coverage"
  },
  "keywords": [],
  "author": "sombriks",
  "license": "ISC",
  "devDependencies": {
    "@types/jest": "^27.0.3",
    "@types/node": "^16.11.13",
    "jest": "^27.4.5",
    "ts-jest": "^27.1.1",
    "typescript": "^4.5.4"
  }
}
```

Almost done! now we can build, run and test our typescript project.

Notice the `--coverage` parameter passed to jest. When testing, it is important
not only to write tests, but also know what is not tested yet.

The coverage tool produces reports which will let you know how much of your code
is under test, therefore which parts are trustworthy and which parts might hide
unexpected behaviors.

## The code under test

Our index is pretty simple, it receives a number as argument and if it's
divisible by 3, prints true. Prints false otherwise:

```ts
// src/index.ts
import { validateNumber } from "./components/validator";

if (process.argv[2]) console.log(validateNumber(parseInt(process.argv[2], 10)));
else
  console.log(`
    usage: 
      node dist/index 3
      npm start -- 7
`);
```

The logic resides inside our validator component:

```ts
// src/components/validator.ts
export const validateNumber = (x: number): boolean => x % 3 === 0;
```

And finally, the test suite:

```ts
// src/components/validator.test.ts
import { validateNumber } from "./validator";

describe("validator test suite", () => {

  it("should validate number divisible by 3", () => {
    const fn = jest.fn(validateNumber);

    const number1: number = 5;
    const number2: number = 9;

    const result1: boolean = fn(number1);
    const result2: boolean = fn(number2); 

    expect(result1).toBe(false);
    expect(result2).toBe(true);
    expect(fn).toBeCalled();
  });
});
```

To be honest, the _testcase_. Testsuite is a collection of testcases.

Since we use the `.test.ts` file extension, jest understands magically that
module must be housing at least one testsuite.

If you're unfamiliar with that _describe/it_  idiomatic way, don't worry, it's
like that in many others test engines around.

But what is it doing?

First we do `const fn = jest.fn(validateNumber);`, which augments our function
with some [special jest powers](https://jestjs.io/docs/mock-functions).

Every test case should have at least one _expect_ clause. This is how we trial
the code under test, expecting values from known inputs.

To see if it works of fails, you can build the project and call the test:

```bash
[sombriks@physalis simple-typescript-test-setup]$ npm run build

> simple-typescript-test-setup@1.0.0 build /home/sombriks/git/simple-typescript-test-setup
> tsc

[sombriks@physalis simple-typescript-test-setup]$ npm run test

> simple-typescript-test-setup@1.0.0 test /home/sombriks/git/simple-typescript-test-setup
> jest --coverage

 PASS  src/components/validator.test.ts
  validator test suite
    ✓ should validate number divisible by 3 (4 ms)

--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |                   
 validator.ts |     100 |      100 |     100 |     100 |                   
--------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.561 s, estimated 5 s
Ran all test suites.
[sombriks@physalis simple-typescript-test-setup]$ 
```

this not only gives a report in the terminal, but creates a folder called
**coverage** containing fancy html reports and more.

## Conclusion

As usual, you can see the source code
[here](https://github.com/sombriks/simple-typescript-test-setup). As a bonus,
the repo contains some visual studio configurations to use with the
[jest plugin](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
so you can run your tests from GUI.
