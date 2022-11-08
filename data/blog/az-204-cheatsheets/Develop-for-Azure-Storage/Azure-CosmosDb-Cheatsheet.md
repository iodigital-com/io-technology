---
title: 'Develop solutions that use Azure Cosmos DB Cheatsheets'
date: '2022-11-07 15:00:00'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam', 'storage', 'database']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

# Develop solutions that use Azure Cosmos DB

Key benefits
multi-master replication protocol

- Unlimited elastic write and read scalability.
- 99.999% read and write availability all around the world.
- Guaranteed reads and writes served in less than 10 milliseconds at the 99th percentile.

## Elements in an Azure Cosmos account

Azure Cosmos account is the fundamental unit of global distribution and high availability (has unique DNS name)

maximum of **50 Azure Cosmos accounts** under an Azure subscription

hierarchy of different entities in an Azure Cosmos DB account:

- Database Account
  - Datavase
    - Container (Collection, Table, Graph, ...)
      - Stored Procedure
      - User-defined functtions
      - triggers
      - conflicts
      - merge procedures
      - **items** (document, row, node, edge, ...)

## Azure Cosmos containers

container is a schema-agnostic container of items
A container is horizontally partitioned and then replicated across multiple regions

throughput modes:

- Dedicated provisioned throughput mode: exclusively reserved for that container and it is backed by the SLAs.
- Shared provisioned throughput mode : share the provisioned throughput with the other containers in the same database (shared among all the “shared throughput” containers)

### Azure Cosmos Items

Depending on which API representation can be different:

| Cosmos entity     | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API  | Table API |
| ----------------- | ------- | ------------- | ------------------------------- | ------------ | --------- |
| Azure Cosmos item | Item    | Row           | Document                        | Node or edge | Item      |

## consistency levels

consistency levels are region-agnostic and are guaranteed for all operations

consistency models:

- strong : guarantees that reads get the most recent version of an item
- bounded staleness: guarantees that a read hax a max lag (either version or time)
- session: guarantees that a client session will read its own writes
- consistent prefix: guarantees that updates are returned in order
- eventual : no guarantees for order

**Strong** and **Bounded staleness** will consume **twice** the normal RU for a request

Consider the following points if your application is built using SQL API or Table API:

- For many real-world scenarios, session consistency is optimal and it's the recommended option.
- If you need stricter consistency : bounded staleness consistency level.
- If you need less strict consistency : consistent prefix consistency level.
- If you need the highest throughput and the lowest latency,: eventual consistency level.
- If you need even higher data durability : custom consistency level at the application layer.

Consistency guarantees:

- When the consistency level is set to **bounded staleness**, Cosmos DB guarantees that the **clients always read the value of a previous write**, with a lag bounded by the staleness window.

- When the consistency level is set too **strong**, the staleness window is equivalent to **zero**, and the clients are guaranteed to read the **latest committed value** of the write operation.
- For the remaining three consistency levels, the staleness window is largely dependent on your workload , if there are no write operations on the database, a read operation with eventual, session, or consistent prefix consistency levels is likely to yield the same results as a read operation with strong consistency level

### the Probabilistically Bounded Staleness (PBS) metric

This metric provides an insight into how often you can get a stronger consistency than the consistency level that you've currently configured on your Azure Cosmos account

## supported APIs

### Core(SQL) API

stores data in document format.

querying items using the Structured Query Language (SQL)

### MongoDB API

This API stores data in a document structure, via BSON format.

It is compatible with MongoDB wire protocol; however, it does not use any native MongoDB related code

### Cassandra API

This API stores data in column-oriented schema. Cassandra API is wire protocol compatible with the Apache Cassandra.

Cassandra Query Language (CQL)

### Table API

stores data in key/value format
Table API only supports OLTP scenarios.

### Gremlin API

graph queries and stores data as edges and vertices

currently only supports OLTP scenarios.

## request units

you pay for the throughput you provision and the storage you consume on an hourly basis

fetching a single item by its ID and partition key value, for a 1KB item is 1RU

- Provisioned throughput mode:provision the number of RUs for your application on a per-second basis in increments of 100 RUs per second.
- Serverless mode: In this mode, you don't have to provision any throughput
- Autoscale mode: suited for mission-critical workloads that have variable or unpredictable traffic patterns

# partitioning in Azure Cosmos DB

## Logical Partition

A logical partition consists of a set of items that have the same partition key.

A logical partition also defines the scope of database transactions

## Physical partitions

Physical partitions are collections of logical partitions
physical partitions are an internal implementation of the system and they are entirely managed by Azure Cosmos DB

- The number of throughput provisioned (10,000 RU/s limit for physical)
- total data storage (up to 50GB data).

**Hot partitions** lead to inefficient use of provisioned throughput (many requests directed to a small subset of partitions)

## partition key

Once you select your partition key, it is not possible to change it in-place
Components:

- The partition key path (for example: "/userId")
- The partition key value (for example: "Saeed")

partition key should:

- property that has a value which does not change
- Have a high cardinality
- Spread request unit (RU) consumption and data storage evenly across all logical partitions

### read-heavy containers

For large read-heavy containers you might want to choose a partition key that appears frequently as a filter in your queries.

### synthetic partition key

- Concatenate multiple properties of an item
- Use a partition key with a random suffix
- Use a partition key with pre-calculated suffixes

# Microsoft .NET SDK v3 for Azure Cosmos DB

CosmosClient

`CosmosClient client = new CosmosClient(endpoint, key);`

Create a database

```csharp
// An object containing relevant information about the response
DatabaseResponse databaseResponse = await client.CreateDatabaseIfNotExistsAsync(databaseId, 10000);
```

Read a database by ID

`DatabaseResponse readResponse = await database.ReadAsync();`

Delete a database

`await database.DeleteAsync();`

Create a container

```csharp
// Set throughput to the minimum value of 400 RU/s
ContainerResponse simpleContainer = await database.CreateContainerIfNotExistsAsync(
    id: containerId,
    partitionKeyPath: partitionKey,
    throughput: 400);
```

Get a container by ID

```
Container container = database.GetContainer(containerId);
ContainerProperties containerProperties = await container.ReadContainerAsync();
```

Delete a container

`await database.GetContainer(containerId).DeleteContainerAsync();`

Create an item (JSON serializable)

`ItemResponse<SalesOrder> response = await container.CreateItemAsync(salesOrder, new PartitionKey(salesOrder.AccountNumber));`

Read an item

```csharp
string id = "[id]";
string accountNumber = "[partition-key]";
ItemResponse<SalesOrder> response = await container.ReadItemAsync(id, new PartitionKey(accountNumber));
```

Query an item

```csharp
QueryDefinition query = new QueryDefinition(
    "select * from sales s where s.AccountNumber = @AccountInput ")
    .WithParameter("@AccountInput", "Account1");

FeedIterator<SalesOrder> resultSet = container.GetItemQueryIterator<SalesOrder>(
    query,
    requestOptions: new QueryRequestOptions()
    {
        PartitionKey = new PartitionKey("Account1"),
        MaxItemCount = 1
    });
```

---

### Create resources by Azure CLI

Create the Azure Cosmos DB account
`az cosmosdb create --name <myCosmosDBacct> --resource-group az204-cosmos-rg`

Retrieve the primary key for the account
`az cosmosdb keys list --name <myCosmosDBacct> --resource-group az204-cosmos-rg`

### stored procedures

The context object provides access to all operations that can be performed in Azure Cosmos DB, and access to the request and response object

input parameters are always sent as a **string** to the stored procedure

Stored procedures have a limited amount of time to run on the server. All collection functions return a Boolean value that represents whether that operation will complete or not

### triggers and user-defined functions

**pre-triggers** and **post-triggers**
Triggers are **not automatically executed**, they must be specified for each database operation where you want them to execute

Pre-triggers cannot have any input parameters

The post-trigger runs as part of the same transaction for the underlying item itself
an exception during the post-trigger execution will fail the whole transaction. Anything committed will be rolled back and an exception returned.

```js
var context = getContext()
var container = context.getCollection()
var response = context.getResponse()
```
