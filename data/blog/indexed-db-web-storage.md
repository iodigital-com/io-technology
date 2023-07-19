---
title: '_IndexedDB_ > Web Storage'
date: '2023-07-20'
tags: ['frontend', 'javascript']
images: ['/articles/indexed-db-web-storage/indexed-db-web-storage.jpeg']
summary: 'Explore the advantages of IndexedDB over the Web Storage API as a more efficient and sophisticated alternative for storing structured data on the client, eliminating the need for repetitive JSON parsing and stringifying operations.'
authors: ['dave-bitter']
theme: 'blue'
---

I often use LocalStorage (or SessionStorage) to store structured data on the client for demos and real projects. While this worked fine, I’ve always had a nagging feeling that there would be a better way than `JSON.parse` and `JSON.stringify` large arrays on every change. Let’s have a look at why IndexedDB might be a better choice for you than the Storage API.

The LocalStorage and SessionStorage are herded under the Web Storage API. I will compare the Web Storage API to the IndexedDB API in this article. While you’ll see that IndexedDB is far richer in features, I will try to stick to the basics to meet my needs in storing structured data persisted in the user’s browser.

## Oranges and Apples

In essence, with the Storage API, you’re limited to a get and set method where you can pass a key and a (string) value:

```jsx
window.localStorage.setItem(
  'tasks',
  JSON.stringify([
    {
      id: 1,
      title: 'Learn JavaScript',
      completed: true,
    },
    {
      id: 2,
      title: 'Learn Vue',
      completed: false,
    },
    {
      id: 3,
      title: 'Build something awesome',
      completed: false,
    },
  ])
)

const tasks = JSON.parse(window.localStorage.getItem('tasks'))
```

This is great for simple key-value storing, but not so much for more structured data. A quick comparison:

| Feature         | Web Storage                        | IndexedDB                                    |
| --------------- | ---------------------------------- | -------------------------------------------- |
| Data Structure  | Key-value pairs                    | Object store, key-value pairs                |
| Storage Limit   | Typically around 5MB per origin    | Larger storage capacity (varies per browser) |
| Querying        | Limited querying capabilities      | Advanced querying with indexes               |
| Transactional   | No                                 | Yes                                          |
| Indexing        | No                                 | Support for indexes                          |
| Data Types      | Limited to strings                 | Supports complex data structures             |
| Browser Support | Widely supported across browsers   | Widely supported across browsers             |
| Data Retention  | Persistent                         | Persistent                                   |
| Use Cases       | Storing simple data, small amounts | Storing structured data, larger amounts      |

More simply put, the storage API is a key-value store while IndexedDB is an actual database. So why do we try to jam everything in the key-value store? Well, it’s easy! The path of least resistance is often chosen while it might make the actual code for updating and deleting items more complex.

## Using IndexedDB

Like every technique I like to learn, I first try to create an actual demo so I run into real-world requirements and issues while building. This time, I went for a good old todo app that persists data in the user’s browser:

![Screenshot of a todo app with a form and a list of tasks](/articles/indexed-db-web-storage/todo-app.png)

You can [view the demo here](https://indexed-db-demo.davebitter.com/) and [view the source code over at GitHub](https://github.com/DaveBitter/indexed-db-demo).

As I’m going to add quite a bit of functionality for the IndexedDB database, I’ll first create a helper in a separate file structured like this:

```jsx
let openRequest

export const db = {
  // Open the database and create the tasks object store if needed
  openDB: () => {
    return new Promise((resolve, reject) => {})
  },
  // Add a task to the database
  addTask: (task) => {
    return new Promise((resolve, reject) => {})
  },
  // Get all tasks from the database
  getAllTasks: () => {
    return new Promise((resolve, reject) => {})
  },
  // Update a task in the database
  updateTask: (task) => {
    return new Promise((resolve, reject) => {})
  },
  // Delete a task from the database
  deleteTask: (id) => {
    return new Promise((resolve, reject) => {})
  },
}
```

With these methods, I should be able build all the functionality the todo app. Let’s go over them one by one.

### Opening the database store

With IndexedDB you need an object store for data. You can see this as a collection in your database. I need to either retrieve an existing tasks store or create a new one if it doesn’t exist yet. You can do this like this:

```jsx
let openRequest

export const db = {
  // Open the database and create the tasks object store if needed
  openDB: () => {
    return new Promise((resolve, reject) => {
      openRequest = indexedDB.open('tasks', 1)

      openRequest.onupgradeneeded = () => {
        const db = openRequest.result
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true })
        }
      }

      openRequest.onsuccess = () => {
        resolve(openRequest.result)
      }

      openRequest.onerror = () => {
        reject(openRequest.error)
      }
    })
  },

  // ...
}
```

First I create a variable called `openRequest` to store the opened database to be used in other methods coming up next. Then I call `indexedDB.open('tasks', 1)` and store it in the variable. The first parameter is the name of the store, the second one is the version of the database.

You can use `onupgradeneeded` to create object stores. There I check wether it already exists or I need to create one. When creating, you notice that I pass a `keyPath`. By specifying that the `keyPath` is the `id` property of the task, I can later easily update or delete a task by passing the `id` of the task. By passing `autoIncrement: true` IndexedDB will automatically fill this property incremented based on the highest `id`. I can call `onsuccess` and `onerror` to handle whether the object store was created successfully or not.

Great! I now have an object store to work with! Let’s add the actual methods allowing me to perform CRUD operations.

### Creating a new task

Firstly, I want to be able to add a new task to the object store. I’ve build a form to gather the data and now need a method to pass the task object to:

```jsx
let openRequest

export const db = {
  // ...

  // Add a task to the database
  addTask: (task) => {
    return new Promise((resolve, reject) => {
      const db = openRequest.result
      const transaction = db.transaction(['tasks'], 'readwrite')
      const store = transaction.objectStore('tasks')

      const addRequest = store.add(task)

      addRequest.onsuccess = () => {
        resolve(addRequest.result)
      }

      addRequest.onerror = () => {
        reject(addRequest.error)
      }
    })
  },

  // ...
}
```

First, I get the database from the `openRequest` by getting the `result` property. Next I need to create a transaction. A transaction is basically series of operations that all need to pass successfully in order for the entire transaction to be applied. If one operation fails, all the operations won’t be applied. In this article I won’t go to deep into this, but you can [read more on transactions here](https://www.dbvis.com/thetable/database-transactions-101-the-essential-guide/#:~:text=A%20database%20transaction%20is%20a,operations%20performed%20within%20a%20DBMS.). First I pass an array of object stores I want to modify. In my use case, I only need to make an update to `'tasks'`. Secondly I pass the type of operations I want to perform. As I’m retrieving and writing data I need to pass `'readwrite'`.

Next, I get the `'tasks'`store from the transaction and I call the `add` method with the task data. Again, I have `onsuccess` and `onerror` handlers that I can use to provide feedback in my application.

And that’s it! Note how much easier this code is compared to using the WebStorage API and having to get all the tasks, go over all of them until I find the one to update, update the task and storing the entire list again. With IndexedDB I can just call the `add` method.

### Reading all tasks

The second step is to create a method to retrieve all the tasks for the object store so I can display them in the UI. Let’s create a method that does just that:

```jsx {13}
let openRequest

export const db = {
  // ...

  // Get all tasks from the database
  getAllTasks: () => {
    return new Promise((resolve, reject) => {
      const db = openRequest.result
      const transaction = db.transaction(['tasks'], 'readonly')
      const store = transaction.objectStore('tasks')

      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result)
      }

      getAllRequest.onerror = () => {
        reject(getAllRequest.error)
      }
    })
  },

  // ...
}
```

This method works much like the `addTask` method. The only real difference is that I just need `readonly` for the transaction and I call the `getAll` method to retrieve all tasks.

### Updating a task

As you might have noticed in the Todo demo, I have a checkbox where I can set the status of a task to be complete or incomplete. For this, I need to be able to make an update to (the `status` property of) the task:

```jsx {13}
let openRequest

export const db = {
  // ...

  // Update a task in the database
  updateTask: (task) => {
    return new Promise((resolve, reject) => {
      const db = openRequest.result
      const transaction = db.transaction(['tasks'], 'readwrite')
      const store = transaction.objectStore('tasks')

      const putRequest = store.put(task)

      putRequest.onsuccess = () => {
        resolve(putRequest.result)
      }

      putRequest.onerror = () => {
        reject(putRequest.error)
      }
    })
  },

  // ...
}
```

The only real difference between this method and the `addTask` method is that I call the `put` method instead of `add`.

### Deleting a task

Finally, I want to be able to delete a task from the database:

```jsx {13}
let openRequest

export const db = {
  // ...

  // Delete a task from the database
  deleteTask: (id) => {
    return new Promise((resolve, reject) => {
      const db = openRequest.result
      const transaction = db.transaction(['tasks'], 'readwrite')
      const store = transaction.objectStore('tasks')

      const deleteRequest = store.delete(id)

      deleteRequest.onsuccess = () => {
        resolve(deleteRequest.result)
      }

      deleteRequest.onerror = () => {
        reject(deleteRequest.error)
      }
    })
  },

  // ...
}
```

You guessed it, I just have to call `delete` with the id of the task to remove a task.

## Is IndexedDB worth moving over from the good ol’ simple Web Storage?

Although they both offers persistent storage on the user’s browser, I see a clear distinction between the two. Web Storage is great for storing simple key-value pairs. There is no boiler plating needed, you just get and set items. For structured data I feel IndexedDB offers a way better API. Yes, there is more API specific code needed, but let’s have a look at actually using the Web Storage API for the todo app. You are going to need to write the logic for updating, retrieving and deleting a specific item yourself. So although the IndexedDB API requires more API-specific code, you’ll end up with roughly the same code with either of the options.

By abstracting away the database logic into the helper I’ve shown before, you or your team still have simple methods to call in your application, but under water you are using a far more robust and structured-data specific solution to persist data on the user’s browser. Not to mention the other benefits like performance, larger storage capacity and advanced querying.

In the end, you have to decide for yourself. The goal of this article is not to make you feel bad about (perhaps mis-) using the Web Storage API, but rather show how easy it could be with an abstraction helper to use the IndexedDB API. From now on I’ll be using the IndexedDB to persist more complex data structures in the user’s browser for my applications. Thanks for learning together!
