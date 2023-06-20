---
title: '2023 State of Databases for Serverless & Edge'
date: '2023-01-25'
---

There's been massive innovation in the database and backend space for developers building applications with serverless and edge compute. There are new tools, companies, and even programming models that simplify how developers store data.

This post will be an overview of databases that pair well with modern application and compute providers.

### Vanilla CSS

<ProsCard
  title="vanilla CSS"
  pros={[
    `You don't want to add a toolchain. Vanilla CSS works with every browser & language.`, `As teste`, `Mui teste`
  ]}
/>

<ConsCard
  title="vanilla CSS"
  cons={[`You're building a large web application.`]}
/>


## Criteria

I'll focus on **transactional¹** workloads instead of analytical² workloads.

The “backend” space is vast: search, analytics, data science, and more – so I'll niche down here. The primary criteria of this overview is:

1. Services that work exceptionally well when paired with serverless and edge compute
2. Services that work with JavaScript and TypeScript codebases

> **Disclaimer:** I work at Vercel, which partners with companies in this post. I also have personally used many of these tools for my own personal projects. My site currently uses PlanetScale and I'm also an angel investor in Supabase (mentioned below).

## A new programming model

Relational databases have been around for 25+ years.

While there are new companies creating _serverless-first_ storage solutions, a new programming model is required for workloads to be compatible with serverless compute and modern runtimes.

These solutions must be:

- **(Bonus) Type-safe:** TypeScript developers are favoring databases or libraries which provide tooling to enable type-safe access to your data. For example: [Prisma](https://www.prisma.io/), [Kysely](https://github.com/koskimas/kysely), [Drizzle](https://github.com/drizzle-team/drizzle-orm), [Contentlayer](https://www.contentlayer.dev/), and [Zapatos](https://jawj.github.io/zapatos/).

Consider databases like Postgres. New solutions like Neon and Supabase abstract connection management, providing you with a simple way to query and mutate data. In the case of Supabase, there's a client library that uses an HTTP API [built on PostgREST](https://supabase.com/docs/guides/api):

```jsx
import { createClient } from '@supabase/supabase-js';
let supabase = createClient('https://<project>.supabase.co', '<your-anon-key>');
let { data } = await supabase.from('countries').select();
```

And for Neon:

```jsx
import { Client } from '@neondatabase/serverless';
let client = new Client(env.DATABASE_URL);
let {
  rows: [{ now }],
} = await client.query('select now();');
```

Neon's solution is [particularly interesting](https://neon.tech/blog/serverless-driver-for-postgres/).

> The basic premise is simple: our driver redirects the PostgreSQL wire protocol via a special proxy. Our driver connects from the edge function to the proxy over a WebSocket, telling the proxy which database host and port it wants to reach. The proxy opens a TCP connection to that host and port and relays traffic in both directions.

<Image
  alt={`Image ig-news`}
  src={`/ig-news.png`}
  width={1600}
  height={840}
/>

<Callout emoji="💡">

Using WebSockets, instead of HTTP, does have tradeoffs. There might be additional latency on the first request setup, but subsequent requests are faster. There's an [RFC](https://www.rfc-editor.org/rfc/rfc9220.pdf) for WebSockets with `HTTP/3` which would remove that extra network roundtrip.

</Callout>

The connection management isn't going away – it's just being handled by the vendor now.

There's even solutions like PlanetScale which can handle up to [a million connections](https://planetscale.com/blog/one-million-connections), which also allows you to effectively never think about managing connections.

### Stateful backends and other solutions

- **Pre-GA**
  - **[ChiselStrike](https://www.chiselstrike.com/):** Write your TypeScript class, generate an API. Really leaning into the “infrastructure from code” approach, you write and think in functions, somewhat similar to Convex.
  - **[EdgeDB](https://www.edgedb.com/):** EdgeDB is challenging the status quo. Particularly the “merger” between ORM / database, more than just a query builder, but a way to _optimize_ queries.

---

¹ Commonly referred to as OLTP (Online _Transactional_ Processing). These are for CRUD operations, most commonly the MySQL and Postgres databases of the world.
