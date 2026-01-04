---
layout: blog-layout.pug
tags:
  - posts
  - node
  - Cpp
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

The next step is to install [node-gyp](https://github.com/nodejs/node-gyp), a
tool which enables your node project to compile addons:

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
different API's: [node-v8](https://nodejs.org/api/addons.html) or
[napi](https://github.com/nodejs/node-addon-api).

## Choosing the right API

Long story short, choose napi.

The main reason to use node-v8 api is some kind of legacy code. Other reason is
some already existing _v8-aware_ code, or some sort of existing codebase.

Plain v8 add-ons are simple, but also subject to v8 api breaking changes.

The node-v8 + [NAN](https://github.com/nodejs/nan) approach tries to make things
easier when dealing with v8, but even it still exposes the user to v8.

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

If your addon already exists but some new, complex, procedure is being created,
consider to add NAN into the mix. this is quite simple.

First, add nan to the node project:

```bash
npm i nan
```

Next step is to modify the `binding.gyp`:

```json
{
  "targets": [
    {
      "target_name": "my_project",
      "include_dirs": [
          "<!(node -e \"require('nan')\")"
      ],,
      "sources": [ "src/main.cc" ]
    }
  ]
}
```

You're good to go and use nan now. The _hello world_ example goes like this:

```cpp
#include <nan.h>

void HelloMethod(const Nan::FunctionCallbackInfo<v8::Value> &info)
{  
  info.GetReturnValue().Set(Nan::New("Hello world!").ToLocalChecked());
}

void Initialize(v8::Local<v8::Object> exports)
{
  NODE_SET_METHOD(exports, "hello", HelloMethod);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

Then you're good to compile the native part:

```bash
npx node-gyp clean configure build
```

The javascript part to perform the execution goes unchanged.

### NAPI

Now, the napi version goes through a very similar setup. You start by changing
the `binding.gyp`:

```json
{
  "targets": [
    {
      "target_name": "my_project",
      "sources": [ "src/main.cc" ],   
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "include_dirs": [
          "<!@(node -p \"require('node-addon-api').include\")"
      ]
    }
  ]
}
```

The `-fno-exceptions` flag is needed because napi is mainly a
[plain C api](https://nodejs.org/api/n-api.html). it also means that you can't
use C++ exception  in your code.

Next, install the dependency:

```bash
npm i node-addon-api
```

The code goes like this now:

```cpp
#include <napi.h>

Napi::Value HelloMethod(const Napi::CallbackInfo &info)
{
  return Napi::String::New(info.Env(), "Hello world!");
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "hello"), Napi::Function::New(env, HelloMethod));
  return exports;
}

NODE_API_MODULE(addon, Init)
```

The basic setup looks similar over each api, but the choice between should go by
the criteria discussed before: go napi for new projects, nan or bare-v8 for
existing codebases already using v8.

## Off-loading work from main event loop thread

Another item to be considered when choosing teh binding api is the need of
asynchronous processing.

It"s oddly fun that node, considered highly scalable regarding concurrent
processing, runs addons in the main thread by default.

This means that any heavy operation will block the node runtime entirely.

If you go with bare-bones node-v8, you'll be left with
[libuv](https://libuv.org/). This is not the best approach to solve heavy loads
since it's highly error-prone, so i am not even sampling it here.

You can, however, go with nan and
[Nan::AsyncWorker](https://docs.ros.org/en/indigo/api/dji_ronin/html/classNan_1_1AsyncWorker.html):

```cpp
#include <chrono>
#include <thread>
#include <nan.h>

class HeavyCalculationWorker : public Nan::AsyncWorker
{
public:
  HeavyCalculationWorker(int n, Nan::Callback *callback)
      : Nan::AsyncWorker(callback), n(n), result(0) {}

  void Execute() override;
  void HandleOKCallback() override;

private:
  int n;
  int result;
};

void HeavyCalculationCallback(const Nan::FunctionCallbackInfo<v8::Value> &info)
{
  int n = info[0].As<v8::Number>()->Value();
  v8::Local<v8::Function> cb = info[1].As<v8::Function>();

  Nan::Callback *callback = new Nan::Callback(cb);
  HeavyCalculationWorker *worker = new HeavyCalculationWorker(n, callback);
  Nan::AsyncQueueWorker(worker);
}

void HeavyCalculationWorker::Execute()
{
  this->result = this->n + this->n;
  // wait for 3 second to simulate a heavy work
  std::this_thread::sleep_for(std::chrono::seconds(3));
}

void HeavyCalculationWorker::HandleOKCallback()
{
  Nan::HandleScope scope;

  v8::Local<v8::Value> argv[] = {
      Nan::New(this->result)};

  callback->Call(1, argv, async_resource);
}

void Initialize(v8::Local<v8::Object> exports)
{
  NODE_SET_METHOD(exports, "heavyCalculation", HeavyCalculationCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

The `void HeavyCalculationWorker::Execute()` does the heavy work and then must
store the result.

In this phase, no v8 api can be accessed, since it's on another thread.

when it finishes, `void HeavyCalculationWorker::HandleOKCallback()` assumes and
can report back to the [node event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
the result of the async work.

And napi offers, of course, a similar api for the same purpose:

```cpp
#include <chrono>
#include <thread>
#include <napi.h>

class HeavyCalculationWorker : public Napi::AsyncWorker
{
public:
  HeavyCalculationWorker(Napi::Function &callback, int n);
  void Execute() override;
  void OnOK() override;

private:
  int n;
  int result;
};

HeavyCalculationWorker::HeavyCalculationWorker(Napi::Function &callback, int n)
    : Napi::AsyncWorker(callback)
{
  this->n = n;
  this->result = 0;
}

void HeavyCalculationWorker::Execute()
{
  this->result = this->n + this->n;
  // wait for 3 second to simulate a heavy work
  std::this_thread::sleep_for(std::chrono::seconds(3));
}

void HeavyCalculationWorker::OnOK()
{
  Napi::HandleScope scope(Env());
  Callback().Call({Napi::Number::New(Env(), this->result)});
}

Napi::Value HeavyCalculationCallback(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  int n = info[0].As<Napi::Number>().Int32Value();
  Napi::Function callback = info[1].As<Napi::Function>();

  HeavyCalculationWorker *worker = new HeavyCalculationWorker(callback, n);
  worker->Queue();

  return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "heavyCalculation"), Napi::Function::New(env, HeavyCalculationCallback));
  return exports;
}

NODE_API_MODULE(addon, Init)
```

## Communicating with non-v8 threads

Finally, one last potential scenario that you might face when integrating
serious native applications with node: receiving data from threads external to
the node event loop.

This is tricky, since any change in the node's current state from outside the
event loop is illegal and kills the process.

To deal with it properly, napi offers the `Napi::ThreadSafeFunction`. this class
wraps the node javascript callback in a way that it can be called properly,
without violating the event loop lifecycle:

```cpp
// src/sensor-sim-monitor.cc

#include "sensor-sim-monitor.hh"

void SensorSimMonitor::Init(Napi::Env env, Napi::Object exports)
{
  Napi::Function func = DefineClass(
      env,
      "SensorSimMonitor",
      {
          InstanceMethod("startMonitoring", &SensorSimMonitor::StartMonitoring),
          InstanceMethod("stopMonitoring", &SensorSimMonitor::StopMonitoring),
          InstanceMethod("isMonitoring", &SensorSimMonitor::IsMonitoring),
      });

  Napi::FunctionReference *constructor = new Napi::FunctionReference();
  *constructor = Napi::Persistent(func);
  env.SetInstanceData(constructor);

  exports.Set("SensorSimMonitor", func);
}

SensorSimMonitor::SensorSimMonitor(const Napi::CallbackInfo &info)
    : Napi::ObjectWrap<SensorSimMonitor>(info)
{
  this->sensorSim = nullptr;
  this->tsfn = nullptr;
}

SensorSimMonitor::~SensorSimMonitor()
{
  this->stop();
}

Napi::Value SensorSimMonitor::IsMonitoring(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  bool monitoring = false;
  if (this->sensorSim != nullptr)
  {
    monitoring = this->sensorSim->isRunning();
  }
  return Napi::Boolean::New(env, monitoring);
}

void SensorSimMonitor::StartMonitoring(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::Function jsCallback = info[0].As<Napi::Function>();

  if (this->sensorSim == nullptr)
  {
    this->sensorSim = new SensorSim();
    this->tsfn = new Napi::ThreadSafeFunction(Napi::ThreadSafeFunction::New(env, jsCallback, "SensorSimMonitor", 0, 1));
    auto dataCallback = [this](const int data)
    {
      // are we stil alive?
      if (this->tsfn == nullptr)
        return;
      this->tsfn->BlockingCall(
          new int(data),
          [](Napi::Env env, Napi::Function jsCallback, int *data)
          {
            jsCallback.Call({Napi::Number::New(env, *data)});
            delete data;
          });
    };
    this->sensorSim->start(dataCallback);
  }
  else
  {
    Napi::TypeError::New(env, "SensorSim is already running")
        .ThrowAsJavaScriptException();
  }
}

void SensorSimMonitor::StopMonitoring(const Napi::CallbackInfo &info)
{
  this->stop();
}

void SensorSimMonitor::stop()
{
  if (this->sensorSim != nullptr)
  {
    this->sensorSim->stop();
    delete this->sensorSim;
    this->sensorSim = nullptr;
  }
  if (this->tsfn != nullptr)
  {
    this->tsfn->Release();
    delete this->tsfn;
    this->tsfn = nullptr;
  }
}
```

See the complete example on the
[sample code project](https://github.com/sombriks/sample-node-addon/blob/napi-addon/src/sensor-sim-monitor.hh).

## Further reading

The power of node dwells in its simplicity and rich ecosystem. The available
addon apis for C++ adds more flexibility and ease of integration with almost any
other technology.

The napi itself is also a [plain old C api], meaning that other integrations are
possible, like [rust](https://napi.rs), [golang](https://github.com/akshayganeshen/napi-go)
and any other language able to interact with libraries exposing c-style calls.

Happy hacking!
