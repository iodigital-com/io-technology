---
title: 'Let me introduce you to OpenAPI'
date: '2023-01-11'
tags: ['frontend', 'API', 'Architecture']
summary: 'OpenAPI allows us to improve effeciency between teams and interdependent projects. It allows us to describe our API in a single document. In this part of the series, we will take you through the most important parts of an OpenAPI document.'
authors: ['maarten-van-hoof']
serie: 'frontend-loves-openapi'
---

[In the previous part of this series](openapi-a-contract-for-rest-ful-apis), we introduced you to the purpose of contracts between API providers and consumers. This visibility allows us to improve efficiency between teams and interdependent projects, wether that be internal or external projects.

Let us walk you through a few sections of an OpenAPI document, the ones that will most likely the largest part of your document and where most of the information is stored.

## Main sections

OpenAPI files can be written in both JSON and YAML format. For brevity, we will use the YAML format.

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

On the first level, we describe a few general sections and properties. First, we need to declare our **OpenAPI version**. This is to ensure compatibility with certain types of tooling.

Next, we can declare some **general information** with the **info** property. Who has written this document, where to contact the authors, etc.

In the **servers** section, we can declare multiple base URLs on which the API will be available. For instance, when you have various environments available.

The first major section of a typical OpenAPI document is the **paths** section. Here we describe our operations, which are a combination of paths and HTTP methods. These operations describe the required data that the consumer has or can provide, like query string parameters, URL parameters, request bodies and the data that the API can respond with, status codes, content types, and data formats.

The second major section is the **components** section. The OpenAPI specification extends the JSON schema specification. It allows us to reuse parts of our internal and external documents with the power of JSON schema references. In the components section, we can abstract and define data models that we can refer to from our operations.

We define the security mechanisms to which our API validates the consumer in the **security** section, and link each mechanism to the operations needing a specific mechanism.

In the **tags** section, we can add taxonomy to group our operations, provide links to external documentation and declare webhooks where the API now becomes a consumer itself.

Furthermore, we can add **external documentation** to our API if the format of this document does not suffice your needs, and we can declare **webhooks** where the API now becomes a consumer itself.

## Paths

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      #...
    post:
      summary: Create a pet
      #...

  /pets/{petId}:
    get:
      summary: Info for a specific pet
      #...
```

In paths, we first declare the URL the operation is available on, next the HTTP method. The combination of a URL and an HTTP method is called an **operation** in the OpenAPI context.

### Operations

```yaml
paths:
  /pets:
    get:
      # A unique identifier for this operation. Mostly used in OpenAPI tooling.
      operationId: listPets
      # A short summary of what the operation does
      summary: List all pets
      # A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
      tags:
        - pets
      parameters:
        - name: limit
          # It is a query string parameter
          in: query
          # A more thorough description of what this parameter does to a request
          description: Limit how many pets this API will return.
          # It is not required
          required: false
          # It must be an 32-bit integer
          schema:
            type: integer
            format: int32

      # description
      # requestBody
      # security
      # ...

      responses:
        #...
```

In an operation, we can declare the parameters or requestBody it should or can receive and how it should respond. We can also declare an **operationId**, which most tooling uses as an identifier for other functionalities, a **summary** or **description** to better describe the functionality this operation offers, which **security schemes** this operation has to adhere to, etc.

### Responses

```yaml
paths:
  /pets:
    get:
      #...

      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pets'
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

We declare an operation **response** by stating a **status code** or the keyword **default** for a default response an operation should return when the defined status codes don't suffice. Very handy to declare a default error response that produces the same error format for all erroneous status codes.

Then we declare the **Content-Type** with which the provider will respond. RESTful APIs aren't limited by responding only in JSON. XML, plain text, HTML, and also binaries are possible Content-Types one can define.

Next, we'll define the data model with which our API provider will respond. This can be the entire definition of a component at once or a reference to a component defined in the root-level section Components.

The OpenAPI specification extends the JSON schema specification and allows us to use one of its powerful features: References. With references, we can refer to other parts of the document or refer to parts of external documents. References are declared with the `$ref` keyword.

I'll explain more about the declaration of data models in the next section, but for now, we'll just use a reference to a component.

## Components

In the [components](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#components-object) object, we can describe data models we can reuse throughout our document thanks to JSON schema references' power with the $ref keyword. [More information about the &dollar;ref keyword can be found here](https://json-schema.org/understanding-json-schema/structuring.html#ref). It allows us to keep our OpenAPI document a bit cleaner, [with less repetition and more DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

```yaml
components:
  schemas:
    Pet:
    Pets:

  responses:
    ErrorResponse:

  requestBodies:
    NewPet:

  headers:
    Limit:
    Offset:
    Pagination:
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

### Schemas

In the schema object, we describe a document's most atomic level of data objects: our responses' input and output types, requestBodies, parameters, etc.

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        image:
          type: string
        tag:
          type: string
      required:
        - id
        - name

    Pets:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
```

For example, we describe our Pet as an object. It has the properties id, name, image, and tag. All, except id, are described as values of the type string. Id is defined as a 64-bit integer. Id and name are described as required, meaning API consumers should consider that the image and tag value could not be in the returned data. We can reuse our Pet component to create a Pets component, an array of the Pet component.

## Conclusion

In this article, we've seen how to define an OpenAPI document. We've seen how to define the metadata of our API, the **operations** it offers, the **responses** it can return, and how to define and reuse the data models it uses.

In the next part of this series, we'll show you ways of integrating OpenAPI in to your team and project workflows.
