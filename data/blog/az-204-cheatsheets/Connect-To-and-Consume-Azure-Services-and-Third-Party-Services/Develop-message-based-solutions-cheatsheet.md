---
title: 'Develop message-based solutions Cheatsheets'
date: '2022-11-07'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

# Develop message-based solutions

Azure supports two types of queue mechanisms: Service Bus queues and Storage queues.

consider using **Service Bus queues** when:

- receive messages **without having to poll** the queue ( **long-polling** receive operation using the **TCP-based** protocols)
- guaranteed first-in-first-out (**FIFO**) ordered delivery (**Message Session** )
- automatic duplicate detection
- parallel long-running streams -
- messages that can exceed 64 KB but won't likely approach the 256-KB limit.

consider using **Storage queues** when:

- store over 80 gigabytes of messages in a queue.
- track progress for processing a message in the queue
- server side logs of all of the transactions

### Advanced features

| Feature               | Description                                                                                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Message sessions      | To create a first-in, first-out (**FIFO**) guarantee in Service Bus, use sessions. Message sessions enable exclusive, ordered handling of unbounded sequences of related messages.                                                                          |
| Autoforwarding        | The autoforwarding feature chains a queue or subscription to another queue or topic that is in the same namespace.                                                                                                                                          |
| Dead-letter queue     | Service Bus supports a dead-letter queue (DLQ). A DLQ holds messages that can't be delivered to any receiver. Service Bus lets you remove messages from the DLQ and inspect them.                                                                           |
| Scheduled delivery    | You can submit messages to a queue or topic for delayed processing. You can schedule a job to become available for processing by a system at a certain time.                                                                                                |
| Message deferral      | A queue or subscription client can defer retrieval of a message until a later time. The message remains in the queue or subscription, but it's set aside.                                                                                                   |
| Batching              | Client-side batching enables a queue or topic client to delay sending a message for a certain period of time.                                                                                                                                               |
| Transactions          | A transaction groups two or more operations together into an execution scope. Service Bus supports grouping operations against a single messaging entity within the scope of a single transaction. A message entity can be a queue, topic, or subscription. |
| Filtering and actions | Subscribers can define which messages they want to receive from a topic. These messages are specified in the form of one or more named subscription rules.                                                                                                  |
| Autodelete on idle    | Autodelete on idle enables you to specify an idle interval after which a queue is automatically deleted. The minimum duration is 5 minutes.                                                                                                                 |
| Duplicate detection   | An error could cause the client to have a doubt about the outcome of a send operation. Duplicate detection enables the sender to resend the same message, or for the queue or topic to discard any duplicate copies.                                        |
| Security protocols    | Service Bus supports security protocols such as Shared Access Signatures (SAS), Role Based Access Control (RBAC) and Managed identities for Azure resources.                                                                                                |
| Geo-disaster recovery | When Azure regions or datacenters experience downtime, Geo-disaster recovery enables data processing to continue operating in a different region or datacenter.                                                                                             |
| Security              | Service Bus supports standard AMQP 1.0 and HTTP/REST protocols.                                                                                                                                                                                             |

## Service Bus

### Service Bus tiers

| Premium                               | Standard                       |
| ------------------------------------- | ------------------------------ |
| High throughput                       | Variable throughput            |
| Predictable performance               | Variable latency               |
| Fixed pricing                         | Pay as you go variable pricing |
| Ability to scale workload up and down | N/A                            |
| Message size up to 100 MB             | Message size up to 256 KB      |

### Key Concetps:

### Queues

First In, First Out (FIFO) message delivery to one or more competing consumers.

A related benefit is **load-leveling**, which enables producers and consumers to **send and receive messages at different rates**.

#### Receive modes

- Receive and delete (marks the message as being consumed and returns it to the consumer application)
- Peek lock (two-stage)
  - Finds the **next message** to be consumed, **locks** it to prevent other consumers from receiving it, and then, return the message to the application.
  - After the application finishes processing the message, it requests the Service Bus service to complete the second stage of the receive process. Then, the service** marks the message as being consumed**. otherwise (abandon / unlock)

### Topics and subscriptions

topics and subscriptions provide a one-to-many form of communication in a publish and subscribe pattern

consumers **don't receive messages directly from the topic**. Instead,consumers receive messages from **subscriptions of the topic**

### Rules and actions

While Service Bus subscriptions see all messages sent to the topic, you can only copy a subset of those messages to the virtual subscription queu

## Service Bus message payloads and serialization

**payload** and **metadata**. The metadata is in the form of **key-value** pair properties, and describes the payload

The **broker properties** are predefined by the system.
**user properties** are a collection of key-value pairs

### Message routing and correlation

patterns:

- Simple request/reply: A publisher sends a message into a queue and expects a reply from the message consumer. To receive the reply, the publisher owns a queue into which it expects replies to be delivered. The address of that queue is expressed in the `ReplyTo` property of the `outbound message`. When the consumer responds, it **copies** the `MessageId` of the handled message into the `CorrelationId` property of the reply message and delivers the message to the destination indicated by the `ReplyTo` property. **One message can yield multiple replies, depending on the application context**.

- Multicast request/reply: a publisher sends the message into a **topic** and multiple subscribers become eligible to consume the message. This pattern is used in **discovery** or **roll-call** scenarios. If `ReplyTo` points to a **topic** can be **distributed** to an audience.
- Multiplexing This session feature enables multiplexing of streams of related messages through a **single queue** or subscription such that each session (or group) of related messages, identified by matching `SessionId` values, is routed to a specific receiver while the receiver holds the session under lock.
- Multiplexed request/reply: This session feature enables multiplexed replies, allowing several **publishers to share a reply queue**. By setting `ReplyToSessionId`, the publisher can instruct the consumer(s) to copy that value into the `SessionId` property of the **reply message**. The publishing queue or topic **does not need to be session-aware**. As the message is sent, the publisher can then specifically wait for a session with the given `SessionId` to materialize on the queue by conditionally accepting a session receiver.

### Payload serialization

`ContentType` property

### In Action

Create a Service Bus messaging namespace

```
az servicebus namespace create \
    --resource-group az204-svcbus-rg \
    --name $myNameSpaceName \
    --location $myLocation
```

Create a service bus queue

```
az servicebus queue create --resource-group az204-svcbus-rg \
    --namespace-name $myNameSpaceName \
    --name az204-queue
```

Send a message (C#)

```csharp
client = new ServiceBusClient(connectionString);
sender = client.CreateSender(queueName);

// create a batch  using ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync();

// try adding a message to the batch
messageBatch.TryAddMessage(new ServiceBusMessage($"Message {i}")));

await sender.SendMessagesAsync(messageBatch);

```

Receive a message

```csharp
// Create the client object that will be used to create sender and receiver objects client = new ServiceBusClient(connectionString);

// create a processor that we can use to process the messages
processor = client.CreateProcessor(queueName, new ServiceBusProcessorOptions());

// add handler to process messages
processor.ProcessMessageAsync += MessageHandler;

// add handler to process any errors
processor.ProcessErrorAsync += ErrorHandler;

// start processing
await processor.StartProcessingAsync();
```

## Azure Queue Storage

storing large numbers of messages

components:

- URL format
- Storage account
- Queue
- Message (up to 64 KB / TTL a positive number or -1 )

Create a queue

```csharp
// Instantiate a QueueClient which will be used to create and manipulate the queue
QueueClient queueClient = new QueueClient(connectionString, queueName);

// Create the queue
queueClient.CreateIfNotExists();

// Send a message to the queue
queueClient.SendMessage(message);

// Peek at the next message
PeekedMessage[] peekedMessage = queueClient.PeekMessages();

// Update the message contents
    queueClient.UpdateMessage(message[0].MessageId,
            message[0].PopReceipt,
            "Updated contents",
            TimeSpan.FromSeconds(60.0)  // Make it invisible for another 60 seconds
        );
```

De-queue the next message

```csharp
// Instantiate a QueueClient which will be used to manipulate the queue
QueueClient queueClient = new QueueClient(connectionString, queueName);

if (queueClient.Exists())
{
    // Get the next message
    QueueMessage[] retrievedMessage = queueClient.ReceiveMessages();

    // Process (i.e. print) the message in less than 30 seconds
    Console.WriteLine($"Dequeued message: '{retrievedMessage[0].Body}'");

    // Delete the message
    queueClient.DeleteMessage(retrievedMessage[0].MessageId, retrievedMessage[0].PopReceipt);
}
```
