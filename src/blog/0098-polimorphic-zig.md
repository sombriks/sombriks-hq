---
layout: blog-layout.pug
date: 2026-10-07
tags:
  - posts
  - zig
  - shorts
  - polimorphism
draft: false
---
# Polimorphic zig

It's easier than it looks.

## This is not java

Don't expect interfaces or method overloading. The only true interface that zig
respects is the function signature. Also, no type hierarchy. Most things get
done by composition.

### Compile time versus runtime

Another key aspect to be evaluated is polimorphism at compile-time or runtime.
As [Venkat Subramaniam][subramaniam] would say, "while one gives you a compile
error, the other gives you a jira ticket".

[subramaniam]: https://www.linkedin.com/in/vsubramaniam/

## Duck typing

This one solves the polimorphic part at compile time. All we need to do is to
relax a parameter type using anytype and then using the expected attributes and
functions on it. The compiler will check if the thing works.

```zig
const std = @import("std");

const DigitalProduct = struct {
    price: f32,
    pub fn getProcessingFee(self: DigitalProduct) f32 {
        return self.price * 0.02;
    }
};

const PhysicalProduct = struct {
    price: f32,
    weight: f32,
    pub fn getProcessingFee(self: PhysicalProduct) f32 {
        return (self.price * 0.05) + (self.weight * 0.5);
    }
};

// anytype accepts any structural type that implements 'getProcessingFee'
fn processOrderFee(product: anytype) void {
    const fee = product.getProcessingFee();
    std.debug.print("Order processing fee: \${d:.2}\n", .{fee});
}

pub fn main() void {
    const ebook = DigitalProduct{ .price = 10.00 };
    const chair = PhysicalProduct{ .price = 100.00, .weight = 5.5 };

    processOrderFee(ebook);
    processOrderFee(chair);
}
```

## Tagged union

This technique uses unions combined with enums over a previously defined set of
implementations. The union itself can hold only one implementation at a time,
and can switch over implementations to get the proper one.

```zig
const std = @import("std");

const CreditCard = struct { number: []const u8 };
const Pix = struct { key: []const u8 };

const PaymentMethod = union(enum) {
    credit_card: CreditCard,
    pix: Pix,

    pub fn pay(self: PaymentMethod, amount: f32) void {
        switch (self) {
            .credit_card => |cc| std.debug.print("Charged \${d:.2} to card {s}\n", .{ amount, cc.number }),
            .pix => |p| std.debug.print("Paid \${d:.2} via Pix key: {s}\n", .{ amount, p.key }),
        }
    }
};

pub fn main() void {
    const payment1 = PaymentMethod{ .credit_card = .{ .number = "4111-XXXX" } };
    const payment2 = PaymentMethod{ .pix = .{ .key = "user@email.com" } };

    payment1.pay(49.90);
    payment2.pay(150.00);
}
```

## Virtual tables

This one rely on runtime decisions. It's not safe, however this is the only one
that allows extensions without changing the defined interface.

```zig
const std = @import("std");

// The runtime interface definition using an opaque pointer
const OrderProcessor = struct {
    context: *anyopaque,
    process_fn: *const fn (ctx: *anyopaque, order_id: u32) void,

    pub fn process(self: OrderProcessor, order_id: u32) void {
        self.process_fn(self.context, order_id);
    }
};

const StripeProcessor = struct {
    api_key: []const u8,

    pub fn process(ctx: *anyopaque, order_id: u32) void {
        const self: *StripeProcessor = @ptrCast(@alignCast(ctx));
        std.debug.print("Stripe ({s}) processed order #{}\n", .{ self.api_key, order_id });
    }

    pub fn interface(self: *StripeProcessor) OrderProcessor {
        return .{ .context = self, .process_fn = process };
    }
};

pub fn main() void {
    var stripe = StripeProcessor{ .api_key = "sk_live_123" };
    const processor_api = stripe.interface();

    processor_api.process(9942);
}
```

## Conclusion

Boy, that's powerful.
