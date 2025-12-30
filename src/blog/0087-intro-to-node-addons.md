---
layout: blog-layout.pug
tags:
  - posts
  - node
  - cpp
  - addon
  - nan
  - napi
date: 2025-12-30
---
# A gentle introduction to node C++ addons

Node.js is a handy, powerful runtime to develop solutions quickly with minimum
effort. But whenever you need a specific integration or faces critical,
performance-demanding operations, it might not look good enough. Unless you
extend it with a high performance, native C++ addon. Here's how to do it the
proper way.

## Requirements

In order to write native addons for node, you need note runtime itself, but also
development tools and packages for native extensions.

In a linux environment, you can get it like this:

```bash
# fedora
sudo dnf install @development-tools g++ nodejs nodejs-devel
```

Next, Create a regular npm project:

```bash
mkdir my-project
cd my-project
npm init -y
npm pkg set type=module
```

The next step is to install [node-gyp], a tool which enables your node project
to compile addons:

```bash
npm i node-gyp bindings
```

After install it, node-gyp demands a configuration file for native code setup
and tools configuration. create a file called `binding.gyp`:

```bash
touch binding.gyp
```

This is a json file, fill it with this initial content:

```json
{
  "targets": [
    {
      "target_name": "my_project",
      "sources": [ "src/main.cc" ]
    }
  ]
}
```

Then we hit a crossroads. The native part can be implemented in C++ using two
different API's: [node-v8] or [napi].

## Choosing the right API

Long story short, choose napi.

The main reason to use node-v8 api is some kind of legacy code. Other reason is
some already existing _v8-aware_ code, or some sort of existing codebase.

Plain v8 add-ons are simple, but also subject to v8 api breaking changes.

The node-v8 + [NAN] approach tries to make things easier when dealing with v8,
but even it still exposes the user to v8.

On the other hand, napi promises not only a stable api, but also a stable abi,
which means that an addon can be precompiled and run across different node
versions.

Now, let's check some hello worlds to better understand the differences between
the available apis.

### Bare-bones node-v8

This is still relevant because it is very straight-forward.

Create the source file configured on binding.gyp and a js file:

```bash
mkdir src
touch src/main.cc
touch index.js
```

The C++ code goes like this:

```cpp
#include <node.h>

void HelloMethod(const v8::FunctionCallbackInfo<v8::Value> &args)
{
  v8::Isolate *isolate = args.GetIsolate();
  args.GetReturnValue()
      .Set(v8::String::NewFromUtf8(isolate, "Hello world!").ToLocalChecked());
}

void Initialize(v8::Local<v8::Object> exports)
{
  NODE_SET_METHOD(exports, "hello", HelloMethod);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

Next, invoke node-gyp to build the native addon:

```bash
npx node-gyp configure
npx node-gyp build
```

in the `index.js`:

```javascript
// index.js
import bindings from "bindings"

const addon = bindings("my_project")

console.log(addon.hello())
// node index.js
```

For very simple addons, bare node-v8 delivers the simples setup possible.

### NAN

### NAPI

### Off-loading work from main event loop thread

### Communicating with non-v8 threads

## Further reading
