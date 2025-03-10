import { createTheme } from '@mui/material/styles';

// Color palette based on the logo (light mauve/pink)
export const theme = createTheme({
  palette: {
    primary: {
      main: '#d1b3b5', // Mauve color from logo
      light: '#d8c5c9',
      dark: '#a48e92',
    },
    secondary: {
      main: '#8c7b7f', // Darker shade of the mauve
    },
    background: {
      default: '#f9f5f6',
    },
    text: {
      primary: '#5c5152',
    },
  },
  typography: {
    fontFamily: '"Heebo", "Assistant", "Rubik", sans-serif',
    h1: {
      fontWeight: 300,
    },
    h2: {
      fontWeight: 300,
    },
  },
});

export default theme;