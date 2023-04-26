---
title: '_Inversion of Control_ through _Compound Components_'
date: '2023-04-26'
tags: ['frontend', 'react', 'javascript']
images:
  [
    '/articles/inversion-of-control-through-compound-components/inversion-of-control-through-compound-components.webp',
  ]
summary: 'Learn how to keep your component libraries simple, easy to use, and adaptable to many use cases by leveraging Inversion of Control through Compound Components.'
authors: ['dave-bitter']
theme: 'blue'
---

I’ve worked on many component libraries during my career. One of the main difficulties I find is to keep your components simple, easy to use and cater to many use cases. One of the ways I like to ensure this is to use Inversion of Control through Compound Components. Let’s have a look at both patterns and see how this can help you!

## What is Inversion of Control?

Let’s say you have a list of users and you create a couple of utilities to return filtered lists:

```jsx
const users = [
  {
    name: 'John',
    age: 20,
    country: 'USA',
    hobbies: ['reading', 'swimming'],
  },
  {
    name: 'Peter',
    age: 30,
    country: 'England',
    hobbies: ['running', 'swimming'],
  },
  undefined,
  {
    name: 'Mary',
    age: 25,
    country: 'France',
    hobbies: ['reading', 'hiking'],
  },
]

const getEnglish = (users) => {
  return users.filter((user) => {
    return !!user && user.country === 'England'
  })
}

const getThirtyYearOlds = (users) => {
  return users.filter((user) => {
    return !!user && user.age === 30
  })
}

const getPeters = (users) => {
  return users.filter((user) => {
    return !!user && user.name === 'Peter'
  })
}
```

Naturally, it doesn’t make sense to duplicate so much code for every possible filter so you might create a reusable function like this:

```jsx
const getUsers = (users, attributes) => {
  return users.filter((user) => {
    return attributes.every((attribute) => {
      return user[attribute.key] === attribute.value
    })
  })
}

const english = getUsers(users, [{ key: 'country', value: 'England' }])

const thirtyYearOlds = getUsers(users, [{ key: 'age', value: 30 }])

const peters = getUsers(users, [{ key: 'name', value: 'Peter' }])
```

Now this seems fine, but what if I want to get all French hikers? As hobbies is an array, I need to refactor the `getUsers` function to also be able to filter for that:

```jsx {3-5}
const getUsers = (users, attribute, value) => {
  return users.filter((user) => {
    if (Array.isArray(user[attribute])) {
      return user[attribute].includes(value)
    }

    return user[attribute] === value
  })
}

const getFrenchReaders = (users) => {
  return getUsers(users, 'country', 'France')
}
```

You can imagine this function getting more and more complex when new requirements come in. The user of this function doesn’t have control and therefore I need to keep adding logic for new use cases. Let’s invert that and let the user have full control:

```jsx {0-3}
const getUsers = (users, filterFn) => {
    return users.filter(user => !!user && filterFn(user);
)};

const englishSwimmers = getUsers(users, user => {
    return user.country === 'England' && user.hobbies.includes('swimming');
});

const frenchReaders = getUsers(users, user => {
    return user.country === 'France' && user.hobbies.includes('reading');
});

const americanHikers = getUsers(users, user => {
    return user.country === 'USA' && user.hobbies.includes('hiking');
});
```

By letting the user of this function pass their filter function, I give them the power to filter however they like.

Now, I hear you thinking, why would they need to use this function at all and don’t they just filter the array themselves? Good question! In this case, we also check for `undefined` users. Now, this is not a lot of duplicate code for them to add, but you can imagine real-world scenarios to get way more complex than this example. I can invert control to the user of the functions for things that make sense like providing their filter function while still providing logic they would always need like checking for defined users.

### Taking this pattern to components

In this article, I will use React.js for the examples, but this pattern can be applied to any framework. Let’s say you have a list where users can select an item, the component will call a callback with the selected option and it will close the list:

```jsx
import React, { useState } from 'react'

const SelectList = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="select-list">
      <button className="select-list__button" onClick={() => setIsOpen(!isOpen)}>
        {value}
      </button>

      {isOpen && (
        <ul className="select-list__options">
          {options.map((option) => (
            <li key={option} className="select-list__option">
              <button className="select-list__button" onClick={() => handleSelect(option)}>
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

Now a user of your component has a requirement where they don’t want to have the list close after a user selects an option. So, you update the component to handle this:

```jsx {3,9-11}
import React, { useState } from 'react'

const SelectList = ({ options, value, onChange, keepOpenAfterSelection }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
    onChange(option)

    if (!keepOpenAfterSelection) {
      setIsOpen(false)
    }
  }

  // ...
}
```

Now, imagine ten other requirements coming in in the coming months. What happens is you enter the “aprocalypse”. Not only will your component handle a vast number of props, it becomes very complex very quickly.

### Accepting a state reducer

The real issue in the simplified example above is that the `handleSelect` function has logic being added to for updating the state it for specific use cases when a prop (`keepOpenAfterSelection`) is passed. Let’s invert this logic. First, we allow the user to pass a state reducer and replace `useState` with `useReducer`. Next, we remove the check for the `keepOpenAfterSelection` prop:

```jsx
import React, { useReducer } from 'react'

const stateReducerDefaultReducer = (state, changes) => ({ ...state, ...changes })

const SelectList = ({ options, value, onChange, stateReducer = stateReducerDefaultReducer }) => {
  const [{ isOpen }, setState] = useReducer(stateReducer, { isOpen: false })

  const handleSelect = (option) => {
    onChange(option)
    setState({ isOpen: false })
  }

  /// ...
}
```

When a user doesn’t provide a state reducer, the default behaviour is used. But, the user can now take full control like so:

```jsx
import React from 'react'

const App = () => {
  return (
    <SelectList
      options={['One', 'Two', 'Three']}
      value="One"
      onChange={(value) => console.log(value)}
      stateReducer={(state) => {
        return { ...state, isOpen: true }
      }}
    />
  )
}
```

As you can see, whenever the SelectList component’s `setState` function is called, the stateReducer callback gets the state passes. There we can return that state, but make an exception as well. Now, this example works for keeping the list open, but you can imagine you can now update any state based on the context of your application and requirements.

### The gained benefits by Inversion of Control

There are quite a few benefits gained by inversing control

- Decreased complexity of the API of your component
  - Improved readability
  - Less prop drilling
  - Clear division of responsibility
- Easier to refactor the API of your component
- Allows developers to do whatever they need with the API of your component
- Easier to create tests due to full control

The Inversion of Control example you looked at is great, but it’s merely a solution to the state problem I created in the first place. What if I can circumvent this problem in its entirety?

As far as I see it, the user of the SelectList component has the context of their application and what should be rendered. Let’s give them the power to do just that:

```jsx
import React, { useState } from 'react'

const SelectList = ({ options, value, onChange, isOpen, onToggle }) => {
  const handleSelect = (option) => {
    onChange(option)
  }

  return (
    <div className="select-list">
      <button className="select-list__button" onClick={() => onToggle(!isOpen)}>
        {value}
      </button>

      {isOpen && (
        <ul className="select-list__options">
          {options.map((option) => (
            <li key={option} className="select-list__option">
              <button className="select-list__button" onClick={() => handleSelect(option)}>
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

The user then has to update their App component like this:

```jsx
import React, { useState } from 'react'

const App = () => {
  const [selectListIsOpen, setSelectListIsOpen] = useState(false)

  return (
    <div className="App">
      <SelectList
        options={['One', 'Two', 'Three']}
        value="One"
        onChange={(value) => console.log(value)}
        isOpen={selectListIsOpen}
        onToggle={(isOpen) => setSelectListIsOpen(isOpen)}
      />
    </div>
  )
}
```

Sure, the state is now gone from the component, but now we are left with the original problem of a large number of props that the component needs to accept. Let’s use compound components.

## What are Compound Components?

The idea of Compound Components is to have multiple components work together where they won’t make much sense on their own. You are most likely already familiar with this concept. Let’s look at the native select element in HTML:

```jsx
<select>
  <option value="One">One</option>
  <option value="Two">Two</option>
  <option value="Three">Three</option>
</select>
```

On their own, `select` and `option` don’t make much sense, but when combined they provide a useful interaction. Let’s first update the SelectList to offer this and look at the benefits of this approach:

```jsx
import React from 'react'

const SelectListToggle = ({ children, onClick }) => {
  return (
    <button className="select-list__button" onClick={onClick}>
      {children}
    </button>
  )
}

const SelectListItems = ({ children }) => {
  return <ul className="select-list__options">{children}</ul>
}

const SelectListItem = ({ children, onClick }) => {
  return (
    <li className="select-list__option">
      <button className="select-list__button" onClick={onClick}>
        {children}
      </button>
    </li>
  )
}

const SelectList = ({ children }) => {
  return <div className="select-list">{children}</div>
}

SelectList.Toggle = SelectListToggle
SelectList.Items = SelectListItems
SelectList.Item = SelectListItem

export default SelectList
```

As you can see, all the separate elements that construct a SelectList are split out into separate components. They are then added as a key of `SelectList`. Naturally, you could use the components as is, but this ensures that only SelectList can be imported from the file which has the several sub-components as a key. This way they are always used together. In a minute, I’ll show you how this looks.

The benefits of splitting the components are:

- There is a separation of concerns for all parts
- You can have multiple props called `onClick` across the multiple components as there are no name clashes
- You can split out props making it easier to read the component
- It’s easy to add props to a sub-component that are just meant for that sub-component

So how do I now use this new Compound Component? Let’s have a look:

```jsx
import React, { useState } from "react";

const App = () => {
  const [selectListIsOpen, setSelectListIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("One");

  return (
    <div className="App">
      <SelectList>
        <SelectList.Toggle
          onClick={() => setSelectListIsOpen(!selectListIsOpen)}
        >
          {selectedOption}
        </SelectList.Toggle>

        {selectListIsOpen && (
          <SelectList.Items>
            <SelectList.Item onClick={() => setSelectedOption("One")}>One</SelectListItem>
            <SelectList.Item onClick={() => setSelectedOption("Two")}>Two</SelectListItem>
            <SelectList.Item onClick={() => setSelectedOption("Three")}>Three</SelectListItem>
          </SelectList.Items>
        )}
      </SelectList>
    </div>
  );
};
```

The benefits of rendering the SelectList like this are:

- Implementation logic is moved outside of the component making it easier to fit your needs
  - For instance, what if you need to render the toggle underneath the items instead of above them? Just render it there!
- The options are not passed as a configuration anymore
  - What if you also want to add an icon in front of the list item? Just render that in through React children next to the label
  - The component needs fewer features and updates, but can handle whatever you throw at it
- It’s clear how this component works
  - You don’t have to open it and scroll to lines of JSX and figure out what happens

## What are potential drawbacks?

Inversion of Control and Compound Components have similar drawbacks. Yes, they reduce the complexity of functions and components, but at the cost of moving some to the user of them. I often hear developers mention that it would be easier for them if all the logic is in the function or component. This is a valid point, but there is an important note to take. Yes, for some simpler ones, this is the case, but through experience, I’ve seen functions and components become so complex that it actually got harder to follow the API of the component (and sometimes hack around it) than it would be to move the logic to the user.

Next to this, there is quite some more boilerplating. This is in the nature of moving to Compound Components. I’ve found, however, that this is indeed the case, but the code is much clearer and has a lower cognitive load.

## Which pattern do I pick and where do I start?

Well…

![Bart Simpson's classmates asking him to say the line, he sighs and says "it depends" and they are cheering](/articles/inversion-of-control-through-compound-components/it-depends.png)

Look at some of the reusable functions and components in your codebase. What is one of the functions or components that you often have to fight against or have to make more complex every time you work with it? Usually, that’s a good start.

For functions with many parameters for different use cases, I think you should use Inversion of Control to simplify them and empower the developer using them. For components, I showed two main ways of inverting control. When you feel you’re battling state often, try to see if passing a state reducer can help you out. For components where you feel you’re battling the rendering logic often, try to see if Compound Components can resolve those issues.

## Final thoughts

Inversion of Control and Compound Components are by no means a one-size-fits-all solution. They merely offer solutions for specific problems. Creating reusable functions and components is hard and we can only learn by doing, refactoring and repeating that cycle.

For now, thanks for reading!
