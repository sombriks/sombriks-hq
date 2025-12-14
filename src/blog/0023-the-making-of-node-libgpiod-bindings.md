---
layout: blog-layout.pug
tags: 
  - posts
  - node
  - raspberry pi
  - Cpp
  - libgpiod
  - python
date: 2021-01-02
---
# Making libgpiod bindings for nodejs

One of my current hobbies is playing with [arduinos](https://www.arduino.cc/)
and [raspberry Pi](https://www.raspberrypi.org/). And sensors, leds, all fun.

On rasbperry side, i am a huge fan of the hardware, but
[i prefer fedora](https://arm.fedoraproject.org/) on the software.

Also i am a javascript guy, not a python guy. More on this ahead.

Then i got fedora properly installed, configured network
([nmcli](https://fedoraproject.org/wiki/Networking/CLI) is awesome!) and decided
to run the good old raspberry hello world example: blink.

Those nice hardware toys like arduino and rasp always present you to the
electronics by blinking a led.

This is the blink people on raspberry are pi used to run:

```python
import RPi.GPIO as GPIO    
import time                

GPIO.setmode(GPIO.BOARD)   
GPIO.setwarnings(False)           
GPIO.setup(17, GPIO.OUT)       

i = 5
while(i > 0):                      
  GPIO.output(17, 1)               
  time.sleep(1)                        
  GPIO.output(17, 0)               
  time.sleep(1)
  i = i -1
```

Quite nice, but, well, i don't like python.

Luckily there is a [npm package](https://www.npmjs.com/package/onoff) which
allow us to perform the very same task in good old javascript:

```javascript
const Gpio = require('onoff').Gpio; 
const led = new Gpio(17, 'out');      

const iv = setInterval(_ => led.writeSync(led.readSync() ^ 1), 1000);
 
// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(iv); 
  led.unexport(); 
}, 5000);
```

Life is perfect, except for one thing: both examples only works if raspberry is
running [raspbian](https://www.raspberrypi.org/software/), and, as a plus, both
depends on a
[deprecated kernel feature](https://github.com/rust-embedded/rust-sysfs-gpio/issues/38).

The new subsystem is called [libgpiod](https://git.kernel.org/pub/scm/libs/libgpiod/libgpiod.git/about/).

And fedora comes with one available for installation!

One gotcha: it does not have onoff support.

Either i embrace python or use C/C++.

So i did.

The [node-libgpiod](https://github.com/sombriks/node-libgpiod) is a nodejs addon
written in C++ to allow us to interface with libgpiod on any system with
libgpiod available.

In fact, in near future, all present GPIO libraries will need to upgrade from
sysfs-gpio to libgpiod.

Here goes the current blink using my lib:

```javascript
const { Chip, Line } = require("node-libgpiod");

const chip = new Chip(0);
const line = new Line(chip, 17); // led on GPIO17
let count = 10;

line.requestOutputMode();

const blink = () => {
  if(count){
    line.setValue(count-- % 2);
    setTimeout(blink,1000);
  } // else line.release(); 
  // not needed, libgpiod releases resources on process exit  
};

setTimeout(blink,1000);
```

It was fun to read about how to write addons for node, how to use the
[nan](https://github.com/nodejs/nan) library and also remember that we need to
respect C++. It's verbose but very very powerful.
