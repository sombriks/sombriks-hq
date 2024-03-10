---
layout: blog-base.webc
tags:
  - posts
  - k6
  - benchmark
  - node
  - java
  - koa
  - kotlin
  - golang
  - javalin
  - velocity
  - nunjucks
  - htmx
date: 2024-03-09
draft: false
---
# Benchmark node and java using k6

Benchmark code is fun. Results not always, but do the tests always are.

## Why perform load tests at all?

Back in time a friend of mine told a story about that fancy java solution that
delivered about 90% of needed code to create a ERP solution in java. It was
called [jCompany][jcompany] i think.

The sales guy was also a techie and he opened the code editor during pitch sales
and used to create things in seconds in front of the stakeholders. They got
mesmerized and opened their wallets.

A few months later the in-house development team started to smell something
funny and after a small benchmark they discovered that, no matter how much
resources they threw at it, the framework always died after 4 concurrent users.

Deals undone, [they went full JSF/JEE5][jee5] (which was the state of the art
back then) and got a reliable solution.

TL;DR: **Do a test-drive, don't fall in the salesman tricks.**

## Test real, production code or just a small sample?

One good question before dive into the benchmark world: Should i test specially
tailored code for testing purposes or should i point a stress tool to a business
endpoint and hit hard the gas?

On one hand, real, running code has several, mixed concerns. It is harder to say
we're testing processing or I/O.

On the other hand, write a piece of code specifically for processing, other for
memory usage and another just for I/O operations can deliver general
capabilities of the selected stack.

The key advantage of real code is it's already there, delivering results good
enough for your current reality.

You can take advantage of code created specifically for benchmarking when
comparing candidate platforms.

## Benchmark tool of choice: k6

The [k6][k6] benchmark tool has a [wonderful plugin ecosystem][k6-plugins] but
it also works very well for the basic stuff.

It really simple, you configure the benchmark parameters using [javascript][js],
but the runtime is written in [go][golang] for performance reasons.

The benchmark configuration file is a single js script and it needs to export a
function and a config options object:

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function () {
  const result1 = http.get('http://localhost:3000/'); // renders the index
  check(result1, {
    '200 ok': (r) => 200 === r.status
  })
}
```

Please mind that it isn't a regular [node.js][node] script, you can't import npm
packages here directly.

## Code under test

The benchmark we're sampling here answers an easy question: which one is faster?
Node or Java?

To answer that, we'll grab two sample projects which uses backend rendering
capabilities with [htmx][htmx].

One written in [kotlin][kotlin] using the [javalin][javalin] framework,
rendering [velocity][velocity] templates.

The other written in [node][node] using [koa][koa] framework, rendering
[nunjucks][nunjucks] templates.

[Both][app1] [application][app2] delivers the same result app.

## Test hardware specs

The machine used is a development machine. Application would not suffer from
resources limitations for this scenario.

```bash
[sombriks@thanatos ~]()$ inxi --cpu --memory --disk
Memory:
  System RAM: total: 48 GiB available: 45.88 GiB used: 7.1 GiB (15.5%)
  Array-1: capacity: 64 GiB slots: 2 modules: 2 EC: None
  Device-1: Channel-A DIMM 0 type: DDR4 size: 16 GiB speed: 3200 MT/s
  Device-2: Channel-B DIMM 0 type: DDR4 size: 32 GiB speed: 3200 MT/s
CPU:
  Info: 8-core model: AMD Ryzen 7 PRO 5850U with Radeon Graphics bits: 64
    type: MT MCP cache: L2: 4 MiB
  Speed (MHz): avg: 773 min/max: 400/4507 cores: 1: 400 2: 400 3: 400
    4: 1397 5: 400 6: 1397 7: 1397 8: 1397 9: 400 10: 400 11: 1396 12: 400
    13: 400 14: 400 15: 1397 16: 400
Drives:
  Local Storage: total: 931.51 GiB used: 410.4 GiB (44.1%)
  ID-1: /dev/nvme0n1 vendor: Kingston model: SFYRS1000G size: 931.51 GiB
```

## Results

At first one could look at the application code and say "the code is pretty
similar, there will be little performance difference".

Well, this is not the case.

Given the plenty of resources and recent jvm optimizations, **jvm/javalin**
delivered results more than **4 times faster** than **node/koa**

Javalin/Velocity:

```bash
[sombriks@thanatos node-vs-kotlin-k6-benchmark](main)$ k6 run benchmark-javalin.js 

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: benchmark-javalin.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)


     ✓ 200 ok

     checks.........................: 100.00% ✓ 145571      ✗ 0     
     data_received..................: 963 MB  32 MB/s
     data_sent......................: 12 MB   388 kB/s
     http_req_blocked...............: avg=3.62µs  min=1.2µs    med=3.07µs  max=4.7ms    p(90)=4.03µs  p(95)=4.85µs 
     http_req_connecting............: avg=19ns    min=0s       med=0s      max=413.19µs p(90)=0s      p(95)=0s     
     http_req_duration..............: avg=1.92ms  min=792.12µs med=1.37ms  max=457.43ms p(90)=2.61ms  p(95)=4.12ms 
       { expected_response:true }...: avg=1.92ms  min=792.12µs med=1.37ms  max=457.43ms p(90)=2.61ms  p(95)=4.12ms 
     http_req_failed................: 0.00%   ✓ 0           ✗ 145571
     http_req_receiving.............: avg=61.05µs min=21.55µs  med=48.06µs max=11.76ms  p(90)=70.17µs p(95)=89.09µs
     http_req_sending...............: avg=15.87µs min=5.85µs   med=12.94µs max=13.1ms   p(90)=18.07µs p(95)=23.24µs
     http_req_tls_handshaking.......: avg=0s      min=0s       med=0s      max=0s       p(90)=0s      p(95)=0s     
     http_req_waiting...............: avg=1.85ms  min=730.46µs med=1.3ms   max=457.21ms p(90)=2.5ms   p(95)=3.97ms 
     http_reqs......................: 145571  4852.059693/s
     iteration_duration.............: avg=2.04ms  min=883.69µs med=1.47ms  max=459.31ms p(90)=2.76ms  p(95)=4.31ms 
     iterations.....................: 145571  4852.059693/s
     vus............................: 10      min=10        max=10  
     vus_max........................: 10      min=10        max=10  


running (0m30.0s), 00/10 VUs, 145571 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s
```

Koa/Nunjucks:

```bash
[sombriks@thanatos node-vs-kotlin-k6-benchmark](main)$ k6 run benchmark-koa.js 

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: benchmark-koa.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)


     ✓ 200 ok

     checks.........................: 100.00% ✓ 30714       ✗ 0    
     data_received..................: 24 MB   796 kB/s
     data_sent......................: 2.5 MB  82 kB/s
     http_req_blocked...............: avg=3µs     min=951ns  med=1.87µs  max=1.49ms   p(90)=4.3µs   p(95)=5.98µs 
     http_req_connecting............: avg=109ns   min=0s     med=0s      max=484.61µs p(90)=0s      p(95)=0s     
     http_req_duration..............: avg=9.66ms  min=6.24ms med=8.06ms  max=43.6ms   p(90)=17.26ms p(95)=20.75ms
       { expected_response:true }...: avg=9.66ms  min=6.24ms med=8.06ms  max=43.6ms   p(90)=17.26ms p(95)=20.75ms
     http_req_failed................: 0.00%   ✓ 0           ✗ 30714
     http_req_receiving.............: avg=38.01µs min=16.7µs med=31.87µs max=376.28µs p(90)=59.85µs p(95)=71.37µs
     http_req_sending...............: avg=11.7µs  min=4.47µs med=8.37µs  max=338.14µs p(90)=20.47µs p(95)=27.15µs
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s      max=0s       p(90)=0s      p(95)=0s     
     http_req_waiting...............: avg=9.61ms  min=6.21ms med=8.02ms  max=43.19ms  p(90)=17.16ms p(95)=20.65ms
     http_reqs......................: 30714   1023.584482/s
     iteration_duration.............: avg=9.75ms  min=6.3ms  med=8.14ms  max=45.35ms  p(90)=17.41ms p(95)=20.93ms
     iterations.....................: 30714   1023.584482/s
     vus............................: 10      min=10        max=10 
     vus_max........................: 10      min=10        max=10 


running (0m30.0s), 00/10 VUs, 30714 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s
```

I did not saw it coming.

## What's next

For both applications there is still room for improvements. For example, node
has the [cluster library][node-cluster] that would help to handle more
connections by spawning more processes sharing the same tcp connection.

Another good thing to do is to instrument the applications to collect
information about memory usage and function calls. The "black box" benchmark is
good and lights various insights, but to understand more, we need more
information.

Hope this example helps you, happy benchmarking!

[jcompany]: https://www.devmedia.com.br/artigo-java-magazine-64-aplicacoes-corporativas-com-jcompany-free/11397
[jee5]: https://www.ibm.com/docs/en/rsas/7.5.0?topic=applications-java-ee-overview
[k6]: https://k6.io/
[k6-plugins]: https://k6.io/docs/extensions/get-started/explore/
[golang]: https://go.dev/
[js]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[node]: https://nodejs.org
[htmx]: https://htmx.org/
[kotlin]: https://kotlinlang.org/
[javalin]: https://javalin.io/
[velocity]: https://velocity.apache.org/
[koa]: https://koajs.com
[nunjucks]: https://mozilla.github.io/nunjucks/
[app1]: https://github.com/sombriks/sample-htmx-koa
[app2]: https://github.com/sombriks/sample-htmx-javalin
[node-cluster]: https://nodejs.org/api/cluster.html#how-it-works
