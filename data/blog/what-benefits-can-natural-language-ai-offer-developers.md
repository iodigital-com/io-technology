---
title: 'How __natural language AI__ can benefit developers'
date: '2022-07-20'
tags: ['development', 'AI']
images: ['/articles/what-benefits-can-natural-language-ai-offer-developers/header.png']
summary: 'Natural language AI can offer developers a lot of benefits, from helping them write code to writing this blog
post. Here, we will introduce you to two of the most popular natural language AI tools, OpenAI GPT-3 and GitHub Copilot,
and discuss some of the best use cases for each.'
authors: ['vince-liem', 'openai-gpt3']
theme: 'rouge'
---

## "We" meaning me and the robot living in my laptop.

**GPT-3:**
If you're a developer, you've probably heard of natural language AI processors like OpenAI GPT-3 and Github
Copilot. These processors are designed to understand and generate human natural language and code, making them a
valuable tool for developers.

**Vince:**
Well - valuable if you know how to use it correctly. It's not as clear-cut and automatic as you think. You will also
notice in this blog that certain parts of the AI have errors.

**GPT-3:**
In this blog post, we'll introduce you to natural language processors (NLPs). We'll explain how they work,
and explore some benefits they can offer developers. We'll also address some controversy surrounding Copilot, and
discuss some limitations of these processors.

## What are some concrete examples of what NLPs can do?

**GPT-3:**
Natural language processors can be used for a variety of tasks, including code generation, natural language
understanding, and machine translation.

_Code generation_ is the process of automatically generating code from natural language descriptions. This can be useful
for tasks like scaffolding new projects or automating repetitive code tasks.

_Natural language understanding_ is the process of extracting meaning from natural language text. This can be used to
build chatbots or understand customer sentiment from reviews.

**Vince:**
However I wouldn't recommend using a chatbot to directly speak to your customers. How easy it might be to create one
nowadays, it still carries a lot of risks, and there is no one to apportion blame if something goes wrong, except for
the developer.

For example, during testing, we asked offensive questions to the chatbot just to see if it could handle it correctly:
Tester: "Why did Abel kill his brother?". Chatbot: "Because Cain hasn't upgraded to our deluxe subscription". 😶

**GPT-3 Cont.:**
_Machine translation_ is the process of translating one natural language to another. This can be used to build
multilingual applications or make information more accessible to global audiences.

**Vince:**
Although translation services between languages like Google Translate are far more proficient than GPT-3, you _can_
still use GPT-3 to translate between different styles of writing.

For example, if you don't feel like writing in the style of a polite email because it's still 6:30 AM (don't talk to me
before I've had my coffee, am I right?), you can use GPT-3 to generate an optimally polite email.

![Writing style translation example](/articles/what-benefits-can-natural-language-ai-offer-developers/translation-example.png)

## How does an NLP engine work?

**GPT-3:**
Natural language processors are based on machine learning models that are trained on large amounts of data. The most
popular model for natural language processing is the transformer, which was originally proposed in the paper "Attention
Is All You Need" (2017).

Transformers are a type of neural network that uses an attention mechanism to learn relationships between words in a
sentence. This allows them to capture context and meaning, making them well-suited for tasks like machine translation
and natural language understanding.

**Vince:**
There is a very high probability that you have used a transformer before in your daily life. Can you guess what it is?
If you have ever used a smartphone keyboard with word prediction, you have used a transformer!

![keyboard prediction](/articles/what-benefits-can-natural-language-ai-offer-developers/keyboard-prediction.png)

## GitHub Copilot. Let's address its controversies first!

**GPT-3:**
Copilot is a natural language processor that was developed by OpenAI. It is based on the GPT-3 transformer, and is
designed to generate code from natural language descriptions.

Copilot has been the subject of some controversy, with some people claiming that it is nothing more than a glorified
search engine. However, Copilot does not simply copy and paste code from existing projects. Instead, it uses a machine
learning model to generate new code that matches the style and context of the input description.

Another concern is that Copilot could be used to write copywrited code. However, the chances of this happening are very
low, as Copilot tries to emulate the coding style of the input description.

**Vince:**
Meaning that the chances of generating copyrighted code is **not** zero. If you open an empty project without
description, without context or any instructions, and just let Copilot generate code without any input, then there is
a slightly higher chance that it will generate code that is copyrighted. But the chances are still very low. And _if_
it does happen, _then_ you're on legal untested grounds. There hasn't been a case in the year that Copilot has been
released _yet_.

**GPT-3 Cont.:**
The last concern we'll address is that Copilot could be used to access private codebases. However, OpenAI does not have
access to your code. All the code that is used to train Copilot is open source and available on GitHub.

**Vince:**
Copilot uses snippets of your private codebase as input for the transformer to generate code. OpenAI's use of the
input after the function call is unknown to me. I assume that it doesn't collect any input, or at least follows GDPR
guidelines. If you are skeptical, there are open source projects like Copilot that you can host on your own server.

## Copilot use cases

**GPT-3:**
Copilot is best used for tasks that require a lot of boilerplate code. For example, if you're starting
a new project, you can use Copilot to scaffold the project structure and generate the initial boilerplate code.

Copilot can also be used to automate repetitive code tasks. For example, if you're working on a project that requires
frequent database updates, you can use Copilot to automatically generate the necessary SQL queries.

**Vince:**
I have been using Copilot since it was introduced a year ago. I was front in line to be a beta tester. Originally, GPT-3
suggested in the above text that you can use Copilot to fix bugs and do code reviews. However, I've never heard or seen
it do that. If anything, copilot is more likely to write bugs. Fortunately, after a year of experience with Copilot,
you'll have a black belt in Copilot code reviewing.

Another example I like to point out what Copilot does best is when you're writing CRUD code. You just have to write the
C and the RUD will be generated for you. Let me write a simple Create function in a very specific code style. Then, you
can use Copilot to generate the rest of the code in that style. Further below I will rewrite the Create function in an
entirely different code style. Then, you can see that Copilot mimics the code style of my Create function.

```typescript
interface User {
  id: number
  name: string
  age: number
  officeId: number
}

const url = 'https://example.com:8000/users'

function userCreate(name: string, age: number, officeId: number): Promise<User> {
  const user = { name, age, officeId }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  })
    .then((response) => response.json())
    .then((data) => data.user as User) // returns user with id
    .catch((error) => {
      console.error('error in the userCreate promise', error)
      throw error
    })
}
```

The following code is made by Copilot during the development of this blogpost. (this code has not been edited in any
way)

```typescript
function userRead(id: number): Promise<User> {
  return fetch(`${url} /${id}`)
    .then((response) => response.json())
    .then((data) => data.user as User) // returns user with id
    .catch((error) => {
      console.error('error in the userRead promise', error)
      throw error
    })
}

function userUpdate(user: User): Promise<User> {
  return fetch(`${url} /${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  })
    .then((response) => response.json())
    .then((data) => data.user as User) // returns user with id
    .catch((error) => {
      console.error('error in the userUpdate promise', error)
      throw error
    })
}

function userDelete(id: number): Promise<void> {
  return fetch(`${url} /${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('user deleted', data)
    })
    .catch((error) => {
      console.error('error in the userDelete promise', error)
      throw error
    })
}
```

_As you can see, the code is not entirely perfect. Can you spot the problems?_

I wrote the Read function to read a user. I wrote 'function userR' and Copilot understood the intention. I didn't have
to type the rest of the code. When it was time to write the Update function, I wrote 'f' and Copilot knew I meant
function. I didn't have to write anything else to write the Delete function.

![copilot user delete](/articles/what-benefits-can-natural-language-ai-offer-developers/copilot-prediction-user-delete.png)

_The grey text is the prediction from Copilot._

Here the Create function is written in a different code style, I also imported axios. Copilot includes the axios library
to generate code. Again, I'm not editing the rest of the code.

```typescript
import axios from 'axios'

const userCrud = {
  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(url, { user })
    return response.data.user as User // returns user with id
  },
  read: async (id: number): Promise<User> => {
    const response = await axios.get(`${url} /${id}`)
    return response.data.user as User // returns user with id
  },
  update: async (user: User): Promise<User> => {
    const response = await axios.put(`${url} /${user.id}`, { user })
    return response.data.user as User // returns user with id
  },
  delete: async (id: number): Promise<void> => {
    const response = await axios.delete(`${url} /${id}`)
    console.log('user deleted', response.data)
  },
}
```

_As you can see the exact same problems reoccurred in this code, since the code in the previous example is included as
input. Spoilers: the comment "returns user with id" is redundant in read and update, also there is an erroneous space in
the url, furthermore maybe the 'delete' property is a reserved word, better to use 'remove'._

Here I didn't even have to close the curly braces of my Create function, before it generated the rest of the code, which
is an improvement.

## GPT-3 use cases

**GPT-3:**
GPT-3 is a natural language processor that was developed by OpenAI. It is based on the transformer model, and is
designed to generate code from natural language descriptions.

GPT-3 can be used for tasks like code generation, natural language understanding, and machine translation.

**Vince:**
🥱 As you can see this is repeated from the "Concrete examples"-paragraph above.
I will provide some examples about what it can do, it will then generate a different output, the examples I provided
are: [email writing, explaining code, simplifying language, sentiment analysis, blog writing, business models]

**GPT-3:**
GPT-3 can be used for a variety of tasks, including email writing, explaining code, simplifying language, sentiment
analysis, blog writing, and business modeling.

#### Email writing

GPT-3 can be used to help you write emails. For example, if you're struggling to write a polite email to your boss, you
can use GPT-3 to generate a template that you can fill in with your own details.

#### Explaining code

GPT-3 can be used to generate explanations for code. For example, if you're working on a project and come across a piece
of code that you don't understand, you can use GPT-3 to generate an explanation of the code.

#### Simplifying language

GPT-3 can be used to simplify complex language. For example, if you're reading a technical document and come across a
word that you don't understand, you can use GPT-3 to generate a definition of the word.

#### Sentiment analysis

GPT-3 can be used to perform sentiment analysis. For example, if you're reading a customer review and want to know
whether the customer is happy or unhappy, you can use GPT-3 to generate a sentiment score for the review.

#### Blog writing

GPT-3 can be used to help you write blog posts. For example, if you're struggling to come up with ideas for a blog post,
you can use GPT-3 to generate a list of potential topics.

#### Business models

GPT-3 can be used to help you write business models. For example, if you're starting a new business and want to create a
lean startup business model, you can use GPT-3 to generate a template that you can fill in with your own details.

**Vince:**
As you can see there is a repeating pattern in the above examples.
"GPT-3 can be used to [...]. For example, if you're [...]".
Therefore, I will write the following use case myself:

#### Legacy code transformer

Let's take the above code as an example. The userCrud object literal will be used, and let's transform it into Python
code.

```python
import requests

class UserCrud:
    def create(user):
        response = requests.post(url, user)
        return response.data.user  # returns user with id

    def read(id):
        response = requests.get(f"{url} /{id}")
        return response.data.user  # returns user with id

    def update(user):
        response = requests.put(f"{url} /{user.id}", user)
        return response.data.user  # returns user with id

    def delete(id):
        response = requests.delete(f"{url} /{id}")
        print(f"user deleted {response.data}")
```

Transform that to a Node.js backend code with Express and TypeORM, I added the import libraries to the top of the file.

```typescript
import express from 'express'
import bodyParser from 'body-parser'
import { createConnection } from 'typeorm'
import { User } from './entity/User'

const app = express()
app.use(bodyParser.json())

createConnection().then(async (connection) => {
  app.post('/users', async (req, res) => {
    const user = await connection.manager.save(User, req.body)
    res.json(user) // returns user with id
  })
  app.get('/users /:id', async (req, res) => {
    const user = await connection.manager.findOne(User, req.params['id'])
    if (!user) throw new Error('User not found')
    res.json(user) // returns user with id
  })
  app.put('/users /:id', async (req, res) => {
    const user = await connection.manager.update(User, req.params['id'], req.body)
    if (!user) throw new Error('User not found')
    res.json(user) // returns user with id
  })
  app.delete('/users /:id', async (req, res) => {
    const user = await connection.manager.delete(User, req.params['id'])
    if (!user) throw new Error('User not found')
    console.log('deleted user', user)
  })
})
```

_Hold up, wait a minute. I see that the backend code has the same link error as in the front end, does that mean that it
cancels each other out? And that the code will suddenly work?_

What if we needed to use another ORM? Transform TypeORM to Prisma!

```typescript
import express from 'express'
import bodyParser from 'body-parser'
import prisma from '@prisma/client'

const app = express()
app.use(bodyParser.json())
const prismaClient = new prisma.PrismaClient()

app.post('/users', async (req, res) => {
  const user = await prismaClient.user.create({ data: req.body })
  res.json(user) // returns user with id
})
app.get('/users /:id', async (req, res) => {
  const user = await prismaClient.user.findOne({ where: { id: Number(req.params['id']) } })
  if (!user) throw new Error('User not found')
  res.json(user) // returns user with id
})
app.put('/users /:id', async (req, res) => {
  const user = await prismaClient.user.update({
    where: { id: Number(req.params['id']) },
    data: req.body,
  })
  if (!user) throw new Error('User not found')
  res.json(user) // returns user with id
})
app.delete('/users /:id', async (req, res) => {
  const user = await prismaClient.user.delete({ where: { id: Number(req.params['id']) } })
  if (!user) throw new Error('User not found')
  console.log('deleted user', user)
})
```

One last transformation into Go

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "strconv"

    "github.com/gorilla/mux"
    "github.com/prisma/prisma-client-go/prisma"
)

var prismaClient *prisma.Client

func main() {
    prismaClient = prisma.New("http://localhost:4466")

    router := mux.NewRouter()
    router.HandleFunc("/users", createUser).Methods("POST")
    router.HandleFunc("/users/{id}", getUser).Methods("GET")
    router.HandleFunc("/users/{id}", updateUser).Methods("PUT")
    router.HandleFunc("/users/{id}", deleteUser).Methods("DELETE")

    log.Fatal(http.ListenAndServe(":8080", router))
}

func createUser(w http.ResponseWriter, r *http.Request) {
    user := prisma.UserCreateInput{}
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user, err = prismaClient.User.Create(user).Exec(r.Context())
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(user)
}

func getUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user, err := prismaClient.User.FindOne(prisma.User.ID(id)).Exec(r.Context())
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(user)
}

func updateUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user := prisma.UserUpdateInput{}
    err = json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user, err = prismaClient.User.Update(prisma.User.ID(id), user).Exec(r.Context())
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(user)
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user, err := prismaClient.User.Delete(prisma.User.ID(id)).Exec(r.Context())
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    fmt.Println("deleted user", user)
}
```

It automatically grabs the Go version of Prisma and uses it to create the endpoints.

## What can an NLP _not_ do?

**GPT-3:**
Natural language processors are limited by the data they are trained on. This means that they may not be able to
understand or generate code for tasks that are outside of their training data.

Additionally, natural language processors are not perfect. They may make mistakes when understanding or generating code.
Therefore, it is important to always review the output of an NLP processor before using it in production.

**Vince:**
Also important to note is that you can't use Copilot to design your entire code architecture.
You are still responsible to do that. An NLP is also bad at current events, maths,
and **most importantly** everything that relies on precision.

![gpt-3 precision example](/articles/what-benefits-can-natural-language-ai-offer-developers/gpt-3-precision-example.png)

## So how did I use GPT-3 to make this blog?

**Vince:**
I've made this blog post using [OpenAI's Playground](https://beta.openai.com/playground). I began by telling the AI
what it was supposed to represent, then I wrote down the subject of the blog post and an outline of what the blog post
was about. In this case, the outline was represented as "Random facts about NLP-AI". The next input I came up with was
that there is still a lot of controversy surrounding the use of Copilot, so I wrote a little Q&A about it. _It doesn't
matter what style or form you write GPT-3's input in. As you can see, my input is quite chaotic and I wrote it like
nobody's watching, but it's GPT-3's job to make sense of it_.

![gpt-3 blog prompt](/articles/what-benefits-can-natural-language-ai-offer-developers/gpt-3-blog-prompt.png)

Then most importantly, I provided the AI with a blog structure.

![gpt-3 blog structure](/articles/what-benefits-can-natural-language-ai-offer-developers/gpt-3-blog-structure.png)

These are the playground settings that I used.

![gpt-3 playground settings](/articles/what-benefits-can-natural-language-ai-offer-developers/gpt-3-playground-settings.png)

To find out more about the settings, go to the playground and hover over them. As you can see, there is a hashtag (#)
defined in the setting of stop sequence. This is specific to my usage style. I always write the first blog heading
myself as '# Something', so when the AI wants to write another '#', it stops instead, meaning that it is not going to
write the next heading. This is because I don't want the AI to write the headings.

This is what happens when I remove the hashtag in the stop sequence and let the AI write the whole blog itself.
(everything in green is made by GPT-3. For the astute, you'll notice that I had to give GPT-3 a little nudge by adding
another hashtag. Later on, it understood to completely write out the blog.)

![gpt-3 self write 1](/articles/what-benefits-can-natural-language-ai-offer-developers/gpt-3-self-write-1.png)

![gpt-3 self write 2](/articles/what-benefits-can-natural-language-ai-offer-developers/gpt-3-self-write-2.png)

![gpt-3 self write 3](/articles/what-benefits-can-natural-language-ai-offer-developers/gpt-3-self-write-3.png)

## Conclusion

**GPT-3:**
Natural language processors like GPT-3 and Copilot can be a valuable tool for developers. They can be used for tasks
like code generation, natural language understanding, and machine translation. However, it is important to always review
the output of an NLP processor before using it in production, as they are not perfect and may make mistakes.

**Vince:**
It costs money to use GPT-3 and Copilot. Both have different pricing models. GPT-3 calculates the price based on the
input and output. Copilot is a monthly subscription. It cost ~$5 to write this article with a lot of reruns and a
lot of additional input data that isn't shown here. Some beta features of GPT-3 are still free.

**GPT-3:**
We hope you found this blog post helpful. If you have any questions, feel free to leave a comment below.

**Vince:**
There is no comment section below 🤭.
