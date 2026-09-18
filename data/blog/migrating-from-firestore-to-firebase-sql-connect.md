---
title: 'We moved off Firestore. The slow page stayed slow.'
date: '2026-09-18'
tags: ['firebase', 'firestore', 'postgresql', 'database-migration', 'architecture', 'performance']
summary: 'Two days after Talenthub moved from Firestore to Firebase SQL Connect, the page that pushed us into it was still downloading 18 MB and locking up for a minute. The new database made a better query possible. Writing that query is what made the page fast.'
authors: ['bulent-turkmen']
images: ['/articles/migrating-from-firestore-to-firebase-sql-connect/hero.webp']
theme: 'blue'
draft: false
---

On 7 August, two days after we moved Talenthub's data layer from Firestore to PostgreSQL, I measured the page that had made it urgent.

It pulled down **18.6 MB decoded**. I could not click anything for about **55 seconds**. Two of those freezes were almost **28 seconds** each. The page was usable at around **77 seconds**. It made 41 label requests. One of three cold loads failed with a 500 on the resume fetch itself.

The before numbers, from July on Firestore, were the same shape. This page was not the only reason we moved, but it was the urgent one, and it did not notice.

## What the page does

Talenthub is our internal resume platform. The employer network page shows every company anyone in the organisation has worked at, who worked there, filtered by a date window.

That is a group-by over every work stint in the company. Firestore Standard, which is what we were running, has aggregation queries (`count()`, `sum()`, `average()`), but they return one value for a whole query, not one row per group. A per-company breakdown means one aggregation per company, which means you need the list of companies first, which is most of what you were trying to work out.

So we built it the way Firestore makes easy. Load the collection, aggregate in the browser.

The download itself was not this page's fault. The search box lives in the shared layout and pulls the resume list a manager is allowed to see, so in July a full page load for a manager cost **18.27 MB decoded, 2.66 MB over the wire**, on any page in the app. Employees only ever get their own rows, and an in-app click could hit a five minute cache. A hard load paid in full. The employer network page inherited that download, then built the whole employer graph out of it in the browser, resolving company labels as it went. Ask for ten years of history and you waited almost a minute, across 31 requests.

None of that was a mistake at the time. When the app was one person reading their own resume, it cost nothing worth measuring. Once the whole list is in the browser, using it there feels free, and it keeps feeling free long after it stops being cheap.

## Why the migration changed nothing

We had changed the database. We had not changed the page. It was still fetching every resume and doing the work itself. The browser does not know which database it is talking to.

Those two 27.7 second tasks are also the part I got wrong for a while. I assumed the pairwise company-clustering loop, because it is the only obviously quadratic thing on the page, but I was wrong. Replayed locally, that loop costs tens of milliseconds. The biggest local block lands the moment the payload does, and it is nearly the same at three years as at ten. Parsing the JSON takes under a tenth of a second and the graph build is not much more, so it is neither of those. I never got a 27 second task to show up on my machine. Past that I stopped looking, because guessing is how the clustering theory got started. The fix was not a faster parse. It was to stop shipping 18 MB into the browser.

I had gone for the charts before that, for the same reason: a page with doughnuts on it looks like a rendering problem. They have ten slices each and the data build is memoized. Twice I went looking at the visible part of the page instead of the large one.

The migration did not make the page fast. It made the page fixable.

## Could Firestore have done it?

If the fix was a server-side read model, why not build that on Firestore and skip the migration? It depends which Firestore.

We could have built the same derived read model on Firestore: on every resume save, fan stints out into a `workExperiences` collection with `startDate`, `employerId`, `resumeId`, then query by date window. That is a normal Firestore pattern and it would have removed the corpus download.

On Firestore Standard, that is where it stops. Aggregation queries cannot group by a field, so "how many people at this client" is either many document reads or a counter collection you keep correct yourself. There is no join, so sector and size tier either get copied onto every stint, with write amplification and stale labels, or you batch-get them. We were already doing the second one, at roughly 79,000 registry reads in one monitoring window. And you pay per document: reading 2,000 stints is 2,000 reads, on every page load, for every manager.

Firestore Enterprise is where this gets uncomfortable. Its Pipeline operations reached general availability on 20 April 2026, around two months before we decided, bringing grouped aggregation and relational joins through correlated subqueries. Most of the paragraph above stops being true on Enterprise. It probably could have done this. We did not evaluate it. Switching editions is an export and import into a new instance rather than a setting you flip, so it would not have been free, but that is an argument about effort and not about fit, and I did not run the comparison that would let me claim anything stronger. If I made this decision again, that is the first thing I would put on the table.

Against Standard, the rest of the choice I can defend. Vector search would still have needed a second store or a pile of denormalised filter fields. Full-text search meant Firestore Enterprise or Algolia. Uniqueness we had "solved" with a reservation collection, a small distributed protocol with orphan cleanup, where PostgreSQL has `UNIQUE`. We picked PostgreSQL because `tsvector`, `pgvector` and `UNIQUE` have been boring for years, and because we could keep Firebase Auth. That is all I am claiming.

Two things Firestore is genuinely better at, and I am not going to pretend otherwise. The nested resume body is a document, and scale-to-zero is real money. We kept the first, because bodies still live in `jsonb`. We accepted the second with our eyes open: an always-on Cloud SQL instance bills whether anyone opens the app or not. I have not run the two bills side by side, so I am not going to claim one is cheaper. For an internal tool with steady weekday load and no anonymous traffic, a predictable instance cost was a trade we were happy to make.

Two questions people will ask about this design, so let me answer them.

The name clustering did not go away. PostgreSQL does not know that "iO Digital" and "iO digital B.V." are the same company either. All we did was move that work: the canonical name gets resolved once, when a resume is saved, and stored on the row. The read never clusters anything. That was never what made the page slow. It just means the browser has one less job.

The shred is a real cost, and it lands on every save. On Firestore Standard we would have paid it too, because there is no way to aggregate across an array inside a document without flattening it into its own collection first. Enterprise can flatten at read time with unnest, which is the same work moved to the other end, paid on every read instead of once per save. We pay once per save. When we measured a worst-case save on the emulators, regenerating embeddings and short links and re-shredding stints, it came to 15 operations on SQL Connect against 106 document writes on Firestore, because Firestore charges for each of the 48 embeddings it deletes and rewrites. Writes are where SQL was supposed to lose, and it did not.

## What actually fixed it

A derived table, one row per stint, shredded out of the resume on every save:

```graphql
type WorkExperience
  @table(key: ["id"])
  @index(fields: ["employerProfileId", "startDate"], order: [ASC, DESC]) {
  id: String!
  resume: Resume! @ref @index # @ref does NOT auto-index the FK column
  employerProfile: EmployerProfile @ref @index
  companyRaw: String
  role: String
  startDate: Date @index
  endDate: Date
  personName: String
  technologies: [String] @index(type: GIN)
}
```

And a server endpoint that queries it with the user's date window. The overlap condition is the whole feature: a stint counts if it started before the window closed and had not ended when the window opened, with an open-ended stint treated as still running.

```graphql
query EmployerNetworkSnapshot($start: Date!, $end: Date!) {
  workExperiences(
    where: {
      _and: [
        { companyRaw: { isNull: false } }
        { startDate: { isNull: false } }
        { startDate: { le: $end } }
        { _or: [{ endDate: { ge: $start } }, { endDate: { isNull: true } }] }
      ]
    }
    limit: 100000
  ) {
    companyRaw
    personName
    startDate
    endDate
    resume {
      id
      isArchived
    }
    employerProfile {
      canonicalCompany
      sector
      sizeTier
    }
  }
}
```

Sector, size tier and canonical company come back resolved per row, so the response is the snapshot. The page hook takes it and returns early. No corpus download, no graph build, no clustering, no label calls.

We chose Firebase SQL Connect (formerly Firebase Data Connect, renamed April 2026, CLI still `dataconnect`) mostly because of what it let us avoid. It is managed Cloud SQL underneath with a GraphQL layer on top and Firebase Auth wired in natively, so `auth.uid` is available inside every operation. Our sessions, middleware and access rules were all built on Firebase Auth, and that was the one part of the system that was not broken. Moving data and auth together would have been two hard migrations in one project.

The swap itself was small, and I cannot take much credit for it. The UI never spoke to Firestore. Everything went through one interface, so we wrote a SQL implementation of it and ported the few places that reached for the Firestore admin SDK directly.

## The numbers

Measured on 18 September, production against production, same app, same hosting, compression on both sides.

| Employer network window | Measured as    | July, Firestore | September, SQL Connect | Requests |
| ----------------------- | -------------- | --------------- | ---------------------- | -------- |
| 1 year                  | filter change  | 10,230ms        | **2,797ms**            | 13 → 1   |
| 3 years                 | cold page load | 8,015ms         | **5,340ms**            | 18 → 2   |
| 5 years                 | filter change  | 29,124ms        | **3,356ms**            | 33 → 1   |
| 7 years                 | filter change  | 43,447ms        | **3,193ms**            | 38 → 1   |
| 10 years                | filter change  | 55,950ms        | **3,669ms**            | 31 → 1   |

One run each, no throttling. Trust the shape, not the exact milliseconds.

The three-year row is the cold load, three years being the default window, so it carries the cost of booting the page as well as fetching data. That is why it is the slowest row in the after column while being the smallest window. The other four rows are filter changes on a page that is already open, so read down that group and not across the whole table.

The ten-year row is 15 times faster, but the useful column is the curve. Take the filter changes on their own. Before, more years meant more waiting. One year was 10 seconds. Ten years was 56. After, those same four windows all finish in about three seconds, and not even in size order. The data grows and the time stops caring. The curve is a property of the query model.

The rest, same two runs:

- Main thread at ten years: about 55,700ms blocked, down to **542ms**.
- Label calls per filter change: 10 to 16, down to **zero**.
- `/skills`, the grid of who knows what across the organisation, used to build itself from the corpus in the browser. It is server-rendered now: DOMContentLoaded **14,439ms down to 1,331ms**, while holding more rows than before.
- The search box corpus: 18.27 MB decoded, down to **1.63 MB**. We did not remove the preloader. We gave it twelve fields per resume instead of every field of every resume. The cold-load 500 from August went with it, since nothing asks for the fat payload any more.
- Eight full page loads in one manager session: about **146 MB of decoded JSON** (roughly 21 MB over the wire), down to **1.63 MB decoded, fetched once**. These were hard loads, not in-app clicks.

Two things I am not claiming. Vector search should be better on an HNSW index than on the Firestore scan we replaced, but I never measured it on either side in production. And the employer network page picked up a DOMContentLoaded regression (2,467ms to 3,731ms) that I have not explained. TTFB is 62ms, so the server is not the problem. It sits between first byte and hydration, which is part of what that three-year cold load is carrying: the page spends longer getting ready to ask for data than it spends fetching it.

## What I would do differently

Plan the derived tables, the server-side reads and the indexes as part of the migration, in the same pull requests, measured together. Not as the sensible follow-up ticket that everyone assumes someone else is holding.

And trust rendered output over row counts. Four bugs got past us because the counts matched. Firestore stores vectors as a native `VectorValue`, so `Array.isArray()` returns false and our length check silently skipped all 6,500 embeddings while the import reported success. `upsertMany` validates against the full input type, so partial writes need the generated `_update` mutation instead. The old aggregation had two years of business rules in it (skip stints without a parseable start date, exclude archived resumes, cluster by raw company string) and none of them live in the data. And `toISOString().slice(0, 10)` converts to UTC first, so a stint starting at midnight in Amsterdam on 1 May was stored as 30 April. Row counts matched on every one of those.

## The part that is not finished

The employer network page answers in one query now. `/skills` went from fourteen seconds to one. So when I re-measured everything, I expected to be done.

`/overview`, for a manager, still downloads the whole visible resume corpus, because the metric tiles are still counted in the browser. That corpus is **22.98 MB decoded, 3.24 MB over the wire** today. It was 18.27 MB decoded in July. The resume count grew by under ten percent in that window. The payload grew 26%, because the bodies got richer, not just more numerous. The one call I had not fixed is now more expensive than it was before the migration started, and `/overview` is quietly the slowest page in the app at 6.5 seconds.

It is the same bug this article is about, on the page I look at most often, and I found it only because I measured instead of assuming I was finished. The server-side query that would fix it has been possible since the day we cut over. Nobody has written that query. That includes me.

A database migration does not make anything faster. It changes which queries you are allowed to write. If the slow thing is your read model, and it usually is, the read model is the actual work.
