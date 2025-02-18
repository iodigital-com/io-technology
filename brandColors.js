/**
 * "iO-BrandGuide 2.0 2023.pdf" color themes
 */
const colors = {
  io_green: {
    50: '#ffffff', // Greyscale color: White
    100: '#f4f4f4', // Greyscale color: Grey 10
    200: '#c4c4c4', // Greyscale color: Grey 30
    300: '#747474', // Greyscale color: Grey 70
    400: '#dce5e4', // Secondary color: Base Green
    500: '#c4d1ce', // Secondary color: Calm Green
    600: '#0017ee', // Primary color: Energetic Blue
    700: '#242424', // Greyscale color: Grey 90
    800: '#000000', // Greyscale color: Black
    900: '#000000',
  },
  io_beige: {
    50: '#ffffff', // Greyscale color: White
    100: '#f4f4f4', // Greyscale color: Grey 10
    200: '#c4c4c4', // Greyscale color: Grey 30
    300: '#747474', // Greyscale color: Grey 70
    400: '#ebe8e3', // Secondary color: Base Beige
    500: '#e1cfbf', // Secondary color: Calm Beige
    600: '#0017ee', // Primary color: Energetic Blue
    700: '#242424', // Greyscale color: Grey 90
    800: '#000000', // Greyscale color: Black
    900: '#000000',
  },
  io_blue: {
    50: '#ffffff', // Greyscale color: White
    100: '#f4f4f4', // Greyscale color: Grey 10
    200: '#c4c4c4', // Greyscale color: Grey 30
    300: '#747474', // Greyscale color: Grey 70
    400: '#dce1e5', // Secondary color: Base Blue
    500: '#bdcad1', // Secondary color: Calm Blue
    600: '#0017ee', // Primary color: Energetic Blue
    700: '#242424', // Greyscale color: Grey 90
    800: '#000000', // Greyscale color: Black
    900: '#000000',
  },
  io_pink: {
    50: '#ffffff', // Greyscale color: White
    100: '#f4f4f4', // Greyscale color: Grey 10
    200: '#c4c4c4', // Greyscale color: Grey 30
    300: '#747474', // Greyscale color: Grey 70
    400: '#ebe5e3', // Secondary color: Base Pink
    500: '#dcc8c2', // Secondary color: Calm Pink
    600: '#0017ee', // Primary color: Energetic Blue
    700: '#242424', // Greyscale color: Grey 90
    800: '#000000', // Greyscale color: Black
    900: '#000000',
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
