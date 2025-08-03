import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          background: { default: '#f9f9f9' },
          primary: { main: '#1976d2' },
        }
      : {
          background: { default: '#121212' },
          primary: { main: '#90caf9' },
        }),
  },
  typography: {
    fontFamily: 'Calibri, sans-serif',
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));