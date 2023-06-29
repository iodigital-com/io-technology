const colors = {
  // Todo: remove this theme after debugging and rename "io_electric_blue" to "io_blue"
  io_blue: {
    50: '#f5f7fd',
    100: '#ebeffb',
    200: '#cdd7f6',
    300: '#afbff0',
    400: '#728fe4',
    500: '#365fd9',
    600: '#3156c3',
    700: '#2947a3',
    800: '#203982',
    900: '#1a2f6a',
  },
  // Todo: search for "bg-io_" usage and add comments where it is used: DONE!
  io_electric_blue: {
    50: '#e5e7eb',
    100: '#d8dff6',
    200: '#9caee9',
    300: '#868ada',
    400: '#6380da',
    500: '#0017ee',
    600: '#3156c3', // -> this color is copypasted from io_blue color theme
    700: '#2947a3', // -> this color is copypasted from io_blue color theme
    800: '#203982', // -> this color is copypasted from io_blue color theme
    900: '#1a2f6a', // -> this color is copypasted from io_blue color theme
    // Todo: these are the colors from iO main website, remove them after debugging
    51: '#e5e7eb', // rgb(229, 231, 235) limiter
    101: '#d8dff6', // --color-tertiary-2d
    201: '#9caee9', // --color-tertiary-2c
    301: '#868ada', // --color-secondary-lavendel
    401: '#6380da', // --color-tertiary-4c
    501: '#0017ee', // --color-primary-blue rgb(0, 23, 238) main
  },
  // Todo: add info where my colors come from into PR description
  io_orange: {
    50: '#fef9f6',
    100: '#fdf2ee',
    200: '#fbdfd4',
    300: '#f8ccba',
    400: '#f2a587',
    500: '#ed7f53',
    600: '#d5724b',
    700: '#b25f3e',
    800: '#8e4c32',
    900: '#743e29',
  },
  io_rouge: {
    50: '#faf5f7',
    100: '#f6ebf0',
    200: '#e8cdd9',
    300: '#d9afc1',
    400: '#bd7493',
    500: '#a13865',
    600: '#91325b',
    700: '#792a4c',
    800: '#61223d',
    900: '#4f1b31',
  },
  io_black: {
    50: '#f4f4f4',
    100: '#e9e9e9',
    200: '#c7c7c7',
    300: '#a5a5a5',
    400: '#626262',
    500: '#1f1f1f',
    600: '#1c1c1c',
    700: '#171717',
    800: '#131313',
    900: '#0f0f0f',
  },
  io_cow: {
    50: '#f6edf4',
    100: '#eddbe8',
    200: '#e3c9dd',
    300: '#dab7d1',
    400: '#d1a5c6',
    500: '#c892ba',
    600: '#bf80af',
    700: '#c0639a',
    800: '#a34a8c',
    900: '#7e396c',
  },
}

const safelist = Object.entries(colors).reduce((acc, [name, tints]) => {
  Object.keys(tints).forEach((tint) => {
    acc.push(`bg-${name}-${tint}`)
  })
  return acc
}, [])

module.exports = {
  colors,
  safelist,
}
