---
layout: blog-layout.pug
tags:
  - posts
  - long-rant
  - tutorial
  - zig
date: 2026-07-05
draft: false
---
# [my-zig-handbook][repo]

My study notes on [Zig][Zig], the _better than C_ programming language.

[Zig]: https://ziglang.org

## Agenda

- Introduction
- Installation
- 01: Hello World
- 02: Basic Types
- 03: Control Flow
- 04: Arrays and Structs
- 05: Pointers and memory allocation
- 06: Modules and Functions
- 07: Basic Input
- 08: Basic Output (Files)
- 09: Error Handling
- 10: Tests
- 11: Generic Types
- 12: Project Setup
- 13: Threads
- 14: Networking
- 15: List and Map
- 16: Zig As A C Compiler
- 17: Databases
- 18: Is it worth learning Zig
- Conclusion

## Introduction

Over the years i studied a few languages in order to have fun and to pay my
rent.

Get into computers, like any other career, is like joining an ongoing party: a
lot is happening, a lot already happened, no real need to understand everything,
but you start to get it, over time, little by little.

At first i learned [java][java], like everyone else. Then
[javascript][javascript], because of a technology limitation in the client. Then
[sql][sql]. Then [C++][cpp]. And so on.

[java]: https://dev.java

[javascript]: https://developer.mozilla.org/docs/Web/JavaScript

[sql]: https://learnsql.com

[cpp]: https://cppreference.com/

Each language, along with its associated runtimes and ecosystems, had a specific
target problem. And over the years i started to figure out which tool is best
suited for the current problem.

This skill also evolved into the intuition of what skill should i master in
order to properly solve a problem.

So here we are, looking at another nice tool to add into the tool belt.

### Why Zig?

In a world full of good hammers, why choose a new one? Are the old tools
broken, inefficient, or something?

Mot really. In fact, the hammers aren't the problem. The nail that keeps
changing.

Once a problem is solved, a new objective emerges and life goes on. Therefore,
it's natural to keep checking on new ways to solve problems.

But an old tool doesn't get automatically unusable. In fact, there are lots of
solutions written in java that i am still willing to maintain. Several problems
that i still consider to use [golang][golang] if i have the opportunity, and
would still choose [vue][vue] over [htmx][htmx], depending on the context. It is
a matter of picking the best possible combination of tools for a given problem.

[golang]: https://golang.org

[vue]: https://vuejs.org

[htmx]: https://htmx.org

That said, where do i think that Zig fits?

The language promises **performance**, **developer experience** and an
impressive **C interoperability**. It also doubles as a **robust build system**,
compatible with existing codebases.

The C ABI compatibility is also an interesting offer because it opens to Zig
Projects a wide range of library options, ready to use.

So, at first, zig looks like a nice option to write code to run in the
middleware, between a client application and a database or a specialized
system, assuming the scenario of usual enterprise solutions. Of course, zig
promises also systems, low-level, cross-platform and embedded capabilities, and
that would be cool to explore as well.

The language also offers a solid development philosophy. No hidden flows. No
implicit allocations/deallocations. All must be expressed in an explicit way.

Because of this, careless memory management can be captured at compile time,
getting rid of a whole class of bugs possible in C or C++ projects.

The manual memory management also means that, unlike java or golang, the code
is highly predictable: no gc pauses to clean things up.

The explicitness baked in zig also means that there is no such thing as higher
abstractions like classes or function overloading. In fact, the language
relates more to C or rust instead of java, golang, or C++.

This does not mean that zig has little expressiveness. in fact, concepts like
[generics][generics], [null-safe][null-safe] operations, sophisticated
[error handling][error handling], even [reflection][reflection] are
available as key parts of the language.

[generics]: https://devdocs.io/zig/index#Generic-Data-Structures

[null-safe]: https://devdocs.io/zig/index#Optionals

[error handling]: https://devdocs.io/zig/index#Errors

[reflection]: https://ziglang.org/documentation/master/#Function-Reflection

Moreover, in zig is straightforward the use of C libraries, opening a rich
ecosystem from day zero of any project.

Zig also doubles as a build system, where the build script is written in zig
itself, and given the high portability and ease of installation of its
runtime, makes it an ideal tool for projects that aren't necessarily are zig
projects: remember, zig is also a C compiler.

## Installation

Since i am running [fedora][fedora], all i need to do to get zig into my system
is:

```bash
sudo dnf install zig
```

[fedora]: https://getfedora.org

One extra tool that will help is the [zls][zls], a language server to the Zig
language, so you get autocomplete working in lightweight text editors, such as
[kate][kate].

[zls]: https://github.com/zigtools/zls

[kate]: https://apps.kde.org/pt-br/kate/

## 01: Hello World

So, let's say hello:

```zig
// 1-hello-world.zig
const std = @import("std");

pub fn main() void {
    std.log.info("Hello world!",.{});
}
```

To execute this, simply run:

```bash
zig run 1-hello-world.zig
```

For proper compilation, call it with `build-exe`:

```bash
zig build-exe 1-hello-world.zig
./1-hello-world
```

This hello world has nothing special, except for the use of the built-in log
library instead of direct use of the standard output stream. So it's closer to a
[node.js][node.js] hello world than a C hello world.

[node.js]: https://nodejs.org

An alternative, closer to native languages, would be like this:

```zig
// 2-hello-world.zig
const std = @import("std");

pub fn main(init: std.process.Init) !void {
    try std.Io.File.stdout()
    .writeStreamingAll(init.io,"Hello, world!\n");
}
```

_So, what is happening here? I just wanted a hello world!_

Instead, the design choice of be highly explicit surfaces:

- The standard output belongs to the IO subsystem
- We need an io context (`init.io`) to perform io operations
- We stream to the output so we don't need to handle a buffer and a writer

it affects the main function signature even, demanding it to be more explicit
about the possible errors, adding !void as the return type, and declaring the
init parameter so we get some goodies ready to use.

We even need to call the function using [try][try], since the io operation
might return an error.

[try]: https://zig.guide/language-basics/errors/

A third option is this one:

```zig
// 3-hello-world.zig
const std = @import("std");

pub fn main() void {
    std.debug.print("Hello world!\n",.{});
}
```

In short, explicitness does not need to translate as complexity.

## 02: Basic types

Types are powerful expression features in every language. Thanks to them, you
don't need to track yourself memory offsets. Remember, the memory is just a
glorified list of bits, often grouped in chunks of bytes.

This is why the type names in zig are as explicit as possible.

### Integers

The list of asic integers follows: `i8`, `i16`, `i32`, `i64` and `i128`. Those
types can hold the entire range of positive and negative numbers possible to
represent using the number of bytes presented after the _i_ letter.

If you need to represent only positive integers, then the types are `u8`,`u16`,
`u32`, `u64` and `u128`.

### Floating point number

You guessed: `f8`, `f16`, `f32`, `f64` and `f128`.

### Boolean

Just one bit, but here you write `true` or `false`.

### Custom bit sizes

Another interesting feature of zig's type system is custom-sized types. For
example, let's represent a type able to hold **8** distinct values. To make it
sol, all you need is **3 bits**, so declare `var x: u3 = 0;` is a complete
valid statement.

### Small tour on types

This is a small sample of how those types behave:

```zig
// 1-sample-types.zig

pub fn main() u8 {
    const std = @import("std"); // valid code!
    var x: u8 = 255;
    std.log.debug("x value: {}", .{x});
    std.log.debug("x type: {}", .{@TypeOf(x)});// reflection!
    std.log.debug("x size: {}", .{@sizeOf(u8)}); // size in bytes
    x +%= 1; // overflow-aware add operator
    // a bigger variable
    var y: i16 = 255;
    std.log.debug("y value: {}", .{y});
    std.log.debug("y type: {}", .{@TypeOf(y)});
    std.log.debug("y size: {}", .{@sizeOf(i16)});
    y += 1; // no need to worry about overflows for now
    std.log.debug("y value: {}", .{y});
    // now some jazz
    var z: u3 = 0;
    std.log.debug("z value: {}", .{z});
    std.log.debug("z type: {}", .{@TypeOf(z)});
    std.log.debug("z size: {}", .{@sizeOf(u3)});
    z +%= 1;
    std.log.debug("z value: {}", .{z});
    z +%= 2;
    std.log.debug("z value: {}", .{z});
    z +%= 4;
    std.log.debug("z value: {}", .{z});
    z +%= 6;
    std.log.debug("z value: {}", .{z}); // surprise!
    return x; // returns 0
}
```

## 03: Control Flow

In zig, control flow is pretty straightforward, with a few improvements when
compared with C.

### Conditionals

`if` statements are straightforward, with some neat [unboxing][unboxing]
features:

[unboxing]: https://zig.guide/language-basics/optionals/

```zig
// 1-control-flow.zig
const std = @import("std");
const print = std.debug.print;

pub fn main() void {
    // classic conditional
    if(true) print("This happens\n",.{});
    if(false) print("This never happens\n",.{});
    // conditional expression (ternary operator replacement)
    var x: u8 = if(true) 2 else 4;
    print("x: {}\n", .{x});
    x+=1;
    x = if (x % 2 == 0) 4 else 7;
    print("x: {}\n", .{x});
    // unwrapping optional
    // if a variable can assume null values, the type must make it explicit:
    var yMaybe: ?u8 = null;
    // conditionals can check for the value presence
    if (yMaybe) |y| {
        print("This never happens {}\n", .{y});
    }
    yMaybe = 10;
    if (yMaybe) |y| {
        print("This optional has value {}\n", .{y});
    }
}
```

`switch` statements:

```zig
// 2-control-flow.zig

const std = @import("std");
const print = std.debug.print;

pub fn main() void {
    const number = 1221;
    // switch as statement
    switch(number) {
    // specific value
        1 => print("is that really random?\n",.{number}),
        // possible values
        2,3,4,5 => print("not my options.\n",.{number}),
        // value range
        10...30 => print("not my range.\n",.{number}),
        // mix things, blocks are allowed too
        0, 31...51 => {
            print("this is a big number.\n",.{number});
            print("it is.\n", .{});

        },
        else => print("and everything else\n", .{})
    }

    // switch as expressions
    const status: u16 = 404;
    const message = switch (status) {
        200 => "Success",
        401 => "Unauthorized",
        404 => "Not Found",
        else => "Unknown Status",
    };
    print("message: {s}\n", .{message});
}
```

### Loops

`while` statements / expressions:

```zig
// 3-control-flow.zig
const std = @import("std");

pub fn main() void {
    // lawful good
    var i: u8 = 1;
    while (i <= 5) {
        std.log.info("i : {}", .{i});
        i += 1;
    }
    // true neutral
    var j: u8 = 5;
    while(j > 0) : (j -= 1) {
        std.log.info("j : {}", .{j});
    }
    // chaotic evil
    var k: u8 = 0;
    const f: u8 = while(k < 50) : (k = k + 3) {
        if (k > 10) break k;
    } else 4;
    std.log.info("k : {}, f: {}", .{k,f});
}
```

`for` statements:

```zig
// 4-control-flow.zig

const std = @import("std");

pub fn main() void {
    // loop over ranges
    for (0..3) |i| {
        std.log.info("i: {}",.{i});
    }
    // loop over collections
    const names = [_][]const u8{"a","b","c","banana"};
    for(names) |name| {
        std.log.info("name: {s}",.{name});
    }
    // multiple collections
    const integers = [_]u16{1,6,33,9,2,567};
    const floats = [_]f16{1.1,6.4,-33.555,9.1,-2.1111,567.8};
    for(integers,floats) |i,f| {
        std.log.info("numbers: [{}] [{}]",.{i,f});
    }
    // collections and ranges
    for(names,0..) |name, i| {
        std.log.info("i, name: [{}]: [{s}]",.{i,name});
    }
    // pointer to collection change
    var samples = [_]i32{ 1, 1, 1, 1, 1 };
    for(&samples) |*sample| {
        sample.* *= 2;
    }
    std.log.info("Modified array: {any}", .{samples});
    // for loop expression (break to value)
    const x = for(11..111) |i| {
        if (i % 31 == 0) break i;

    } else 123;
    std.log.info("x: {}", .{x});
}
```

## 04: Arrays and Structs

Let's talk a little about composite data types.

### Arrays

Arrays are homogeneous composite data.

```zig
// 1-arrays-and-structs.zig
const xpto = @import("std");

pub fn main() void {
    //basic array usage
    var numbers = [5]u8{1,2,3,4,5};
    xpto.log.info("numbers {any}", .{numbers});
    numbers[0] = 20;
    xpto.log.info("numbers[0] {}", .{numbers[0]});
    // array size inference
    const numbers2 = [_]u8 {10,11,23};
    xpto.log.info("numbers2 {any}", .{numbers2});
    // array concatenation
    const numbers3 = numbers ++ numbers2;
    xpto.log.info("numbers3 {any}", .{numbers3});
    xpto.log.info("type of numbers3 {}", .{@TypeOf(numbers3)});
    xpto.log.info("size of numbers3 {}", .{@sizeOf(@TypeOf(numbers3))});
    // array "multiplication"
    const numbers4 = [_]u16{2} ** 10;
    xpto.log.info("numbers4 {any}", .{numbers4});
    xpto.log.info("type of numbers4 {}", .{@TypeOf(numbers4)});
    xpto.log.info("size of numbers4 {}", .{@sizeOf(@TypeOf(numbers4))});
    xpto.log.info("length of numbers4 {}", .{numbers4.len});
    // slices
    const slice1 = numbers3[2..7];
    xpto.log.info("slice1 {any}", .{slice1});
    xpto.log.info("type of slice1 {}", .{@TypeOf(slice1)});
    xpto.log.info("size of slice1 {}", .{@sizeOf(@TypeOf(slice1))});
    xpto.log.info("length of slice1 {}", .{slice1.len});
    const slice2 = numbers3[6..];
    xpto.log.info("slice2 {any}", .{slice2});
    xpto.log.info("type of slice2 {}", .{@TypeOf(slice2)});
    xpto.log.info("size of slice2 {}", .{@sizeOf(@TypeOf(slice2))});
    xpto.log.info("length of slice2 {}", .{slice2.len});
}
```

### Structs

Structs and tuples are heterogeneous.

```zig
// 2-arrays-and-structs.zig

const std = @import("std");

// basic declaration
const TodoItem = struct { description: []const u8, done: bool = false };

pub fn main() void {
    var item1 = TodoItem{ .description = "walk the dog" };
    const item2 = TodoItem{ .description = "wash dishes", .done = true };
    std.log.info("item 1 {s}, {}", .{ item1.description, item1.done });
    std.log.info("item 2 {s}, {}", .{ item2.description, item2.done });
    const item3 = item1; // copy value
    item1.done = true;
    std.log.info("item 1 {s}, {}", .{ item1.description, item1.done });
    std.log.info("item 3 {s}, {}", .{ item3.description, item3.done });
    std.log.info("item 3 type: {}", .{@TypeOf(item3)});
    std.log.info("item 3 size: {}", .{@sizeOf(@TypeOf(item3))});
    std.log.info("item 2 size: {}", .{@sizeOf(@TypeOf(item2))});
    std.log.info("item 1 size: {}", .{@sizeOf(@TypeOf(item1))});
    // coercion / duck typing
    const item4: TodoItem = .{ .description = "read a book" };
    std.log.info("item 4 {s}, {}", .{ item4.description, item4.done });
    // tuples, kinda arbitrary list values
    const stuff = .{1, "foo", 0o55, 0b11010001, 0xAE, item4, @TypeOf(item2)};
    std.log.info("stuff: {any}", .{ stuff });
}
```

### Namespace and Member functions

If you define a function inside a struct, it will act as a
[namespace][namespace] and will help to avoid name clashes.

[namespace]: https://en.wikipedia.org/wiki/Namespace

Defining functions with [special signatures][member-functions] inside a
namespace/struct grants them the special status of **member functions**:

[member-functions]: https://zig.guide/language-basics/structs

```zig
// 3-arrays-and-structs.zig

const std = @import("std");

const N1 = struct {
    fn foo(m: []const u8) void {
        std.log.info("N1.foo {s}",.{m});
    }
};

const N2 = struct {
    fn foo(m: []const u8) void {
        std.log.info("N2.foo {s}",.{m});
    }
};

const Vec3 = struct {
    x: i128 = 0,
    y: i128 = 0,
    z: i128 = 0,
    // a member function which read-only access
    fn inverse(v: Vec3) Vec3 {
        return Vec3{.x=-v.x, .y=-v.y, .z= -v.z};
    }
    // a member function able to change the instance
    fn invert(v: *Vec3) void {
        v.*.x = -v.*.x;
        v.*.y = -v.*.y;
        v.*.z = -v.*.z;
    }
    fn print(v:  *const Vec3) void {
        std.log.info("vector: {*}({},{},{})", .{v, v.*.x, v.*.y, v.*.z});
    }
};

pub fn main() void {
    // both functions has the same name
    N1.foo("bar");
    N2.foo("baz");
    var v1 = Vec3{.x=1};
    v1.print();
    // member functions
    var v2 = v1.inverse();
    v2.print();
    v1.invert();
    v1.print();
}
```

Note that syntax sugar does not conflict with the explicit control philosophy
of the language.

## 05: Pointers and memory allocation

So far, this tour on zig features passed all operations possible on memory
residing on stack. Now let's see how to handle dynamic memory allocations.

As i mentioned before, There is no garbage collector in zig. Instead, the
language of in its design explicit ways to properly manage dynamic memory:
[allocators][allocators].

[allocators]: https://zig.guide/standard-library/allocators/

The Zig standard library provides a pattern for allocating memory, which allows
the programmer to choose precisely how memory allocations are done within the
standard library. No allocations happen behind your back!

This is where zig really shines: several allocators are available, and the
control over memory and leak detection makes it easier to write good quality
software.

```zig
// 1-pointers-and-dynamic-memory.zig

const std = @import("std");
const info = std.log.info;

pub fn main() void {
    // general purpose allocator
    var gpa: std.heap.DebugAllocator(.{}) = .init;
    const allocator = gpa.allocator();
    defer _ = gpa.deinit();
    var data = allocator.alloc(u128, 100) catch unreachable;
    for (0..100) |i| {
        data[i] = i;
    }
    std.log.info("data: {any}", .{data});
    // oops, forgot to free
    // allocator.free(data);
}
```

The example above works but ends in a thing that i didn't face so far when
dealing with zig: a runtime error!

Pointer operations are straight forward:

```zig
// 2-pointers-and-dynamic-memory.zig

const std = @import("std");
const info = std.log.info;

pub fn main() void {
    // single-item pointers
    var x: i16 = 4;
    var y = &x;
    std.log.info("x: {}, y: {}", .{ x, y.* });
    y.* = 6;
    std.log.info("x: {}, y: {}", .{ x, y.* });
    var z: i16 = 10;
    y = &z;
    std.log.info("x: {}, y: {}, z: {}", .{ x, y.*, z });
    z = 29;
    std.log.info("x: {}, y: {}, z: {}", .{ x, y.*, z });
    // multiple items pointers
    var buffer: [10]i32 = undefined; // surprise values
    var ptr: [*]i32 = &buffer;
    ptr[0] = -11;
    std.log.info("buffer: {any}, \nptr: {*}", .{ buffer, ptr });
    // this one does not compile
    // std.log.info("buffer: {}, \nptr: {any}", .{ buffer.len, (ptr.*).len });
    buffer[1] = 11;
    std.log.info("buffer: {any}, \nptr: {*}", .{ buffer, ptr });
    // slices / fat pointers
    var slice: []i32 = buffer[0..6];
    std.log.info("slice: {any}", .{slice});
    slice[2] = 44;
    std.log.info("buffer: {any}", .{buffer});
    // optional pointer wrapper
    // this does not compile
    // var ptr2: *u8 = null;
    var ptr2: ?*u8 = null;
    var value: u8 = 10;
    // this causes a runtime error
    // std.log.info("ptr2: {}, value: {}", .{ ptr2.?.*, value });
    ptr2 = &value;
    std.log.info("ptr2: {}, value: {}", .{ ptr2.?.*, value });
    // safe way to access optionals
    if(ptr2) |p| {
        p.* = 11;
        std.log.info("ptr2: {}, value: {}", .{ p.*, value });
    }
}
```

## 06: Modules and Functions

In zig, modules work pretty much like [node.js][node.js] modules. All file
contents are private except if marked as public, with the `pub` keyword.

We must use the `@import` built-in function to look for modules:

```zig
// 1-modules-and-functions.zig
const std = @import("std");

pub fn main() void {
    // import a module
    const Module1 = @import("my-function.zig");
    const add = Module1.add;

    std.log.info("type of add: {}", .{@TypeOf(add)});
    std.log.info("add 2+3: {}", .{add(2,3)});

    const Module2 = @import("./my-struct.zig");
    const p1: Module2.Player = .{};

    std.log.info("type of p1: {}", .{@TypeOf(p1)});

    const Player = Module2.Player;
    const p2: Player = undefined;

    std.log.info("type of p2: {}", .{@TypeOf(p2)});

    // this does not compile at all
    // const hidden = Module1.hidden;
}

```

## 07: Basic Input

Classically, there are 3 main options to pass input to a program: environment
variables, arguments and pipe/stdin.

### The 'Juicy Main'

Zig versions older than 0.16.0 exposed arguments and environment variables via
global state inside the std library. Starting from 0.16, the
_[juicy main][juicy-main]_ changes that.

[juicy-main]: https://ziglang.org/download/0.16.0/release-notes.html#Juicy-Main

This small example shows how to get environment variables:

```zig
// 1-basic-input.zig
const std = @import("std");

pub fn main(init: std.process.Init) void {
    const name = init.environ_map.get("USER") orelse "stranger";
    std.log.info("hello, {s}!",.{name} );
}
```

This is how you get Command line arguments:

```zig
// 2-basic-input.zig
const std = @import("std");

pub fn main(init: std.process.Init) void {
    const args = init.minimal.args.vector;
    std.log.info("number of arguments: {}",.{args.len});
    for(args) |arg| std.log.info("{s}",.{arg}); // noice!
}
```

Finally, _stdin_ data input can be done like this:

```zig
// 3-basic-input.zig

const std = @import("std");

pub fn main(init: std.process.Init) !void {
    // the secret number to guess
    const number = 4;
    std.log.debug("Guess the number:",.{} );
    // setup io subsystem
    const io = init.io;
    var buf: [32]u8 = @splat(0);
    const stdin = std.Io.File.stdin();
    var reader = stdin.reader(io, &buf);
    // call the reader
    const guess = try reader.interface.takeDelimiter('\n') orelse "";
    // convert the string into number
    const result = try std.fmt.parseInt(u8, guess, 10);
    std.log.debug("Number: {}, Result: {}",.{number, result});
}
```

And Zig exposes this philosophy of explicitness again. But once set, the
readline api and the number format api shine its ergonomics.

## 08: Basic Output

This is a simple 'file hello world':

```zig
// 1-basic-output.zig

const std = @import("std");

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const cwd = std.Io.Dir.cwd();
    const file = try cwd.createFile(io, "output.txt", .{});
    defer file.close(io);
    try file.writeStreamingAll(io, "Hello from Zig land!\n");
}
```

### Read and write arrays

Write chunks of data involves properly handling the type sizes:

```zig
// 2-basic-output.zig
const std = @import("std");

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const cwd = std.Io.Dir.cwd();
    // let's produce some numbers
    var numbers: [100]i128 = undefined;
    for (&numbers, 0..) |*num, i| {
        num.* = @intCast(i * 5000); // Exemplo: 0, 5000, 10000, etc.
    }
    // prepare the file
    const file = try cwd.createFile(io, "numbers.bin", .{});
    defer file.close(io);
    // convert into bytes for write it correctly
    const bytes = std.mem.sliceAsBytes(&numbers);
    try file.writeStreamingAll(io, bytes);
}
```

In order to read it back:

```zig
// 3-basic-output.zig
const std = @import("std");

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const cwd = std.Io.Dir.cwd();

    // 1. Open the existing binary file for reading
    const file = try cwd.openFile(io, "numbers.bin", .{ .mode = .read_only });
    defer file.close(io);

    // 2. Prepare the destination array of 100 i128 elements
    var numbers: [100]i128 = undefined;

    // 3. Cast the destination memory area into a slice of raw bytes.
    // Wrap and cast it to the desired reading buffer geometry
    const buffer = std.mem.sliceAsBytes(&numbers);
    const wrap = @as([]const[]u8,&.{buffer});

    // 4. Read data sequentially until the buffer is completely filled
    // This expects exactly 1600 bytes (100 positions * 16 bytes each)
    const bytesRead =  try file.readStreaming(io, wrap);

    // 5. Verify the results by printing the first and last positions
    std.log.info("Bytes read: {}",.{bytesRead});
    std.log.info("Successfully loaded {d} i128 integers!", .{numbers.len});
    std.log.info("First number (index 0): {d}", .{numbers[0]});
    std.log.info("Last number (index 99): {d}", .{numbers[99]});
}
```

See, the explicit control starts paying the extra effort. We just serialized,
cast, and translated pieces of memory to anytthing we want with little
trouble.

### Read and write structs

Like arrays, we can serialize structs with a similar approach:

```zig
// 4-basic-output.zig

const std = @import("std");

pub const TodoItem = struct {
    description: [256]u8,
    done: bool,
};

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const cwd = std.Io.Dir.cwd();

    // 1. Prepare 10 TodoItems
    var todos: [10]TodoItem = undefined;
    for (&todos, 0..) |*item, i| {
        // Fill description with some text
        var desc: [256]u8 = @splat(0);
        const text = "Todo item number ";
        std.mem.copyForwards(u8, desc[0..text.len], text);
        desc[text.len] = @intCast('0' + i);

        item.* = .{
            .description = desc,
            .done = i % 2 == 0,
        };
    }

    // 2. Create the file todos.bin
    const file = try cwd.createFile(io, "todos.bin", .{});
    defer file.close(io);

    // 3. Serialize the array to bytes and write to file
    const bytes = std.mem.sliceAsBytes(&todos);
    try file.writeStreamingAll(io, bytes);

    std.log.info("Successfully serialized 10 TodoItems to todos.bin", .{});
}
```

And Deserialization goes like this:

```zig
// 5-basic-output.zig

const std = @import("std");
const sample = @import("4-basic-output.zig");
const TodoItem = sample.TodoItem;

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const cwd = std.Io.Dir.cwd();

    // 1. Open the existing binary file for reading
    const file = try cwd.openFile(io, "todos.bin", .{ .mode = .read_only });
    defer file.close(io);

    // 2. Prepare the destination array of 10 TodoItem elements
    var todos: [10]TodoItem = undefined;

    // 3. Cast the destination memory area into a slice of raw bytes
    const buffer = std.mem.sliceAsBytes(&todos);
    // wrap and cast it to the desired reading buffer geometry
    const wrap = @as([]const []u8, &.{buffer});

    // 4. Read data sequentially until the buffer is completely filled
    const bytesRead = try file.readStreaming(io, wrap);

    // 5. Verify the results by printing the items
    std.log.info("Bytes read: {}", .{bytesRead});
    std.log.info("Successfully loaded {d} TodoItems!", .{todos.len});

    for (todos, 0..) |item, i| {
        // Find the actual end of the description string (null-terminated)
        const desc_len = std.mem.indexOfScalar(u8, &item.description, 0) orelse item.description.len;
        const description = item.description[0..desc_len];
        std.log.info("Item {d}: description='{s}', done={}", .{ i, description, item.done });
    }
}
```

### Unicode Text

While read and write operations do not care about what kind of data is being
serialized, Unicode text needs special care when you need to deal with
codepoints properly:

```zig
// 6-basic-output.zig

const std = @import("std");

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const cwd = std.Io.Dir.cwd();
    // given this nice string
    const hello = "😄🎵▒🕹🌊▒🖳🧸▒";
    std.log.info("{s}, length {}", .{ hello, hello.len });
    // let's write it to a file
    try cwd.writeFile(io, .{ .sub_path = "sample-unicode.txt", .data = hello });
    // and read it back
    var buffer: [hello.len]u8 = undefined;
    _ = try cwd.readFile(io, "sample-unicode.txt", &buffer);
    std.log.info("read back as {s}", .{buffer});
    // get the size in unicode codepoints
    const size = try std.unicode.utf8CountCodepoints(&buffer);
    std.log.info("number of letters: {}", .{size});

    // loop over each unicode codepoint, one at a time
    var utf8_view = try std.unicode.Utf8View.init(&buffer);
    var iterator = utf8_view.iterator();
    var i: usize = 0;
    while (iterator.nextCodepointSlice()) |codepoint| {
        std.log.info("Codepoint {d}: {s}", .{ i, codepoint });
        i += 1;
    }
}
```

## 09: Error Handling

Another topic where zig shines is the architectural design of error handling.

In zig, errors are values, and if a function might produce an error, it must
inform you at compile time that an error might be returned.

This is what `!void` that appears sometimes in the examples mean.

Since errors are values, your program **must** deal with them: catching, passing
it forward in the call chain, deliberately ignoring it or unwrapping it.

### Errors as Values

For example:

```zig
// 1-error-handling.zig

const std = @import("std");

pub fn main(init: std.process.Init) void {
    const stdin = std.Io.File.stdin();
    defer stdin.close(init.io);
    var buffer: [1024]u8 = @splat(0);
    const errorOrBytesRead = stdin.readStreaming(init.io,&.{&buffer});
    std.log.info("Returned tytpe: {any}", .{@TypeOf(errorOrBytesRead)});
    std.log.info("Returned value: {any}", .{errorOrBytesRead});
    std.log.info("Bytes in the buffer {s}", .{buffer});
    // to properly access the returned value, if successful, inwrap it:
    if (errorOrBytesRead) |bytesRead| {
        const minusLineBreak = bytesRead - 1;
        std.log.info("bytes read: {}", .{minusLineBreak});
    } else |err| std.log.info("Something went wrong: {}", .{err});
}
```

In this first example, the error comes wrapped, and although life would simply
go on if we didn't mind looking at it, we can deal with it as if it was an
[optional value][optional-value].

[optional-value]: https://zig.guide/language-basics/optionals/

### Catch errors

An alternative and more concise idiom is the [error catching][error-catch]. Use
it to completely ignore the error (at your own risk, of course):

[error-catch]: https://zig.guide/language-basics/errors

```zig
// 2-error-handling.zig

const std = @import("std");

pub fn main(init: std.process.Init) void {
    const stdin = std.Io.File.stdin();
    defer stdin.close(init.io);
    var buffer: [1024]u8 = @splat(0);
    const bytesRead = stdin.readStreaming(init.io, &.{&buffer}) catch unreachable;
    std.log.info("Returned tytpe: {any}", .{@TypeOf(bytesRead)});
    std.log.info("Returned value: {any}", .{bytesRead});
    std.log.info("Bytes in the buffer {s}", .{buffer});
}

```

Instead, if you want to deal with the error, add a capture block to the catch:

```zig
// 3-error-handling.zig

const std = @import("std");

pub fn main(init: std.process.Init) void {
    const stdin = std.Io.File.stdin();
    defer stdin.close(init.io);
    var buffer: [1024]u8 = @splat(0);
    const bytesRead = stdin.readStreaming(init.io, &.{&buffer}) catch |err| {
        std.log.err("this shouldn't happen: {any}", .{err});
        return; // end the function here
    };
    std.log.info("Returned tytpe: {any}", .{@TypeOf(bytesRead)});
    std.log.info("Returned value: {any}", .{bytesRead});
    std.log.info("Bytes in the buffer {s}", .{buffer});
}
```

### Try

The other option is, of course, make the error a problem to someone else.

The `try` clause does that:

```zig
// 4-error-handling.zig

const std = @import("std");

pub fn main(init: std.process.Init) !void {
    const stdin = std.Io.File.stdin();
    defer stdin.close(init.io);
    var buffer: [1024]u8 = @splat(0);
    const bytesRead = try stdin.readStreaming(init.io, &.{&buffer});
    std.log.info("Returned tytpe: {any}", .{@TypeOf(bytesRead)});
    std.log.info("Returned value: {any}", .{bytesRead});
    std.log.info("Bytes in the buffer {s}", .{buffer});
}
```

The difference is sutile, but now the error, if it happens, will be passed to
the function caller.

### How to pass errors

And you can produce errors too, and it's quite simple:

```zig
// 5-error-handling.zig

const std = @import("std");

// let's invent some errors
const Err = error{OhNo, OhGod};

// our function might produce errors
fn roulette(number: u128) !void {
    if(number % 6 == 0) return Err.OhNo;
    if(number % 11 == 0) return Err.OhGod;
}

pub fn main() void {
    for(0..100) |i| {
        roulette(i) catch |err| {
            // deal with each error type
            switch(err) {
                Err.OhGod => std.log.warn("{} at {}", .{err, i}),
                else => std.log.warn("{} at {}", .{err, i})
            }
        };
    }
}
```

I think that this is the kind of thing that makes Zig worth using on your
next project. Error handling is what really matters in complex projects.

## 10: Tests

Zig has a built-in test runner, like any serious language should offer in the
standard library.

The same way you run code with `zig run`, you test with `zig test`.

Here's a simple example:

```zig
// 1-tests.zig

const std = @import("std");
const expect = std.testing.expect;

fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "expect add to work" {
    try expect(add(2, 3) == 5);
}
```

And run with:

```bash
zig test samples/10/1-tests.zig
```

### Expect functions

To check if the code does what it was supposed to, use the [expect][expect]
functions family:

[expect]: https://ziglang.org/documentation/master/#toc-Zig-Test

```zig
// 2-tests.zig

const std = @import("std");

test "It should be true" {
    try std.testing.expect(2 == 5 - 3);
}

test "It should be equal" {
    try std.testing.expectEqual(@TypeOf(123),@TypeOf(321));
}

test "It should be same text" {
    try std.testing.expectEqualStrings("hello", "hello");
}
```

## 11: Generic Types

The way that Zig solves type-safety issues with container types and other
type-related scenarios is using a clever combination of types as values and
**compile-time** functions.

The [comptime][comptime] keyword makes code blocks to be known at compile time.
That combined with type as first-class citizens in zig, The type information
passed is guaranteed naturally.

[comptime]: https://zig.guide/language-basics/comptime/

```zig
// 1-generic-types.zig

const std = @import("std");

fn add(T: type, a: T, b: T) T {
    return a + b;
}

pub fn main() void {
    const x = 10;
    const y = 20;
    const z = comptime add(u8, x, y);
    std.log.info("z: {}", .{z});
}
```

Types, like functions and errors, are first-class citizens, so they can be
assigned as regular variables.

## 12: Project Setup

Like any reliable tool, Zig can scale up or down, depending on what you need.

In order to organize big projects, consuming 3rd party libraries, set up a zig
project with `zig init`:

```bash
mkdir -p samples/12/my-project
cd samples/12/my-project/
zig init
```

This creates the following project structure:

```bash
my-project/
├── build.zig
├── build.zig.zon
└── src/
    ├── main.zig
    └── root.zig
```

The `root.zig` file is the **library/package entry point**.

### Build, Test, Run

Zig projects are configured via `build.zig` file.

This is how you build, test and run the project:

```bash
zig build
zig build test
zig build run
```

### Installing a Library

Zig libraries are, like golang libraries, git repositories.

To install one, just do the following:

```bash
zig fetch --save git+https://github.com/sombriks/iz-even.git#0.1.1
```

Fetch command modifies the manifest file, adding the dependency:

```zig
.{
    // my-project/build.zig.zon
    .name = .my_project,
    .version = "0.0.0",
    .fingerprint = 0xa54a7cc241381398,
    .minimum_zig_version = "0.16.0",
    .dependencies = .{
        .iz_even = .{
            .url = "git+https://github.com/sombriks/iz-even.git?ref=0.1.1#hash",
            .hash = "iz_even-0.1.0-<athother hash>",
        },
    },
    .paths = .{
        "build.zig",
        "build.zig.zon",
        "src"
    },
}
```

Once installed, it's time to declare the dependency into your `build.zig`:

```zig
// my-project/build.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // configuring fetched package
    const iz_even_dep = b.dependency("iz_even", .{
        .optimize = optimize,
        .target = target
    });

    // default project module
    const mod = b.addModule("my_project", .{
        .root_source_file = b.path("src/root.zig"),
        .optimize = optimize,
        .target = target
    });
    mod.addImport("iz_even", iz_even_dep.module("iz_even"));

    // ...
}
```

On the dependency is delcared, you can do this in your `root.zig`:

```zig
// my-project/src/root.zig
//! By convention, root.zig is the root source file when making a package.
const std = @import("std");
const _izEven = @import("iz_even");

pub const izEven = _izEven.izEven;

pub fn add(a: i8, b: i8) i8 {
    return a + b;
}
```

And consume it in the entry point or in any place in the project you like:

```zig
// my-project/src/main.zig

const std = @import("std");
const my_project = @import("my_project");

pub fn main() void {
    const a: i8 = 3;
    const b: i8 = 3;
    const result: i8 = my_project.add(a, b);
    std.log.info("is even {}",.{my_project.izEven(result)});
}
```

Then you `zig Build run` the project and life goes on.

## 13: Threads

Zig offers thread primitives:

```zig
// 1-threads.zig
const std = @import("std");

fn work(io: *std.Io, id: usize, n: i64) !void {
    std.log.info("worker {} started", .{id});
    defer std.log.info("worker {} finished", .{id});
    try io.*.sleep(.fromSeconds(n), .awake);
}

pub fn main(init: std.process.Init) !void {
    var io: std.Io = init.io;

    // synchronous
    std.log.info("synchronous mode",.{});
    for (1..10) |i| {
        try work(&io, i, @as(i64, @intCast(1 + i % 3)));
    }

    // spawn threads instead
    std.log.info("threaded mode",.{});
    var threads: [9]std.Thread = undefined;
    for (1..10) |i| {
        const id = i;
        const seconds = @as(i64, @intCast(1 + i % 3));
        threads[i - 1] = try std.Thread.spawn(
            .{.allocator = init.gpa},
            work,
            .{&io, id, seconds }
        );
    }

    // wait until the last one to end
    for (threads) |thread| {
        thread.join();
    }
}
```

But it really shines with the new concurrent [async/await][async/await] API:

[async/await]: https://www.youtube.com/watch?v=iqhS98J6PNU

```zig
// 2-threads.zig

const std = @import("std");

fn work(io: *std.Io, id: usize, n: i64) !void {
    std.log.info("worker {} started", .{id});
    defer std.log.info("worker {} finished", .{id});
    try io.*.sleep(.fromSeconds(n), .awake);
}

pub fn main(init: std.process.Init) !void {
    var io: std.Io = init.io;

    const ReturnType = @typeInfo(@TypeOf(work)).@"fn".return_type.?;
    var futures: [9]std.Io.Future(ReturnType) = undefined;
    for(0..9) |i| {
        const id = i + 1;
        const seconds = @as(i64, @intCast(1 + i % 3));
        futures[i] = io.async(work, .{&io, id, seconds});
    }

    for(&futures) |*future| {
        _ = try future.await(io);
    }
}
```

And why is it better?

Well, it abstracts the underlying concurrency implementation, making the code
portable event to platforms without this capability.

Also, the [future api][future-api] only decouples execution from result
gathering: it **avoids**
[color functions][color-functions] introduction in your codebase.

[future-api]: https://ziglang.org/documentation/0.16.0/std/#std.Io.Future

[color-functions]: https://langdev.stackexchange.com/questions/3430

For example:

```zig
// 3-threads.zig

const std = @import("std");

fn work(io: *std.Io, id: usize, n: i64) !void {
    std.log.info("worker {} started", .{id});
    defer std.log.info("worker {} finished", .{id});
    try io.*.sleep(.fromSeconds(n), .awake);
}

fn scheduler(io: *std.Io) anyerror!void {
    const ReturnType = @typeInfo(@TypeOf(work)).@"fn".return_type.?;
    var futures: [9]std.Io.Future(ReturnType) = undefined;
    for(0..9) |i| {
        const id = i + 1;
        const seconds = @as(i64, @intCast(1 + i % 3));
        futures[i] = io.*.async(work, .{io, id, seconds});
    }

    for(&futures) |*future| {
        _ = try future.await(io.*);
    }
}

pub fn main(init: std.process.Init) !void {
    var single = std.Io.Threaded.init_single_threaded;
    defer single.deinit();
    var io: std.Io = single.io();
    std.log.info("single threaded io:", .{});
    try scheduler(&io);

    var pool = std.Io.Threaded.init(init.gpa,.{});
    defer pool.deinit();
    io = pool.io();
    std.log.info("thread pool io:", .{});
    try scheduler(&io);

    // we need out-pointer this one.
    var evented: std.Io.Evented = undefined;
    _ = try std.Io.Evented.init(&evented, init.gpa,.{});
    defer evented.deinit();
    io = evented.io();
    std.log.info("evented io:", .{});
    try scheduler(&io);
}
```

_note: on 0.16.0 version, the `Evented` verskon has a bug, fixed on master._

As you can see, the concurrency model is abstracted from the actual
implementation, decoupling it from design to runtime.

## 14: Networking

From networking primitives to high-level protocols, You will be well served on
zig 0.16.0.

### High Level Networking

You can make use of portable, high-level abstractions through the `std.Io.net`
module:

```zig
// 1-networking.zig

const std = @import("std");

const Io = std.Io;
const Init = std.process.Init;
const IpAddress = std.Io.net.IpAddress;
const Server = std.Io.net.Server;

fn sampleServer(io: Io, addr: IpAddress) !void {
    std.log.info("prepare server", .{});
    var srv = try addr.listen(io, .{});
    defer srv.deinit(io);
    const stream = try srv.accept(io);
    defer stream.close(io);
    var buffer: [1024]u8 = @splat(0);
    var chunk: [1024]u8 = @splat(0);
    var reader_obj = stream.reader(io, &buffer);
    var reader = &reader_obj.interface;
    const read = try reader.readSliceShort(&chunk);
    std.log.info("server read {} bytes, data '{s}'", .{ read, chunk });
}

fn sampleClient(io: Io, addr: IpAddress) !void {
    std.log.info("prepare client", .{});
    var stream = try addr.connect(io, .{ .mode = .stream });
    defer stream.close(io);
    var buffer: [1024]u8 = @splat(0);
    var writer_obj = stream.writer(io, &buffer);
    var writer = &writer_obj.interface;
    try writer.writeAll("Hello from client");
    try writer.flush();
    std.log.info("client done", .{});
}

pub fn main(init: Init) !void {
    const addr = try IpAddress.parse("127.0.0.1", 8080);
    const io = init.io;

    var t1 = io.async(sampleServer, .{ io, addr });
    var t2 = io.async(sampleClient, .{ io, addr });

    try t1.await(io);
    try t2.await(io);
}
```

### Low-Level Primitives (Sockets)

If you want more control over the connection, expose the socket:

```zig
// 2-networking.zig
//
const std = @import("std");

const Io = std.Io;
const net = std.Io.net;
const IpAddress = net.IpAddress;

fn udpServer(io: Io, addr: IpAddress) !void {
    var socket = try addr.bind(io, .{
        .mode = .dgram,
        .protocol = .udp,
    });
    defer socket.close(io);

    std.log.info("Server UDP listening at {any}", .{addr});

    var buffer: [1024]u8 = undefined;
    while (true) {
        const msg = try socket.receive(io, &buffer);
        std.log.info("Received: '{s}' from {any}", .{ msg.data, msg.from });

        // just echo back
        try socket.send(io, &msg.from, msg.data);

        if (std.mem.eql(u8, msg.data, "end")) break;
    }
}

fn udpClient(io: Io, server_addr: IpAddress) !void {
    const any_addr = try IpAddress.parse("127.0.0.1", 0);
    var socket = try any_addr.bind(io, .{
        .mode = .dgram,
        .protocol = .udp,
    });
    defer socket.close(io);

    const msg_text = "Hello from Zig 0.16!";
    try socket.send(io, &server_addr, msg_text);
    std.log.info("Client sent: '{s}'", .{msg_text});

    var buffer: [1024]u8 = undefined;
    const response = try socket.receive(io, &buffer);
    std.log.info("Client received: '{s}'", .{response.data});

    try socket.send(io, &server_addr, "end");
}

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const addr = try IpAddress.parse("127.0.0.1", 9999);

    var server_task = io.async(udpServer, .{ io, addr });
    var client_task = io.async(udpClient, .{ io, addr });

    try server_task.await(io);
    try client_task.await(io);
}
```

### HTTP

Going up on networking abstractions, Zig offers both a client and a server:

```zig
// 3-networking.zig

const std = @import("std");
const http = std.http;
const Io = std.Io;
const net = Io.net;
const IpAddress = net.IpAddress;

fn httpClient(io: Io, allocator: std.mem.Allocator, addr: IpAddress) !void {
    // Wait for server
    io.sleep(Io.Duration.fromMilliseconds(100), .awake) catch {};

    var client = http.Client{
        .allocator = allocator,
        .io = io,
    };
    defer client.deinit();

    var uri_buf: [128]u8 = undefined;
    const uri_str = try std.fmt.bufPrint(&uri_buf, "http://127.0.0.1:{d}/", .{addr.getPort()});
    const uri = try std.Uri.parse(uri_str);

    var req = try client.request(.GET, uri, .{});
    defer req.deinit();

    try req.sendBodiless();

    var redirect_buffer: [1024]u8 = undefined;
    var response = try req.receiveHead(&redirect_buffer);

    std.log.info("Client received response: {d} {s}", .{@intFromEnum(response.head.status), response.head.reason});

    var body_buffer: [1024]u8 = undefined;
    var transfer_buffer: [1024]u8 = undefined;
    var body_reader = response.reader(&transfer_buffer);
    const n = try body_reader.readSliceShort(&body_buffer);

    std.log.info("Client received body: {s}", .{body_buffer[0..n]});
}

fn httpServer(io: Io, addr: IpAddress) !void {
    var srv = try addr.listen(io, .{ .reuse_address = true });
    defer srv.deinit(io);

    std.log.info("Server listening on {any}", .{addr});

    const stream = try srv.accept(io);
    defer stream.close(io);

    var in_buffer: [8192]u8 = undefined;
    var out_buffer: [1024]u8 = undefined;

    var reader_obj = stream.reader(io, &in_buffer);
    var writer_obj = stream.writer(io, &out_buffer);

    var server = http.Server.init(&reader_obj.interface, &writer_obj.interface);
    var req = try server.receiveHead();

    std.log.info("Server received request: {s} {s}", .{@tagName(req.head.method), req.head.target});

    try req.respond("Hello from Zig HTTP Server!\n", .{});
    std.log.info("Server responded and closing", .{});
}

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const addr = try IpAddress.parse("127.0.0.1", 8080);

    var server_task = io.async(httpServer, .{ io, addr });
    var client_task = io.async(httpClient, .{ io, init.gpa, addr });

    try server_task.await(io);
    try client_task.await(io);
}
```

### Miscellaneous

The Zig ecosystem is evolving at a fast pace. For instance, those examples
are all based on the new sdt.Io refactoring, and more high-level
middleware http libraries are likely being reworked to support it.

## 15: List and Map

I should have sampled it before, but here it goes. Fancy data structures
ready to use:

```zig
// 1-list-and-map.zig

const std = @import("std");

pub fn main(init: std.process.Init) !void {
    // some list operations
    var ints = try std.ArrayList(i32).initCapacity(init.gpa, 10);
    defer ints.deinit(init.gpa); // forces ints to be var instead of const
    std.log.info("Array of ints {any}", .{ints});
    for (1..15) |i| {
        try ints.append(init.gpa, @intCast(i));
    }
    std.log.info("Array of ints {any}", .{ints});
    _ = ints.orderedRemove(6);
    _ = ints.orderedRemove(6);
    _ = ints.orderedRemove(6);
    std.log.info("Array of ints {any}", .{ints});
    std.log.info("int[6] {}", .{ints.items[6]});
    _ = ints.pop();
    _ = ints.pop();
    _ = ints.pop();
    std.log.info("Array of ints {any}", .{ints});
    // now some map operations
    const MiscData = struct { age: u8, name: []const u8 };
    var map = std.StringHashMap(MiscData).init(init.gpa);
    defer map.deinit();
    try map.put("player1", .{ .age = 40, .name = "Sombriks" });
    std.log.info("Map entry for player1 {any}", .{map.get("player1")});
    try map.put("player2", .{ .age = 1, .name = "bot" });
    try map.put("player3", .{ .age = 1, .name = "bot 2" });
    try map.put("player4", .{ .age = 1, .name = "bot 3" });
    var it = map.iterator();
    while (it.next()) |entry| {
        std.log.info("Entry: {s} -> {any}", .{ entry.key_ptr.*, entry.value_ptr.* });
    }
}
```

## 16: Zig As A C Compiler

No Zig tutorial is complete without the mandatory _better than C_ section.

You can use Zig as a C compiler:

```bash
mkdir -p samples/16/my-c-project
cd samples/16/my-c-project
touch foo.c bar.c main.c Makefile
```

This is the sample C code:

```c
// bar.c

int bar(int a, int b) {
    return a+b;
}

// foo.c

void foo(int *a, int *b) {
    *a = *a + 1;
    *b = *b - 1;
}

// main.c
#include <stdio.h>

#include "foo.c"
#include "bar.c"

int main(int argc, char **argv) {
    int a = 2;
    int b = 2;
    foo(&a,&b);
    int c = bar(a,a);
    int d = bar(b,b);
    printf("a: %d, b: %d, c: %d, d: %d\n", a, b, c, d);
    return 0;
}
```

No black magic, just plain old C.

And the Makefile modified to use Zig compiler:

```makefile
# all you need to replace 'native' C compiler with Zig compiler
CC=zig cc

my-c-program: main.c foo.c bar.c
	$(CC) main.c -o my-c-program

clean:
	rm -f my-c-program

all: my-c-program

run: all
	./my-c-program
```

### Using a C libray in Zig

Zig can consume C libraries directly. It's better than C consuming C, as the
advertisement says:

```bash
mkdir -p samples/16/my-zig-c
cd samples/16/my-zig-c
zig init 
touch src/my-c-thing.{c,h}
```

For the C part, it goes like this:

```c
// my-c-thing.h

int my_function(int,int);

// my-c-thing.c

#include <stdio.h>

#include "my-c-thing.h"

int my_function(int a, int b) {
    printf("numbers are: %d, %d\n", a, b);
    return a + b;
}
```

To enable C build in your zig project, modify the `build.zig`:

```zig
// build.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const mod = b.addModule("my_zig_c", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        // 1. Tell Zig to link libc
        .link_libc = true,
    });

    // 2. Add the directory containing your C header files
    mod.addIncludePath(b.path("src"));

    // 3. Add the actual C source files to compile
    mod.addCSourceFiles(.{
        .files = &.{ "src/my-c-thing.c" },
        .flags = &.{ "-Wall", "-Wextra" },
    });

    const exe = b.addExecutable(.{
        .name = "my_zig_c",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
            .imports = &.{
                .{ .name = "my_zig_c", .module = mod },
            },
        }),
    });

    b.installArtifact(exe);
    const run_step = b.step("run", "Run the app");
    const run_cmd = b.addRunArtifact(exe);
    run_step.dependOn(&run_cmd.step);
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }
    const mod_tests = b.addTest(.{
        .root_module = mod,
    });
    const run_mod_tests = b.addRunArtifact(mod_tests);
    const exe_tests = b.addTest(.{
        .root_module = exe.root_module,
    });
    const run_exe_tests = b.addRunArtifact(exe_tests);
    const test_step = b.step("test", "Run tests");
    test_step.dependOn(&run_mod_tests.step);
    test_step.dependOn(&run_exe_tests.step);
}
```

Next, expose the C library to the Zig side:

```zig
// src/root.zig

pub const c = @cImport({
    @cInclude("my-c-thing.h");
});
```

Finally, use it:

```zig
// src/main.zig

const std = @import("std");
const my_zig_c = @import("my_zig_c");

pub fn main(_: std.process.Init) void {
    std.log.info("All your {s} are belong to us.", .{"codebase"});
    const result = my_zig_c.c.my_function(20, 22);
    std.log.info("The result of my_function(20, 22) is {d}", .{result});
}
```

This makes the zig compiler effectively an _omni-tool_, (cross-)compiler,
muti-language build system and package manager.

## 17: Databases

Zig supports a good variety of database engines, thanks to its C-compatible
nature.

### SQLite

It is possible to use SQLite directly from the shared library available in the
system. Install it if not installed yet:

```bash
sudo dnf install sqlite sqlite-devel
```

Next, scaffold a project:

```bash
mkdir -p samples/17/sample-sqlite
cd samples/17/sample-sqlite
zig init 
echo "#include <sqlite3.h>" > src/sample-sqlite.h
```

Next, configure the `build.zig` to link against the shared library:

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {

    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // 1 - the local header file containing the C interface
    const sqlite = b.addTranslateC(.{
        .root_source_file = b.path("src/sample-sqlite.h"),
        .target = target,
        .optimize = optimize,
    });

    // 2 - link with the shared library
    sqlite.linkSystemLibrary("sqlite3", .{});

    const mod = b.addModule("sample_sqlite", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
    });
    const exe = b.addExecutable(.{
        .name = "sample_sqlite",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
            .imports = &.{
                .{ .name = "sample_sqlite", .module = mod },
                .{ .name = "sqlite", .module = sqlite.createModule() },
            },
        }),
    });
    b.installArtifact(exe);
    const run_step = b.step("run", "Run the app");
    const run_cmd = b.addRunArtifact(exe);
    run_step.dependOn(&run_cmd.step);
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }
    const mod_tests = b.addTest(.{
        .root_module = mod,
    });
    const run_mod_tests = b.addRunArtifact(mod_tests);
    const exe_tests = b.addTest(.{
        .root_module = exe.root_module,
    });
    const run_exe_tests = b.addRunArtifact(exe_tests);
    const test_step = b.step("test", "Run tests");
    test_step.dependOn(&run_mod_tests.step);
    test_step.dependOn(&run_exe_tests.step);
}
```

To interact with sqlite:

```zig
const std = @import("std");

const sqlite = @import("sqlite");

/// callback for query results. every cursor result will be passed here.
/// data: Passed directly from the 4th argument of sqlite3_exec
/// argc: Number of columns in the result row
/// argv: Array of strings representing column values
/// azColName: Array of strings representing column names
fn callback(_: ?*anyopaque, argc: i32, argv: [*c][*c]u8, azColName: [*c][*c]u8) callconv(.c) i32 {
    var i: usize = 0;
    var buf: [1024]u8 = undefined;
    var pos: usize = 0;

    while (i < @as(usize, @intCast(argc))) : (i += 1) {
        const col_name = if (azColName[i] != null) std.mem.span(azColName[i]) else "NULL";
        const val = if (argv[i] != null) std.mem.span(argv[i]) else "NULL";
        const item = std.fmt.bufPrint(buf[pos..], "{s}{s}: {s}", .{
            if (pos > 0) ", " else "",
            col_name,
            val,
        }) catch |err| {
            if (err == error.NoSpaceLeft) break;
            return 1;
        };
        pos += item.len;
    }
    std.log.info("{s}", .{buf[0..pos]});
    return sqlite.SQLITE_OK;
}

pub fn main(_: std.process.Init) !u8 {
    var db: ?*sqlite.sqlite3 = null;

    var rc = sqlite.sqlite3_open("example.db", &db);
    defer _ = sqlite.sqlite3_close(db);
    if (rc != sqlite.SQLITE_OK) {
        std.log.err("Can't open database: {s}", .{sqlite.sqlite3_errmsg(db)});
        return 1;
    }

    var errMsg: [*c]u8 = undefined;

    // let's do some SQL
    const sql =
        \\ select 1 + 1;
        \\ -- this is a comment
        \\ create table if not exists players(
        \\     id integer primary key autoincrement,
        \\     name text not null
        \\);
        \\ insert into players (name) values ('sombriks');
        \\ select * from players order by id desc;
        \\ select count(id) from players;
    ;
    rc = sqlite.sqlite3_exec(db, sql, callback, null, &errMsg);
    if (rc != sqlite.SQLITE_OK) {
        std.debug.print("SQL error: {s}\n", .{errMsg});
        sqlite.sqlite3_free(errMsg);
        return 1;
    }

    return 0;
}
```

Run the sample a couple of times to see the database growing:

```bash
cd samples/17/sample-sqlite
zig build run
```

Noteworthy: the code is pretty _c-ish_, returning those integer error codes.
Also, at least in my personal experience, the language server (zls) win not
offer type information for the translated c header file.

But boy, it works and it's fast!

For a more idiomatic approach, there are a few wrapper projects written in
zig, like [zig-sqlite][zig-sqlite] or [zqlite.zig][zqlite.zig].

[zig-sqlite]: https://github.com/vrischmann/zig-sqlite

[zqlite.zig]: https://github.com/karlseguin/zqlite.zig

### PostgreSQL

For postgres, the approach is pretty much the same. Either link with the
native library or use a native one.

This is a sample using [pg.zig][pg.zig]:

[pg.zig]: https://github.com/karlseguin/pg.zig

```bash
mkdir -p samples/17/sample-postgres
cd samples/17/sample-postgres
zig init
zig fetch --save git+https://github.com/karlseguin/pg.zig#master
mkdir infra
touch infra/database.yml
```

The `database.yml` is just a simple [docker-compose][docker-compose] manifest to
provision a postgresql database:

[docker-compose]: https://docs.docker.com/compose/

```yml
---
# infra/database.yml
name: sample-pg-zig
services:
  db:
    image: postgres:18-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: sample
    ports:
      - "5432:5432"
```

The `build.zig` for this project goes like this:

```zig
// build.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // 1 - configure the downloaded dependency as a module
    const pg_module = b.dependency("pg", .{}).module("pg");

    const mod = b.addModule("sample_postgres", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        // 2 - register the library module as an import
        .imports = &.{
            .{ .name = "pg", .module = pg_module },
        },
    });

    const exe = b.addExecutable(.{
        .name = "sample_postgres",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
            // 2 - register the library module as an import
            .imports = &.{
                .{ .name = "sample_postgres", .module = mod },
                .{ .name = "pg", .module = pg_module },
            },
        }),
    });
    b.installArtifact(exe);

    const run_step = b.step("run", "Run the app");
    const run_cmd = b.addRunArtifact(exe);

    run_step.dependOn(&run_cmd.step);
    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const mod_tests = b.addTest(.{
        .root_module = mod,
    });
    const run_mod_tests = b.addRunArtifact(mod_tests);
    const exe_tests = b.addTest(.{
        .root_module = exe.root_module,
    });
    const run_exe_tests = b.addRunArtifact(exe_tests);
    const test_step = b.step("test", "Run tests");
    test_step.dependOn(&run_mod_tests.step);
    test_step.dependOn(&run_exe_tests.step);

    // 3 - bonus: start the docker compose from zig build
    const run_db_cmd = b.addSystemCommand(&.{
        "docker", "compose", "-f", "infra/database.yml", "up", "-d",
    });
    const db_step = b.step("db", "Start the local development database");
    db_step.dependOn(&run_db_cmd.step);
}
```

To consume the database:

```zig
// src/main.zig

const std = @import("std");
const pg = @import("pg");

pub fn main(init: std.process.Init) !void {
    // provision a connection pool
    const uri = try std.Uri.parse("postgresql://postgres:postgres@localhost:5432/sample");
    const pool = try pg.Pool.initUri(init.io, init.gpa, uri, .{ .size = 5, .timeout = 10_000 });
    defer pool.deinit();

    const sql =
        \\select 1 + 1
    ;

    // query the database
    var result = try pool.query(sql, .{});
    defer result.deinit();

    // loop the results
    while (try result.next()) |row| {
        const r = try row.get(i32, 0);
        std.log.info("query: {s}, result: {}", .{ sql, r });
    }

    // more operations
    const sql2 =
        \\create table if not exists players(
        \\  id serial primary key,
        \\  name text not null
        \\);
    ;
    _ = try pool.exec(sql2, .{});

    const sql3 = "insert into players (name) values ($1);";
    _ = try pool.exec(sql3, .{"sombriks"});

    const sql4 = "select * from players;";
    var result2 = try pool.query(sql4, .{});
    defer result2.deinit();

    while (try result2.next()) |p| {
        std.log.info("players({},{s})", .{ try p.get(i32, 0), try p.get([]u8, 1) });
    }
}
```

And you can run this sample this way:

```bash
cd samples/17/sample-postgres
zig build db
zig build run
```

## 18: Is it Worth Learning Zig

So, is it worth the effort?

The short answer is **yes**, no fear of wasting time.

### Features available

Right now, Zig lives for its promise of performance, general purpose,
scalable and of course, _better than C_.

The design of asynchronous IO operations, the explicit memory control, the
explicit way to do things, all of this are both beautiful and mental-model
braking change. Remembers me when i started to learn [htmx][htmx], coming
from [vue][vue].

[htmx]: https://htmx.org

[vue]: https://vuejs.org

The built-ins and libraries showcased in this writing are far from being
complete, and the community around the platform keeps growing and offering
more and more libraries. Also, they are nice people.

For instance, it is dead easy to package and distribute software with zig.
The long-term outcome is a huge number of libraries.

The first-party access of C libraries also contributes to the expected
growth of Zig.

Oh, and the language is neat, a real pleasure to write. That helps!

### Compared to other platforms

When i think of low-level, high-performance scenarios, then C and C++ come to
the table. Zig **explicitly** compares itself to those and ues, it does a
good job.

Then there are the application scenarios. Here, languages like Node, Go and
Java come to my mind. Since performance isn't the main concern, the lack of
libraries can downplay Zig when comparing against those other platforms,
pretty much like how Go used to compare with Java.

The fact that Zig is not an Object-oriented language is not a problem, the
state of node libraries is proof of that. Less type gymnastics is a plus,
although the steady growth of TypeScript tries to prove me wrong.

Of those 3, the one with the biggest 3rd party libraries is Java, i think,
featuring maven central as the one place to publish and find packages. The
more ergonomic one, regarding the ease of installation, is the Node/npm combo.
But the real end-to-end best experience, from consuming to publishing
packages, is Go with Go modules. And Zig mimics this one, with slight
improvements, like the build and metadata separation.

Finally, regarding portability, Zig is a first-class citizen on this one,
maybe even doing better than the other platforms, since it can cross-compile.
Maybe one can argue that cross-compilation does not matter for Node or Java,
but in the end it translates as less flexibility if you think about edge
cases.

### Future

Zig isn't at 1.0 release yet. This matters a lot. But this also keeps
things quite honest, so when that stable release finally arrives, Any
architect can make a solid decision, able to endure over the years.

I think it's a matter of time now to see the ecosystem around zig grows
enormously. It's dead easy to publish, to write, test and reach other people
working with it. Zig has everything right to be a great, solid platform.

## Conclusion

There is a lot to go deeper on this platform, this article/handbook just
scratches the surface of what Zig has to offer right now.

I really enjoyed writing about Zig. Now i am willing to use it on my
projects. And if you're reading this, i hope you get the same feeling and
confidence to do so.

The complete sample code for this article can be found [here][repo].

[repo]: https://github.com/sombriks/my-zig-handbook

Happy hacking!
