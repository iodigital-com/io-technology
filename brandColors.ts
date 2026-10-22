/**
 * "iO-BrandGuide 2.0 2023.pdf" color themes
 */

type ColorTint = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

type BrandColors = {
  io_green: ColorTint
  io_beige: ColorTint
  io_blue: ColorTint
  io_pink: ColorTint
  io_energeticBlue: ColorTint
}

const colors: BrandColors = {
  io_energeticBlue: {
    50: '#ffffff',
    100: '#f4f4f4',
    200: '#c4c4c4',
    300: '#747474',
    400: '#ffffff',
    500: '#f4f4f4',
    600: '#0017ee',
    700: '#0014bb',
    800: '#001088',
    900: '#000d55',
  },
  io_green: {
    50: '#ffffff', // Greyscale color: White
    100: '#f4f4f4', // Greyscale color: Grey 10
    200: '#c4c4c4', // Greyscale color: Grey 30
    300: '#747474', // Greyscale color: Grey 70
    400: '#dce5e4', // Secondary color: Base Green
    500: '#c4d1ce', // Secondary color: Calm Green
    600: '#a8b9b6', // Secondary color: Calm Green (darker)
    700: '#242424', // Greyscale color: Grey 90
    800: '#000000', // Greyscale color: Black
    900: '#000000',
  },
  io_beige: {
    50: '#ffffff', // Greyscale color: White
    100: '#f4f4f4', // Greyscale color: Grey 10
    200: '#c4c4c4', // Greyscale color: Grey 30
    300: '#747474', // Greyscale color: Grey 70
    400: '#ebe8e3', // Secondary color: Off-White Beige
    500: '#dccfc2', // Secondary color: Neutral Beige
    600: '#c9b8a6', // Secondary color: Neutral Beige (darker)
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
    600: '#9fb0b8', // Secondary color: Calm Blue (darker)
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
    600: '#c9a8a6', // Secondary color: Calm Pink (darker)
    700: '#242424', // Greyscale color: Grey 90
    800: '#000000', // Greyscale color: Black
    900: '#000000',
  },
}

module.exports = { colors }
export type { BrandColors, ColorTint }
