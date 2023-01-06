---
title: 'Server-sent events (SSE)'
date: '2023-01-06'
tags: ['network', 'frontend', 'communication']
summary: "With Server-sent events, you don't need to ask the server if an event has happened. SSE is sent when the server wants to."
authors: ['lucien-immink']
theme: 'blue'
---

Communicating data between client and server is something that the web is all about. Loading a webpage and its assets is done by having the client request the webpage and the server responds by sending the actual webpage to the client. What if the server wants to send additional info to the client? Or all the clients that are currently connected? Classic HTTP connections are initiated by the client and are closed when the data has been transferred. Let's explore some options available in modern browsers.

## Polling

![Polling is done by requesting and responding over and over again](/articles/sse/polling.webp)

One of the easiest ways to get updates is by requesting if there is new data. By calling the server at regular intervals the client will get the updates in a timely manner, but what is timely? How many times does the client need to call the server? What happens if a lot of clients are calling the server at the same time? Depending on the use case polling can be a valid technique to get updates from the server. In case the data changes in irregular intervals a polling request/response results in a lot of unnecessary HTTP calls. If the data changes multiple times per second a polling request/response might miss a lot of these changes since the client will only get the response of the request it has sent, but that also depends on the serverside implementation.

### Polling client-side example

```javascript
const POLL_INTERVAL = 1000

const poll = async () => {
  const response = await fetch('/endpoint')
  const json = await response.json()
  /*
  ... do stuff with the JSON
  */

  // now call ourselve again to check for new data
  setTimeout(() => {
    poll()
  }, POLL_INTERVAL)
}
```

## WebSockets

![WebSockets](/articles/sse/websockets.webp)

For real-time updates, polling is not a valid option due to the HTTP overhead of opening and closing the connection. For this WebSockets were created and standardized in 2011. Based on TCP but different from HTTP WebSockets use their native protocols `ws` and `wss`. WebSockets enable interaction between client and server with lower overhead alternatives like polling. The socket connection remains open and both client and server have event-based listeners for reacting to any data sent over and forth.

To establish a WebSocket connection, the client sends a WebSocket handshake request, for with the server returns a WebSocket response. The request has the `Upgrade: websocket` header to indicate that a WebSocket connection is requested. The method of setting up a WebSocket allows the server to handle both HTTP requests and WebSocket connections on the same port. Once the handshake is complete, communication switches to the bidirectional WebSocket protocol.

WebSocket requests are not restricted by the same-origin policy as regular HTTP requests are. The server needs to validate the `origin` header during the HTTP handshake to avoid cross-site hijacking attacks.

### WebSockets client-side example

```javascript
const socket = new WebSocket('wss://my-domain.io/ws/stream')

socket.onopen = () => {
  // connection is now established as WebSocket
}

// client sending data to the server
socket.send('here is my message')

socket.onmessage = (event) => {
  // a new message is received
  /*
  ... do something with event.data
  */
}

socket.onclose = () => {
  // the server closed the connection
}

socket.onerror = (event) => {
  // the connection is closed due to an error
}
```

## Server-sent events

![sse-single-client](/articles/sse/sse-single-client.webp)

Server-sent events (SSE for short) are a low-overhead technique for sending data from a server in real-time once the client establishes the connection. They are commonly used to send updates or continuous data to one or multiple clients using the browser's `EventSource` API. The biggest differences between WebSockets and SSE are that SSE is server-to-client communication only and that SSE is based on HTTP and as such is as secure as HTTP is.

The mimetype for SSE is `text/event-stream`, indicating that only text-based data can be send.

Messages have a specific structure, this structure can be used to bind specific event listeners to the stream. All messages have the `data:` prefix and can be preceded by an `event:` line. The `event:` line is optional. The `onmessage` method of the `EventSource` will capture all messages as long as they are prefixed with `data:`. Specific event listeners will only capture messages that are preceded by the matching `event:` line.

```text
event: event-type
data: string based data

data: this is a generic message

event: some-other-type
data: { "complex": { "data": "data can be a json string" }}

```

### SSE client-side example

```javascript
const stream = new EventSource('/stream')

stream.onopen = () => {
  // the EventStream is opened
}

stream.onmessage = (event) => {
  // a new message is received
  /*
  ... do something with event.data
  */
}

stream.addEventListener('event-type', (event) => {
  // only messages of the `event: event-type` are captured
})

stream.onerror = event = {
  // an error occured, by default the SSE connection is restarted automatically
  // close the connection permanently by calling stream.close();
}
```

### SSE server-side example

For the server, SSE is handled as any HTTP request. Keep a list of connected clients to send broadcasted events. Keep in mind that the mimetype for SSE is `text/event-stream` and that must be set as the `content-type` response header. The response itself should never be cached meaning that the `cache-control` response header needs to be set as well. Always close the message with a blank line.

```javascript
let clients = []

const sse = (request, response, next) => {
  response.header('Content-Type', 'text/event-stream')
  response.header('Cache-Control', 'no-store, no-cache')
  response.connection.setTimeout(0)

  // add client to list
  const clientId = 'some-id'
  clients.push({
    clientId,
    response,
  })

  // write a string response when needed.
  response.write(
    `data: ${JSON.stringify({ clientId, message: 'Welcome to the event-stream' })}\n\n`
  )

  request.on('close', () => {
    // remove the client from the clientslist
    clients = clients.filter((client) => client.clientId !== clientId)

    // end the response when the client disconnects
    response.end()
  })
}

// some other module that wants to send messages
clients.forEach((client) => {
  client.response.write(`event: my-module\n`)
  client.response.write(`data: ${JSON.stringify({ complex: { data: 'message ' } })}\n\n`)
})
```

## Wrap-up

Classic HTTP connections are closed after the response is sent. To get updated data the client can request new data over and over again (polling) or by setting up a special WebSocket connection. WebSockets are bi-directional but not based on HTTP. Server-sent events (SSE) are HTTP connections using the `text/event-stream` mimetype that do not close. Servers can send messages when needed but SSE does not allow for client-to-server communication.
