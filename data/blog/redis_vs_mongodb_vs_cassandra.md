---
title: 'Redis VS MongoDB VS Cassandra'
date: '2022-07-20'
tags: ['development', 'database']
images: ['/articles/redis-vs-mongodb-vs-cassandra/hero-image.png']
summary: 'Are the NoSQL databases all the same? If not, what are the differences (and why should you care)? A quick comparison chat between Redis, MongoDB and Cassandra'
authors: ['massimiliano-scifo']
theme: 'orange'
---

Having to choose a database is a task that any developer, at some point, must face. Whether its for a new assignment at your job with a pre-set tech stack or just for a personal project when you have the need of store some data.  The options available are many and diverse that is very easily leaving you confused while having to choose which one suits best for your situation. 
The very basic choose to make if using a relational database or a NoSQL one. The first one is usually considered very reliable (since relational database have been around for 50 years) but is most likely to be expensive (most of the relational dbs are not open source and behind some fees) and you are forced on defining tables (either by adding those manually or via some automation). NoSQL databases, on the other hand, are able to be document based, graph based, key-value pairs or wide-column stores and most of the time they are open source. In this article we are going to have a very high-level look at 3 of the most used NOSQL databases out there that have quite different use cases: Redis, MongoDB and Cassandra.

![Redis Logo](/articles/redis-vs-mongodb-vs-cassandra/Redis_Logo.png)
### Redis
Written in C, Redis is defined as an in-memory key-value store, the main difference between this and a relational database . This database is the fastest when it comes to query execution of all of those considered in this article. The data is stored by default in the RAM and thus data is accessible super-fast. This inner working of RAM works is also the quickest to reach saturation point if not dealt with properly. Usually when you restart the machine you are going to lose all the data in Redis, but there are some configurations that can tell Redis to dump the collections in the hard drive and reload those at start. 
Redis is optimized for non-permanent data and real-time response but poorly optimized for scaling, since allow only vertical scaling (and some sort of horizontal scaling by using cluster). 
Redis Cluster also works only by replicating the master node to a slave node and should have a minimum of 3 masters for “guarantee” reliability and 3 slaves. 
Redis also does not handle too well extremely complex objects since is designed to offer fast iterations with only primary index access key
One of the most common use cases for Redis is while implementing any functionalities that requires a real-time response like: 
*	a chat between users 
*	a search engine optimized for heavy queries
*	real-time updating graphs

![MongoDB Logo](/articles/redis-vs-mongodb-vs-cassandra/MongoDB_Logo.png)
### MongoDB
A key-value document-oriented database, very quick to setup and run (different cloud solutions, with Atlas being the most famous/used), optimal for quick prototyping and written in C++. The main difference between a document-oriented database and a relational database is how the data is stored: in a relational database an object data might be spread over different tables that you will need to join, while in a document database, the whole object is stored as instance in the collection.
Being a document-oriented database does not mean that it does not support relations in a very efficient way. In fact, it can be much quicker than a non-optimized relational DB query. MongoDB also supports secondary index on objects, for better handling queries using nested objects without the usual joins and subqueries pain. 

As any document-oriented DB, MongoDB suffers of data redundancy that might end in creating huge collections and very slow queries, but this can be in part prevented by using relations instead of storing the whole object in the collection.
MongoDB allows better horizontal scaling than Redis but still has a bottleneck since it is using one or more “proxies” to send the query to the correct DB replica.
Most common use case scenario are:
*	Generic permanent data storage for APIs
*	Prototyping
*	Product catalog
*	Customer analytics

![Cassandra Logo](/articles/redis-vs-mongodb-vs-cassandra/cassandra-logo.png)
### Cassandra
Quite slow and more time-consuming setup compared to the others and written in Java, Cassandra is a [distributed database system] (https://en.wikipedia.org/wiki/Distributed_database) by design. 
Cassandra is the most SQL-like of the 3 databases, at least syntax-wise. It differs from relational databases in several ways, the most important of them being that a row in SQL tables can contain only datatypes while Cassandra stores objects and can return those directly. 
Works properly only in a clustered setup. This cluster is not in the master-slave way, since all the nodes are equal and contain the same replica and you don’t have a guaranteed node to answer you, but the first that gets updated and is free will serve the request. and is the one that outperform the other in availability and guarantees the correct replica with no point of failure of the data, partially thanks to the “tombstones” (a marking system that runs query in the various nodes) system. Basically, each node that you add to the system will give more availability and reliability to your system, since each node is guaranteed to have the exact data as the others and this nodes can also be set on a different zones
As you can imagine, this allows very easy horizontal scaling and is ideal for extensive usage or huge dataset but is totally a waste for smaller projects, both cost wise and time wise, since the minimum viable setup of 3 nodes for making it working.

It does not support a lot of programming languages compared to the others and most likely the one that have the steeper learning curve, since a lot of optimizations are possible with the queries as with most relational database. 
Most common use case scenario for Cassandra are systems that heavily rely on being 100% available, like:
*	Generic permanent data storage focused on availability
*	Financial services / payments
*	Transactions Logging

### Conclusions
As general suggestion you should not try to force a database to do something that was not designed for, if not totally sure of the capabilities of the storage and the drawback of your actions. 
Redis is very fast and is the one that requires less resource from the machine but is not meant to be used for storing user sensitive or permanent data, is meant to serve quickly and intensive requests better than the others and is good in doing this. MongoDB is more “generic” as use case, since is easy to setup and is widely used for different solutions allowing a decent horizontal scaling which you’ll end up needing in the long run. Cassandra is the most Enterprise-wise DB, since the cost will be higher than the others and the focus on the availability is something that comes really handy but only when you have to handle several hundreds of query per minute, looking to have no downtime no matter what and letting you rely on it about data consistency (between the nodes) which is guaranteed to be optimal. 
