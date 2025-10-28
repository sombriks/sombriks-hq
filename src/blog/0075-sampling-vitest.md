---
layout: blog-base.webc
tags:
  - posts
  - node
  - typescript
  - knex
  - tsx
  - sqlite
  - fastify
  - vue
  - shorts
date: 2024-12-13
draft: false
---
# That time we tested typescript and vitest in a fullstack project

Vitest provides a neat API and good performance. It is the choice for testing on
new frontend projects and even on backend as well, but i found some caveats and
workarounds.

## On frontend, proper mock test boundaries can be tricky

Errors from testing library aren't the most friendly ones. Therefore, your test
environment must be quite well configured to avoid such errors, like double
mounts or failed requests on testcases.

For proper mount, use happy-dom.

For mock http requests, use msw.

See a sample testcase:

```typescript
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {render, RenderResult} from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import {http, HttpResponse} from 'msw'
import {setupServer, SetupServerApi} from 'msw/node'

import App from "./App.vue";

describe('app tests', () => {

    let component: RenderResult
    let server: SetupServerApi

    beforeAll(() => {
        server = setupServer(
            http.get('http://mock-url:3000/todos', () => HttpResponse.json([
                {id: 777, description: 'Walk the dog', done: true}
            ]))
        )
        server.listen()
        component = render(App)
    })

    afterAll(() => {
        vi.waitFor(() => component.unmount())
        server.close()
    })

    it('should have import.meta.env.MODE to be "test"', () => {
        expect(import.meta.env.MODE).eq('test')
    })

    it('should have VITE_API_URL set to mock url', () => {
        expect(import.meta.env.VITE_API_URL).eq('http://mock-url:3000')
    })

    it('should click the count button', async () => {
        const button = component.getByText("count is 0")
        expect(button).toBeTruthy()
        const user = userEvent.setup()
        await user.click(button)
        expect(button.innerText).eq("count is 1")
    })

    it('should search todos', async () => {
        const search = component.getByPlaceholderText('Search')
        expect(search).toBeTruthy()
    })

    it('should have one todo - check id', async () => {
        const id = component.getByText('#777')
        expect(id).toBeTruthy()
    })

    it('should have one todo - check input', async () => {
        const field = component.getByDisplayValue('Walk the dog')
        expect(field).toBeTruthy()
    })
})
```

## On backend, the VITE_ prefix can be annoying

Vite uses in its environment variables the *VITE_* prefix so other environment
variables does not contamine the frontend environment.

On backed, however, that's another story.

There is no simple path to remove this limitation; best i could do was to use
dotenv library to force an environment at vitest.config.ts level:

```typescript
import {defineConfig} from "vite";
import {config} from 'dotenv'

export default defineConfig({
    // @ts-ignore
    test: {
        // @ts-ignore
        env: {
            "NODE_ENV": "test",
            ...config({path: '.env'}).parsed,
            ...config({path: '.env.test'}).parsed,
        }
    },
})
```

And it's funny because it works and we're supposed to not need dotenv anymore.

## Conclusion

Vitest is an amazing testing framework and do a decent job on both frontend and
backend.

Full source code can be found [here][repo].

Happy hacking!

[repo]: https://github.com/sombriks/simple-vitest
