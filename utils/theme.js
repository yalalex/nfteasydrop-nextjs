import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Rajdhani',
      '"Titillium Web"',
      'Kanit',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#3d3d90',
    },
    secondary: {
      main: '#fff',
    },
    warning: {
      main: '#ff5edf',
    },
    info: {
      main: '#3d4990',
    },
    background: {
      paper: 'rgba(0, 0, 0, 0.1)',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
    },
  },
});
