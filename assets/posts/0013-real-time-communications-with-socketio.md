# Real-time communications with Socket.io

You see, most of the internet is built around the request/response abstraction.

But there is also other nice philosophies like pub/sub. Google it if you never
heard about it, trust me it worths the shot.

One of major benefits of pub/sub is the active role publishers have. On 
request/response paradigm, the server only answers when someone asks for
something (a page, image, etc). Publishers on the other hand know who is
interested in a certain topic and send updates to these subscribers whenever new
content arrives at the topic.

On this post we'll make a small ~~chat app~~ _game_ to demonstrate how to use
the [socket.io](https://socket.io) node library.  
