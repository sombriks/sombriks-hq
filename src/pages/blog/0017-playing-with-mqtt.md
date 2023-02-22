---
layout: base.webc
tags: 
  - posts
  - node
  - mqtt
date: 2019-08-03
---
# Playing with MQTT

The [mqtt protocol](https://en.wikipedia.org/wiki/MQTT) is quite cool.

It's aimed for IoT but you can do lots of other things with it.

It is lightweight.

It is [Pub/Sub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).

And you can prototype in int quite fast.

For example, in [this small project](https://github.com/sombriks/sample-mqtt) we
have a broker (server) and two clients, a publisher and a subscriber.

```javascript
// that's it, a broker
var aedes = require('aedes')()
var server = require('net').createServer(aedes.handle)
var port = 1883

server.listen(port, function () {
  console.log('server listening on port', port)
})
```

One cool thing about pub/sub is the different way that we need to think about it.
Unlike request/response, with a client and a server well-defined, on pub/sub we
have the publisher, the subscriber and the broker.

And the barriers defining one or another are quite fragile.

For example, a game server can both be a publisher as a subscriber as well. And
a temperature sensor can be a publisher announcing to a certain topic its data
but can be a subscriber to a management topic to receive proper publishing info.

It's more like a state machine.

The broker on the other hand is the common nexus between publishers and
subscribers. it's main mission i just to keep the show running, creating the
topics, properly announcing to topics new messages.

We tend to think about the broker as "the server", however it does not works as
the traditional server as seen in the client/server paradigm.

This is a publisher:

```javascript
const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", ack => {
  console.log("connected!");

  setInterval(_ => {
    client.publish("test", "Hello mqtt " + new Date().getTime());
  }, 3000);
});

client.on("error", err => {
  console.log(err);
});
```

And this is a subscriber:

```javascript
const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", ack => {
  console.log("connected!");
  // console.log(ack);
  client.subscribe("test", err => {
    console.log(err);
  });

  client.on("message", (topic, message) => {
    console.log(topic);
    // message is Buffer
    console.log(message.toString());
  });
});

client.on("error", err => {
  console.log(err);
});
```

There is
[pretty good materials](https://randomnerdtutorials.com/what-is-mqtt-and-how-it-works/)
explaining the internals of the protocol, And the
[aedes broker](https://github.com/mcollina/aedes) implementation is the current
state of the art in nodejs world.

---
Tags:
{%- for tag in tags -%}
[{{tag}}](/blog/?tag={{tag | slugify}})
{%- endfor -%}
