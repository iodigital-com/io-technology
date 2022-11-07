---
title: 'Azure Cache for Redis Cheatsheets'
date: '2022-11-04'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
---

# Azure Cache for Redis

common patterns:

- Data cache
- Content cache
- Session store
- Job and message queuing
- Distributed transactions

### Service tiers

- **Basic** : OSS Redis cache running on **a single VM**
- **Standard**: OSS Redis cache running on **two VMs** in a **replicated** configuration.
- **Premium**: High-performance OSS Redis caches.
- **Enterprise**: **Redis Enterprise software**. This tier supports Redis modules including **RediSearch**, **RedisBloom**, and **RedisTimeSeries**
- **Enterprise Flash**: Cost-effective large caches powered by Redis Labs' Redis Enterprise software ( It reduces the overall **per-GB memory cost.**)

### Pricing tier

- **Basic**: Basic cache ideal for development/testing. Is limited to a single server, **53 GB of memory**, **and 20,000 connections**. There is **no SLA** for this service tier.
- **Standard**: Production cache which supports replication and includes **an SLA**. It supports **two servers**, and has the same memory/connection limits as the Basic tier.
- **Premium**: (Virtual Network support
  ,Clustering support)Enterprise tier which builds on the Standard tier and includes persistence, clustering, and scale-out cache support. This is the highest performing tier with up to **530 GB of memory** and **40,000 simultaneous connections**.persist data :
  - **RDB** persistence takes a periodic snapshot.
  - **AOF** persistence saves every write operation to a log that is saved at least once per second.

### Accessing the Redis instance

common Commands:

`ping`

`set [key] [value]`

`get [key] `

`exists [key]`

`type [key] `

`incr [key]`

`incrby [key] [amount] `

`del [key] `

`flushdb`

### Create an Azure Cache for Redis instance

```
az redis create --location <myLocation> \
    --resource-group az204-redis-rg \
    --name $redisName \
    --sku Basic --vm-size c0
```

Sample Clieny with C#

```csharp
static async Task Main(string[] args)
{
    // The connection to the Azure Cache for Redis is managed by the ConnectionMultiplexer class.
    using (var cache = ConnectionMultiplexer.Connect(connectionString))
    {
        IDatabase db = cache.GetDatabase();

        // Snippet below executes a PING to test the server connection
        var result = await db.ExecuteAsync("ping");
        Console.WriteLine($"PING = {result.Type} : {result}");

        // Call StringSetAsync on the IDatabase object to set the key "test:key" to the value "100"
        bool setValue = await db.StringSetAsync("test:key", "100");
        Console.WriteLine($"SET: {setValue}");

        // StringGetAsync takes the key to retrieve and return the value
        string getValue = await db.StringGetAsync("test:key");
        Console.WriteLine($"GET: {getValue}");

    }
}
```

# Develop for storage on CDNs

Limitations:

- The number of **CDN profiles** that can be created.
- The number of **endpoints** that can be created in a CDN profile.
- The number of **custom domains** that can be mapped to an endpoint.

### caching behavior

- **Caching rules**. Caching rules can be either global (apply to all content from a specified endpoint) or custom. Custom rules apply to specific paths and file extensions.
- **Query string caching**. Query string caching enables you to configure how Azure CDN responds to a query string. Query string caching has no effect on files that can't be cached.

### Caching rules

- **Ignore query strings**. This option is the **default mode**. A CDN POP simply passes the request and any query strings directly to the origin server on the first request and caches the asset. New requests for the same asset will ignore any query strings until the TTL expires.
- **Bypass caching for query strings**. Each query request from the client is passed directly to the origin server with no caching.
- **Cache every unique URL**. Every time a requesting client generates a unique URL, that URL is passed back to the origin server and the response cached with its own TTL. This final method is inefficient where each request is a unique URL, as the cache-hit ratio becomes low.

### Caching and time to live

Default TTL values are as follows:

- Generalized web delivery optimizations: **seven days**
- Large file optimizations: **one day**
- Media streaming optimizations: **one year**

### purge content

You can purge content in several ways.

- On an endpoint by endpoint basis
- Specify a file, by including the path to that file
- Based on wildcards (\*) or using the root (/)

using Azure CLI

```
az cdn endpoint purge \
    --content-paths '/css/*' '/js/app.js' \
    --name ContosoEndpoint \
    --profile-name DemoProfile \
    --resource-group ExampleGroup

```

### prepopulating cahce

```
az cdn endpoint load \
    --content-paths '/img/*' '/js/module.js' \
    --name ContosoEndpoint \
    --profile-name DemoProfile \
    --resource-group ExampleGroup
```

### Azure Content Delivery Networks by using .NET

```csharp
 // Create CDN client
    CdnManagementClient cdn = new CdnManagementClient(new TokenCredentials(authResult.AccessToken))
        { SubscriptionId = subscriptionId };
```

### List CDN profiles and endpoints

```csharp
private static void ListProfilesAndEndpoints(CdnManagementClient cdn)
{
    // List all the CDN profiles in this resource group
    var profileList = cdn.Profiles.ListByResourceGroup(resourceGroupName);
    foreach (Profile p in profileList)
    {
        Console.WriteLine("CDN profile {0}", p.Name);
        if (p.Name.Equals(profileName, StringComparison.OrdinalIgnoreCase))
        {
            // Hey, that's the name of the CDN profile we want to create!
            profileAlreadyExists = true;
        }

        //List all the CDN endpoints on this CDN profile
        Console.WriteLine("Endpoints:");
        var endpointList = cdn.Endpoints.ListByProfile(p.Name, resourceGroupName);
        foreach (Endpoint e in endpointList)
        {
            Console.WriteLine("-{0} ({1})", e.Name, e.HostName);
            if (e.Name.Equals(endpointName, StringComparison.OrdinalIgnoreCase))
            {
                // The unique endpoint name already exists.
                endpointAlreadyExists = true;
            }
        }
        Console.WriteLine();
    }
}
```

Create CDN profiles and endpoints

```csharp
//Create the new profile
        ProfileCreateParameters profileParms =
            new ProfileCreateParameters() { Location = resourceLocation, Sku = new Sku(SkuName.StandardVerizon) };
        cdn.Profiles.Create(profileName, profileParms, resourceGroupName);
```

create an endpoint

```csharp
private static void CreateCdnEndpoint(CdnManagementClient cdn)
{
    if (endpointAlreadyExists)
    {
        //Check to see if the endpoint already exists
    }
    else
    {
        //Create the new endpoint
        EndpointCreateParameters endpointParms =
            new EndpointCreateParameters()
            {
                Origins = new List<DeepCreatedOrigin>() { new DeepCreatedOrigin("Contoso", "www.contoso.com") },
                IsHttpAllowed = true,
                IsHttpsAllowed = true,
                Location = resourceLocation
            };
        cdn.Endpoints.Create(endpointName, endpointParms, profileName, resourceGroupName);
    }
}
```

Purge an endpoint

```csharp
cdn.Endpoints.PurgeContent(resourceGroupName, profileName, endpointName, new List<string>() { "/*" });
```
