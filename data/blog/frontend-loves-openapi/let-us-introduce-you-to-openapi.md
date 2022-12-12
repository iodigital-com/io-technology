---
title: 'Let us introduce you to OpenAPI'
date: '2022-12-22'
tags: ['frontend', 'API', 'Architecture']
summary: ''
authors: ['maarten-van-hoof']
serie: 'frontend-loves-openapi'
---

```yaml
# Better intro
```

OpenAPI files can be written in both JSON and YAML format.

Allow me to walk you through the basic structure of an OpenAPI document.

## Main sections

```yaml
# Specification version
openapi: ...

# General API metadata
info: ...

# Server information. BaseURLs, environments, ...
servers: ...

# Available paths & operations
paths: ...

# Datamodel abstraction
components: ...

# Security mechanisms can be used across the API
security: ...

# Grouping of paths & components
tags: ...

# Additional external documentation
external docs: ...

# Webhook operations, similar to paths, only API is now a consumer.
webhooks: ...
```

On the first level, we describe a few general sections and properties. First, we need to declare our OpenAPI version. This is to ensure compatibility with certain types of tooling.

Then we can declare some general information. Who has written this document, where to contact the authors, etc.

In the servers section, we can declare multiple base URLs on which the API will be available. For instance, when you have various environments available.

The first major section of a typical OpenAPI document is the paths section. Here we describe our operations, which are a combination of endpoints and HTTP methods.

Then we can describe the required data that the consumer has or can provide:

- Query string parameters
- URL parameters
- Request bodies

The data that the API can respond with

- Status codes
- Content types
- Data formats

The second major section is the components section. The OpenAPI specification extends the JSON schema specification. It allows us to reuse parts of our internal and external documents with the power of JSON schema references. In the components section, we can abstract and define data models that we can then refer to from our operations.

We define the security mechanisms to which our API validates the consumer, and we can then link each mechanism to the operations needing authentication.

We can add taxonomy to group our operations, provide links to external documentation and declare webhooks where the API now becomes a consumer itself.

## Paths

In paths, we first declare the URL the operation is available on, then the HTTP method. The combination of a URL and an HTTP method is called an operation in the OpenAPI context. In an operation, we can declare the parameters or requestBody it should or can receive and how it should respond.

We can also declare an operationId, which most tooling uses as an identifier for other functionalities, a summary or description to better describe the functionality this operation offers, which security schemes this operation has to adhere to, etc.

We declare an operation response by stating a status code or the keyword default for a default response an operation should return when the defined status codes don't suffice. Very handy to declare a default error response that produces the same error format for all erroneous status codes.

Then we declare the Content-Type, the API with which the provider will respond. RESTful APIs aren't limited by responding only in JSON. XML, plain text, HTML, and binaries are also possible Content-Types one can define.

Then, we'll define the data model with which our API provider will respond. This can be the entire definition of a component at once or a reference to a component defined in the root-level section Components.

The OpenAPI specification extends the JSON schema specification and allows us to use one of its powerful features: References. With references, we can refer to other parts of the document or refer to parts of external documents.

## Components

In the [components](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#components-object) object, we can describe data models we can reuse throughout our document thanks to JSON schema references' power with the $ref keyword. [More information about the &dollar;ref keyword can be found here](https://json-schema.org/understanding-json-schema/structuring.html#ref). It allows us to keep our OpenAPI document a bit cleaner, [with less repetition and more DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

```yaml
# Code example
```

The Components object has several [fixed fields](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#fixed-fields-6) to subcategorise the type of component we declare.

- `schemas`: Input and output data types.
- `responses`: Response objects
- `parameters`: Operation parameters; path, query-string, ...
- `examples`: Example objects that can describe more realistic data
- `requestBodies`: RequestBody objects
- `headers`: Header objects
- `securitySchemes`: securitySchemes Objects
  ...

In the schema object, we describe a document's most atomic level of data objects: our responses' input and output types, requestBodies, parameters, etc.

```yaml
# Code example
```

For example, we describe our Pet as an object. It has the properties id, name, image, and tag. All, except id, are described as values of the type string. Id is defined as a 64-bit integer. Id and name are described as required, meaning API consumers should consider that the image and tag value could not be in the returned data. We can then reuse our Pet component to create a Pets component, an array of the Pet component.

```yaml
# Talk about other components
```
