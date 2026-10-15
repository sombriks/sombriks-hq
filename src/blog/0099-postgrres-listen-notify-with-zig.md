---
layout: blog-layout.pug
date: 2026-10-15
tags:
  - posts
  - shorts
  - zig
  - postgres
  - listen/notify
  - podman
  - sql
  - project-structure
draft: false
---

# Postgres Listen/Notify with Zig

The resulting *process* uses lesser RAM bytes than the PID number. An app
consuming kilobytes, how cool is that!?

## The study

Following my zig studies, what could be the effort to actually consume a
database and tuck a user interface on top of it?

So, I chose:

- [Postgres via pg.zig](https://github.com/karlseguin/pg.zig)
- [A TUI via zigzag](https://github.com/meszmate/zigzag)

Also, because this is not about how to setup a postgres database, i chose
[podman](https://podman.io/) to solve that problem.

## The setup

The sample skeleton for this project goes like that:

```bash
mrdir sample-zig-tui
cd sample-zig-tui
zig init
mkdir -p src/infra
touch src/infra/database.yml
# as the time of this writing, i did a fork to fix a simple build issue
zig fetch --save git+https://github.com/sombriks/zigzag#main
# as the time of this writing, i did a fork to fix a simple dependency issue
zig fetch --save git+https://github.com/sombriks/pg.zig#master
```

## The database compose

Since it costs zero dollars, let's go with the current latest postgres:

```yaml
name: sample-db
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

## The build system

This project is interesting. I have two dependencies, *pg.zig* and *zigzag*,
along with some indirect dependencies.

Also, there is the database question.

So, my build system goes like this:

```zig
// build.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    // module config
    const exe = b.addExecutable(.{
        .name = "sample_zig_tui",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
        }),
    });
    // deps config
    const deps = [_][]const u8{ "zigzag", "pg" };
    for (deps) |dep| {
        exe.root_module.addImport(dep, b.dependency(dep, .{
            .target = target,
            .optimize = optimize,
        }).module(dep));
    }
    // default target: install
    b.installArtifact(exe);
    // custom step: run
    const run_step = b.step("run", "Run the app");
    const run_cmd = b.addRunArtifact(exe);
    run_step.dependOn(&run_cmd.step);
    run_cmd.step.dependOn(b.getInstallStep());
    run_cmd.addPassthruArgs();
    // custom step: test
    const exe_tests = b.addTest(.{
        .root_module = exe.root_module,
    });
    const run_exe_tests = b.addRunArtifact(exe_tests);
    const test_step = b.step("test", "Run tests");
    test_step.dependOn(&run_exe_tests.step);
    // custom step: clean
    const clean_cmd = b.addSystemCommand(&.{ "rm", "-rf", ".zig-cache", "zig-pkg", "zig-out/" });
    const clean_step = b.step("clean", "wipe the kitchen");
    clean_step.dependOn(&clean_cmd.step);
    // custom step: db:up
    const db_up_cmd = b.addSystemCommand(&.{ "podman", "compose", "-f", "src/infra/database.yml", "up", "-d" });
    const db_up_step = b.step("db:up", "Start development database using podman compose");
    db_up_step.dependOn(&db_up_cmd.step);
    // custom step: db:down
    const db_down_cmd = b.addSystemCommand(&.{ "podman", "compose", "-f", "src/infra/database.yml", "down" });
    const db_down_step = b.step("db:down", "Stop development database using podman compose");
    db_down_step.dependOn(&db_down_cmd.step);
}
```

A few unusual things are going on this build script worth mentioning:

- The loop defining dependencies seems cool and all, but not every
  dependencies out there export just one module. So, mind that when doing
  your own dependency declarations.
- The clean command should be more platform-independent, but it fails on
  windows for now. the same can be said about the database-related commands.
- There are great advantages in managing the database container from the
  build system. For starters, ensure the single source of truth.

## The code

The example is simple, implements the view/command pattern demanded by `zigzag`:

```zig
// src/main.zig
const std = @import("std");
const zigzag = @import("zigzag");
const pg = @import("pg");

const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;

const Pool = pg.Pool;

const Cmd = zigzag.Cmd;
const Color = zigzag.Color;
const Style = zigzag.Style;
const Tick = zigzag.msg.Tick;
const Border = zigzag.Border;
const Context = zigzag.Context;
const Program = zigzag.Program;
const KeyEvent = zigzag.KeyEvent;
const TextInput = zigzag.TextInput;
const AsyncRunner = zigzag.AsyncRunner;
const VirtualList = zigzag.components.virtual_list.VirtualList;

const TodoModel = struct {
    allocator: Allocator,
    pool: *Pool,
    tasks: ?AsyncRunner(Msg) = null,
    vList: ?VirtualList(TodoItem) = null,
    todos: ?ArrayList(TodoItem) = null,
    input: ?TextInput = null,

    // model contract, this one MUST be called Msg
    pub const Msg = union(enum) {
        key: KeyEvent,
    };

    // our item
    pub const TodoItem = struct {
        id: i32 = 0,
        description: []const u8 = "",
        done: bool = false,
    };

    // model contract
    pub fn init(model: *TodoModel, _: *Context) Cmd(Msg) {
        model.tasks = AsyncRunner(Msg).init(model.allocator);
        _ = model.tasks.?.spawnWithArg(*TodoModel, model, &todoListener);
        model.input = TextInput.init(model.allocator);
        model.input.?.setPlaceholder("Enter new todo...");
        model.todos = .empty;
        model.vList = .{};
        model.vList.?.viewport_height = 5;
        model.vList.?.render_fn = &renderItem;

        model.initDb() catch return .quit;
        model.listTodos() catch return .quit;

        return .none;
    }

    // optional model contract
    pub fn deinit(self: *TodoModel) void {
        self.tasks.?.deinit();
        self.input.?.deinit();
        self.todos.?.deinit(self.allocator);
    }

    // model contract
    pub fn update(self: *TodoModel, msg: Msg, _: *Context) Cmd(Msg) {
        switch (msg) {
            .key => |k| {
                switch (k.key) {
                    .up, .down => self.vList.?.update(k),
                    .enter => self.addTodo() catch {},
                    else => self.input.?.handleKey(k),
                }
            },
        }
        return .none;
    }

    // model contract
    pub fn view(self: *const TodoModel, ctx: *const Context) ![]const u8 {
        var title_style = (Style{})
        .bold(true)
        .paddingAll(1)
        .fg(Color.green)
        .alignH(.center);
        const title = try title_style.render(ctx.allocator, "Todo App");

        var input_style = (Style{})
        .width(50)
        .borderAll(Border.normal)
        .borderForeground(Color.cyan);
        const input = try input_style.render(ctx.allocator, try self.input.?.view(ctx.allocator));

        const list = self.vList.?.view(ctx.allocator);

        return try std.fmt.allocPrint(ctx.allocator, "{s}\n{s}\n{s}", .{ title, input, list });
    }

    // custom contract, check database sanity
    pub fn initDb(model: *TodoModel) !void {
        const q =
            \\create table if not exists todos (
            \\  id serial primary key,
            \\  description varchar not null,
            \\  done boolean default false,
            \\  created timestamp not null default now(),
            \\  updated timestamp not null default now()
            \\);
        ;
        var con = try model.pool.acquire();
        defer con.release();
        _ = try con.exec(q, .{});
    }

    // custom contract, set app state
    pub fn listTodos(model: *TodoModel) !void {
        const q =
            \\   select id, description, done
            \\     from todos
            \\ order by created;
        ;

        var con = try model.pool.acquire();
        defer con.release();

        var result = try con.query(q, .{});
        defer result.deinit();

        model.todos.?.clearAndFree(model.allocator);
        while (try result.next()) |row| {
            try model.todos.?.append(model.allocator, .{
                .description = try row.get([]const u8, 1),
            });
        }
        model.vList.?.items = model.todos.?.items;
    }

    pub fn addTodo(model: *TodoModel) !void {
        const q =
            \\insert into todos(description)
            \\values ($1);
        ;

        var con = try model.pool.acquire();
        defer con.release();

        _ = try con.exec(q, .{model.input.?.getValue()});
        try model.input.?.setValue("");
        // notify all postgres clients clients listening in the channel
        _ = try con.exec("notify ch_todos, 'new todo added';", .{});

    }

    pub fn todoDone(model: *TodoModel, item: TodoItem) !void {
        _ = model;
        _ = item;
    }

    // vList contract
    fn renderItem(item: TodoItem, _: usize, _: bool, allocator: std.mem.Allocator) []const u8 {
        return std.fmt.allocPrint(allocator, "{s}", .{item.description}) catch "?";
    }

    // async task contract + pg listener
    fn todoListener(model: *TodoModel) ?Msg {
        var listener = model.pool.newListener() catch return null;
        defer listener.deinit();

        listener.listen("ch_todos", .{}) catch return null;
        while (listener.next()) |n| {
            _ = n;
            model.listTodos() catch unreachable; // silent failure
        }
        return null;
    }
};

// sample entry point
pub fn main(init: std.process.Init) !void {
    const uri = try std.Uri.parse("postgresql://postgres:postgres@localhost:5432/sample");
    const pool = try Pool.initUri(init.io, init.gpa, uri, .{ .size = 5 });
    defer pool.deinit();

    const model: TodoModel = .{ .allocator = init.gpa, .pool = pool };

    var program = Program(TodoModel).initWithModel(init.gpa, init.io, init.environ_map, model, .{});
    defer program.deinit();
    try program.run();
}
```

While it's not the prettiest zig code around, it proves well the point:
ready-to use components to deliver a acceptable user experience:

![sample.png](/post-pics/0099-postgrres-listen-notify-with-zig/sample.png)

## The final thoughts

Zig 0.17.0 introduced fewer breaking changes when compared with 0.16.0. The
build/tooling changes where small.

On the other hand, Evebted/IOUring remains broken, if you are in need of
high-performance concurrency, keep relying on [zio][zio].

[zio]: https://github.com/lalinsky/zio

One cool behavior that zig encourages developers to do is to read the
sources from third-party libraries. It's often a good way to grow repertory
and solve quick questions. Some projects even include examples in their
packages, making library sources even more valuable as documentation.

Regarding the listen/notify capabilities of Postgres, they are neat. Also, it's
pretty nice that it's available in modern pg clients from zig ecosystem,
running well in the latest release of the language/platform.

It is also noteworthy that the distinct degree of responsibilities in the
developer hands regarding memory management. Boy, this thing isn't easy for
someone with decades of experience only with GC-based languages! But it is
also very rewarding to see the total memory usage in bytes being smaller
than the process PID number!

So, if you need high performance, good scalability, either up or down, and have
the time, go with zig. It's better than C.

