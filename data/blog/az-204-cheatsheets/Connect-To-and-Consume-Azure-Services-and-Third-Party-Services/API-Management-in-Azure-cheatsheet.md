---
title: 'API Management in Azure Cheatsheets'
date: '2022-11-05'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam', 'api']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
---

# API Management in Azure

API Management helps organizations publish APIs to external, partner

## components:

- API gateway

  - Accepts API calls and routes them to your backend(s).
  - Verifies API keys, JWT tokens, certificates, and other credentials.
  - Enforces usage quotas and rate limits.
  - Transforms your API on the fly without code modifications.
  - Caches backend responses where set up.
  - Logs call metadata for analytics purposes.

- Azure portal : administrative interface

  - Define or import API schema.
  - Package APIs into products.
  - Set up policies like quotas or transformations on the APIs.
  - Get insights from analytics.
  - Manage users.

- Developer portal :
  - Read API documentation.
  - Try out an API via the interactive console.
  - Create an account and subscribe to get API keys.
  - Access analytics on their own usage.

Products:

- Open:
- Protected: must be **subscribed** to before they can be used

Groups:

- Administrators: Azure subscription administrators , manage API Management service instances
- Developers: Authenticated developer portal users,the customers that build applications using your APIs
- Guests : Unauthenticated developer portal users,can be granted certain read-only access, such as the ability to view APIs but not call them

API gateways

- Gateway routing : reverse proxy to route requests to one or more backend services using layer 7 routing.
- Gateway aggregation: Use the gateway to aggregate multiple individual requests into a single request. This pattern applies when a single operation requires calls to multiple backend services
- Gateway Offloading: Use the gateway to offload functionality from individual services to the gateway, like SSL termination,
  Authentication,
  IP allow/block list,
  Client rate limiting (throttling),
  Logging and monitoring,
  Response caching,
  GZIP compression,
  Servicing static content

## API Management policies

collection of Statements that are executed sequentially on the request or response of an API.
simple **XML** document

`inbound`, `backend`, `outbound`, and `on-error`

```xml
<policies>
  <inbound>
    <!-- statements to be applied to the request go here -->
  </inbound>
  <backend>
    <!-- statements to be applied before the request is forwarded to
         the backend service go here -->
  </backend>
  <outbound>
    <!-- statements to be applied to the response go here -->
  </outbound>
  <on-error>
    <!-- statements to be applied if there is an error condition go here -->
  </on-error>
</policies>
```

Filter response content

- Control flow - Conditionally applies policy statements based on the results of the evaluation of Boolean expressions.
- Forward request - Forwards the request to the backend service.
  Limit concurrency - Prevents enclosed policies from executing by more than the specified number of requests at a time.
- Log to Event Hub - Sends messages in the specified format to an Event Hub defined by a Logger entity.
- Mock response - Aborts pipeline execution and returns a mocked response directly to the caller.
- Retry - Retries execution of the enclosed policy statements, if and until the condition is met. Execution will repeat at the specified time intervals and up to the specified retry count.

### Control Flow (Condition)

```xml
<choose>
    <when condition="Boolean expression | Boolean constant">
        <!— one or more policy statements to be applied if the above condition is true  -->
    </when>
    <when condition="Boolean expression | Boolean constant">
        <!— one or more policy statements to be applied if the above condition is true  -->
    </when>
    <otherwise>
        <!— one or more policy statements to be applied if none of the above conditions are true  -->
</otherwise>
</choose>
```

### Forward request

forwards the incoming request to the backend service specified in the request context

```xml
<forward-request timeout="time in seconds" follow-redirects="true | false"/>
```

### Limit concurrency

revents enclosed policies from executing by more than the specified number of requests at any time
`429 Too Many Requests status code`

```
<limit-concurrency key="expression" max-count="number">
        <!— nested policy statements -->
</limit-concurrency>

```

### Log to Event Hub

saving selected request or response context information

```xml
<log-to-eventhub logger-id="id of the logger entity" partition-id="index of the partition where messages are sent" partition-key="value used for partition assignment">
  Expression returning a string to be logged
</log-to-eventhub>
```

### Mock response

aborts normal pipeline execution and returns a mocked response to the calle

It generates sample responses from schemas, when schemas are provided and examples are not. If neither examples or schemas are found, responses with no content are returned

```xml
<mock-response status-code="code" content-type="media type"/>
```

### Retry

The retry policy executes its child policies once and then retries their execution until the **retry condition becomes false** or **retry count is exhausted**.

```xml
<retry
    condition="boolean expression or literal"
    count="number of retry attempts"
    interval="retry interval in seconds"
    max-interval="maximum retry interval in seconds"
    delta="retry interval delta in seconds"
    first-fast-retry="boolean expression or literal">
        <!-- One or more child policies. No restrictions -->
</retry>
```

### Return response

aborts pipeline execution and returns either a default or custom response to the caller. Default response is 200 OK with no body

```xml
<return-response response-variable-name="existing context variable">
  <set-header/>
  <set-body/>
  <set-status/>
</return-response>
```

:

## Secure APIs

- subscription keys

  A subscription key is a unique auto-generated key that can be passed through in the headers of the client request or as a query string parameter

  subscription scopes are:

  - All APIs
  - Single API
  - Product

  Every subscription has two keys, a primary and a secondary. Having two keys makes it easier when you do need to regenerate a key

- OAuth2.0
- Client certificates and
- IP allow listing.

### Call an API with the subscription key

must include a valid key in all HTTP request

The default header name is `Ocp-Apim-Subscription-Key`, and the default query string is `subscription-key`.

### Secure APIs by using certificates

inspect the certificate contained within the client request and check for properties like:

- Certificate Authority (CA)
- Thumbprint
- Subject
- Expiration Date

two common ways to verify a certificate::

- Check who issued the certificate
- self-signed certificates (If the certificate is issued by the partner, verify that it came from them. )

In the Consumption tier, you must explicitly enable the use of client certificate

inbound processing policy

### Check the thumbprint of a client certificate

```xml
<choose>
   <when condition="@(context.Request.Certificate == null || context.Request.Certificate.Thumbprint != "desired-thumbprint")" >
       <return-response>
           <set-status code="403" reason="Invalid client certificate" />
       </return-response>
   </when>
</choose>
```

### Check the thumbprint against certificates uploaded to API Management

Usually, each customer or partner company would pass a different certificate with a different thumbprint

Client certificates page in the Azure portal to upload them to the API Management resource

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || !context.Request.Certificate.Verify()  || !context.Deployment.Certificates.Any(c => c.Value.Thumbprint == context.Request.Certificate.Thumbprint))" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>
```

## Create a backend API

Create APIM instance

```
az apim create -n $myApiName \
    --location $myLocation \
    --publisher-email $myEmail  \
    --resource-group az204-apim-rg \
    --publisher-name AZ204-APIM-Exercise \
    --sku-name Consumptionhk
```
