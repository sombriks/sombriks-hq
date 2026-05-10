---
layout: blog-layout.pug
tags:
  - posts
  - software architecture
  - stereotypes
  - misc
date: 2026-05-10
draft: false
---
# Proper stereotypes and why does it matter

God created earth, sky and all the animals. Then He put Adam to name all the
things. Well, we're on that job ever since.

## Why a name matters

A *name* is key part of anything. It reflects **identity**.

On systems architecture, names like users, services, clients, databases and
queues transmit information regarding distinct sets of attributes and behaviors.

Distinct names implies on distinct **layers**. In architecture context, layers
implies on affinity between each named thing.

For example, distinct system users can be typed as [personas][persona] and also
have profiles, roles and permissions.

All those names belongs to the same layer, and depending on context a certain
**stereotype** is considered.

[persona]: https://en.wikipedia.org/wiki/Persona_(user_experience)

## Names versus Stereotypes

They are mostly the same.

The key difference is that a stereotype also holds **context information**.

When i say `Class` there is little context transmitted, even though i happen to
know that the main subject is a software project.

But when i say `Singleton`, `Data Transfer Object` or `Controller`, a deeper and
richer idea is passed.

## Industry-standard stereotypes

Any technical text will make use of several stereotypes that can be grouped in
distinct layers.

- Client/Server architecture? Two stereotypes with at least two distinct layers.
- Networking Protocols? The layer related to this stereotype is present.
- Model-View-Controller? The stereotypes also defile the layers.
- Observer? Communicates a very specific way of code interaction.
- Saga? All the behaviors involved in distributed transactions are in.

## When a stereotype fails

Whenever a stereotype fails to transmit context, these situations might explain:

- **Lack of repertory**: The person in contact with the stereotype might be
  seeing it for the first time. In that case, query the stereotype in the
  available literature **must** be enough to bind the context to the name.
- **Flaky meaning**: The stereotype fails to communicate its meaning in an
  ergonomic way. The thing where named poorly. Maybe the name is already used
  much more widely in another context, shadowing the stereotype from its desired
  meaning.
- **Generic name for specific subject**: This is a common one, specific subjects
  under too broad names. This faulty stereotype will end up naming things that
  are too distinct under the same name, ruining the cohesion and the clear layer
  separation.

Keep it in mind when creating your own stereotypes.

## Defining good domain-specific stereotypes

Whenever defining a software architecture, adopt industry standard stereotypes
is the safe path. It's clean and safe path.

But, sometimes, not all concepts inside a project holds a well-known context.
Then you need to get creative. But not too much creative!

For example, if your system has to handle a raffle, some standard stereotypes
will apply. But some small details, very specific to what the
[product owner][product-owner] demands usually ends up called as **Business**,
pretty much like what happens to pieces of code dwelling inside a package called
**Util**.  

[product-owner]: https://en.wikipedia.org/wiki/Scrum_(project_management)

Those generic-ish names for non-generic things are clearly poor design choices,
they damage the project cohesion in the long term.

You can build good names on top of existing stereotypes, specializing already
present meanings for your particular context.

## Further reading

Books like [The Clean Code][clean-code] presents good stereotypes to start with.

[clean-code]: https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882

The [classic design patterns book][gof] also contributes to provide repertory to
anyone in need to understand the common jargon about this subject.

[gof]: https://www.amazon.com/Design-Patterns-Object-Oriented-Addison-Wesley-Professional-ebook/dp/B000SEIBB8

Finally, [A philosophy of software design][philosophy] is the lecture to expand
your vocabulary beyond the basic and hep you to really understand how to name
your specific scenarios. The text to star thinking as an adult.

[philosophy]: https://www.amazon.com.br/Philosophy-Software-Design-John-Ousterhout/dp/1732102201
