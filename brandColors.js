/**
 * iO Brand Guidelines 2023 color themes
 */
const colors = {
  io_green: {
    50: '#ffffff', // White
    100: '#f4f4f4', // Grey 10
    200: '#c4c4c4', // Grey 30
    300: '#747474', // Grey 70
    400: '#dce5e4', // Base Green (#DCE5E4)
    500: '#c4d1ce', // Calm Green (#C4D1CE)
    600: '#0017ee', // Energetic Blue
    700: '#242424', // Grey 90
    800: '#000000', // Black
    900: '#000000',
  },
  io_beige: {
    50: '#ffffff', // White
    100: '#f4f4f4', // Grey 10
    200: '#c4c4c4', // Grey 30
    300: '#747474', // Grey 70
    400: '#ebe8e3', // Base Beige (#EBE8E3)
    500: '#e1cfbf', // Calm Beige (#E1CFBF)
    600: '#0017ee', // Energetic Blue
    700: '#242424', // Grey 90
    800: '#000000', // Black
    900: '#000000',
  },
  io_blue: {
    50: '#ffffff', // White
    100: '#f4f4f4', // Grey 10
    200: '#c4c4c4', // Grey 30
    300: '#747474', // Grey 70
    400: '#dce1e5', // Base Blue (#DCE1E5)
    500: '#bdcad1', // Calm Blue (#BDCAD1)
    600: '#0017ee', // Energetic Blue (#0017EE)
    700: '#242424', // Grey 90
    800: '#000000', // Black
    900: '#000000',
  },
  io_pink: {
    50: '#ffffff', // White
    100: '#f4f4f4', // Grey 10
    200: '#c4c4c4', // Grey 30
    300: '#747474', // Grey 70
    400: '#ebe5e3', // Base Pink (#EBE5E3)
    500: '#dcc8c2', // Calm Pink (#DCC8C2)
    600: '#0017ee', // Energetic Blue
    700: '#242424', // Grey 90
    800: '#000000', // Black
    900: '#000000',
  },
  greyscale: {
    50: '#ffffff', // White
    100: '#f4f4f4', // Grey 10
    200: '#c4c4c4', // Grey 30
    300: '#747474', // Grey 70
    400: '#242424', // Grey 90
    500: '#000000', // Black
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
