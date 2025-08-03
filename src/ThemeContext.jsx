// import React, { createContext, useMemo, useState, useContext } from 'react';
// import { ThemeProvider, CssBaseline } from '@mui/material';
// import { createAppTheme } from './theme';

// const ThemeToggleContext = createContext();

// export const useThemeToggle = () => useContext(ThemeToggleContext);

// export const ThemeToggleProvider = ({ children }) => {
//   const [mode, setMode] = useState('light');
//   const theme = useMemo(() => createAppTheme(mode), [mode]);

//   const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

//   return (
//     <ThemeToggleContext.Provider value={{ toggleTheme, mode }}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </ThemeToggleContext.Provider>
//   );
// };
// src/ThemeContext.js
import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
      },
    }), [mode]);

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};
export default CustomThemeProvider;