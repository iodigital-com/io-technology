---
title: 'Develop event-based solutions Cheatsheets'
date: '2022-11-06'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam', 'event']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

# Azure Event Grid

Concepts

- **Events** - What happened.
- **Event sources** - Where the event took place.
- **Topics** - The endpoint where publishers send events.
- **Event subscriptions** - The endpoint or built-in mechanism to route events, sometimes to more than one handler. Subscriptions are also used by handlers to intelligently filter incoming events.
- **Event handlers** - The app or service reacting to the event.

Each event in the array is limited to **1 MB**. If an event or the array is greater than the size limits, you receive the response `413 Payload Too Large`

Event Schema

```json
[
  {
    "topic": string,//Not Required
    "subject": string,
    "id": string,
    "eventType": string,
    "eventTime": string,
    "data":{ //Not Required
      object-unique-to-each-publisher
    },
    "dataVersion": string,//Not Required
    "metadataVersion": string//Not Required
  }
]
```

Azure Event Grid natively supports events in the JSON implementation of **CloudEvents v1.0** and **HTTP protocol binding**

### Event Delivery

retry doesn't happen:

- Azure Resources : (`400 Bad Request`, `413 Request Entity Too Large`, `403 Forbidden`)
- Webhok : (`400 Bad Request`, `413 Request Entity Too Large`, `403 Forbidden`, `404 Not Found`, `401 Unauthorized`)

If Dead-Letter isn't configured for an endpoint, events will be dropped when the above errors happen.

### Retry policy

- **Maximum number of attempts** - The value must be an integer between 1 and 30. The default value is 30.
- **Event time-to-live (TTL)** - The value must be an integer between 1 and 1440. The default value is 1440 minutes

```
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --max-delivery-attempts 18

```

### Output batching

- **Max events per batch** - Maximum number of events Event Grid will deliver per batch.
- **Preferred batch size in kilobytes** - Target ceiling for batch size in kilobytes. Similar to max events,

### Dead-letter events

Event Grid **dead-letters** an event when one of the following conditions is met.

- Event isn't delivered within the **time-to-live** period.
- The **number of tries** to deliver the event exceeds the limit.

If Event Grid receives a `400 (Bad Request)` or `413 (Request Entity Too Large)` response code, it **immediately** schedules the event for dead-lettering.

There is a **five-minute** delay between the last attempt to deliver an event and when it is delivered to the dead-letter location.

### Control access to events

- Event Grid Subscription Reader
- Event Grid Subscription Contributor
- Event Grid Contributor (manage Event Grid resources)
- Event Grid Data Sender

You must have the **Microsoft.EventGrid/EventSubscriptions/Write** permission on the resource that is the **event source**.

### Endpoint validation with Event Grid events

- **Synchronous handshake** : At the time of event subscription creation using a event with a `validationCode ` property.
- **Asynchronous handshake:** : Event Grid sends a `validationUrl` property in the data portion of the subs

### Filter events

options for filtering:

**Event types**

```json
"filter": {
  "includedEventTypes": [
    "Microsoft.Resources.ResourceWriteFailure",
    "Microsoft.Resources.ResourceWriteSuccess"
  ]
}
```

**Subject begins with or ends with**

```json
"filter": {
  "subjectBeginsWith": "/blobServices/default/containers/mycontainer/log",
  "subjectEndsWith": ".jpg"
}
```

**Advanced fields and operators**

```json
"filter": {
  "advancedFilters": [
    {
      "operatorType": "NumberGreaterThanOrEquals",
      "key": "Data.Key1",
      "value": 5
    },
    {
      "operatorType": "StringContains",
      "key": "Subject",
      "values": ["container1", "container2"]
    }
  ]
}
```

### using Azure CLI

Register the Event Grid resource provider

```
az provider register --namespace Microsoft.EventGrid
```

Create a custom topic

```
az eventgrid topic create --name $myTopicName \
    --location $myLocation \
    --resource-group az204-evgrid-rg
```

Create a message endpoint

```
az deployment group create \
    --resource-group az204-evgrid-rg \
    --template-uri "https://raw.githubusercontent.com/Azure-Samples/azure-event-grid-viewer/main/azuredeploy.json" \
    --parameters siteName=$mySiteName hostingPlanName=viewerhost
```

Subscribe to a custom topic

```
endpoint="${mySiteURL}/api/updates"
subId=$(az account show --subscription "" | jq -r '.id')

az eventgrid event-subscription create \
    --source-resource-id "/subscriptions/$subId/resourceGroups/az204-evgrid-rg/providers/Microsoft.EventGrid/topics/$myTopicName" \
    --name az204ViewerSub \
    --endpoint $endpoint
```

### Send an event to your custom topic

Retrieve URL and key for the custom topic.

```
topicEndpoint=$(az eventgrid topic show --name $myTopicName -g az204-evgrid-rg --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name $myTopicName -g az204-evgrid-rg --query "key1" --output tsv)
```

```
event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Contoso", "model": "Monster"},"dataVersion": "1.0"} ]'


curl -X POST -H "aeg-sas-key: $key" -d "$event" $topicEndpoint
```

# Azure Event Hubs

key concepts:

- **Event Hub client** is the primary interface for developers interacting with the Event Hubs client library.
- **Event Hub producer** is a type of client that **serves as a source of telemetry** data
- **Event Hub consumer**: is a type of client which **reads** information from the Event Hub and allows processing of it.
- **partition** is an **ordered sequence of events** that is held in an Event Hub. The number of partitions is specified at the time an Event Hub is created and cannot be changed.
- **consumer group** is a view of an entire Event Hub. Consumer groups enable multiple consuming applications to each have a separate view of the event stream
- **Event receivers**: Any entity that reads event data from an event hub.
- **Throughput units** or **processing units**: Pre-purchased units of capacity that control the throughput capacity of Event Hubs.

### Event Hubs Capture

Event Hubs is a time-retention durable buffer for telemetry ingress
Captured data is written in `Apache Avro format`

Event Hubs traffic is controlled by **throughput units**.

A single throughput unit allows **1 MB per second** or **1000 events per second** of ingress and twice that amount of egress.

### Scaling

**Partition ownership tracking**

Ownership of partitions is evenly distributed among all the active event processor instances associated with an event hub and consumer group combination.

**Checkpointing**
Checkpointing is a process by which an event processor marks or commits the position of the last successfully processed event within a partition.

### Control access to events

built-in roles for authorizing access

- **Azure Event Hubs Data Owner**: complete access to Event Hubs resources.
- **Azure Event Hubs Data Sender**: send access to Event Hubs resources.
- **Azure Event Hubs Data Receiver**: receiving access to Event Hubs resources.

### Publish events to an Event Hub

```csharp
await using (var producer = new EventHubProducerClient(connectionString, eventHubName))
{
    using EventDataBatch eventBatch = await producer.CreateBatchAsync();
    eventBatch.TryAdd(new EventData(new BinaryData("First")));
    eventBatch.TryAdd(new EventData(new BinaryData("Second")));

    await producer.SendAsync(eventBatch);
}
```

### Read events from an Event Hub partition

```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

string consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;

await using (var consumer = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName))
{
    EventPosition startingPosition = EventPosition.Earliest;
    string partitionId = (await consumer.GetPartitionIdsAsync()).First();

    using var cancellationSource = new CancellationTokenSource();
    cancellationSource.CancelAfter(TimeSpan.FromSeconds(45));

    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsFromPartitionAsync(partitionId, startingPosition, cancellationSource.Token))
    {
        // At this point, the loop will wait for events to be available in the partition.  When an event
        // is available, the loop will iterate with the event that was received.  Because we did not
        // specify a maximum wait time, the loop will wait forever unless cancellation is requested using
        // the cancellation token.
    }
}
```

### Process events using an Event Processor client

```csharp
var cancellationSource = new CancellationTokenSource();
cancellationSource.CancelAfter(TimeSpan.FromSeconds(45));

var storageConnectionString = "<< CONNECTION STRING FOR THE STORAGE ACCOUNT >>";
var blobContainerName = "<< NAME OF THE BLOB CONTAINER >>";

var eventHubsConnectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";
var consumerGroup = "<< NAME OF THE EVENT HUB CONSUMER GROUP >>";

Task processEventHandler(ProcessEventArgs eventArgs) => Task.CompletedTask;
Task processErrorHandler(ProcessErrorEventArgs eventArgs) => Task.CompletedTask;

var storageClient = new BlobContainerClient(storageConnectionString, blobContainerName);
var processor = new EventProcessorClient(storageClient, consumerGroup, eventHubsConnectionString, eventHubName);

processor.ProcessEventAsync += processEventHandler;
processor.ProcessErrorAsync += processErrorHandler;

await processor.StartProcessingAsync();

try
{
    // The processor performs its work in the background; block until cancellation
    // to allow processing to take place.

    await Task.Delay(Timeout.Infinite, cancellationSource.Token);
}
catch (TaskCanceledException)
{
    // This is expected when the delay is canceled.
}

try
{
    await processor.StopProcessingAsync();
}
finally
{
    // To prevent leaks, the handlers should be removed when processing is complete.

    processor.ProcessEventAsync -= processEventHandler;
    processor.ProcessErrorAsync -= processErrorHandler;
}
```
