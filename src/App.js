// import logo from './logo.svg';
// import './App.css';
// import { LoginForm } from './components/forms/LoginForm';

// function App() {
//   return (
//     <div>
//       <LoginForm />
//     </div>
//   );
// }

// export default App;
// App.jsx
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import RecipeFetcher from './components/recipeFetcher';

// const theme = createTheme({
//   palette: {
//     mode: 'light', // or 'dark'
//     primary: {
//       main: '#00796b',
//     },
//     secondary: {
//       main: '#ff5722',
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <RecipeFetcher />
//     </ThemeProvider>
//   );
// }

// export default App;

// App.jsx
// import React from 'react';
// import RecipeFetcher from './components/recipeFetcher';
// import { CustomThemeProvider } from './ThemeContext';

// function App() {
//   return (
//     <CustomThemeProvider>
//       <RecipeFetcher />
//     </CustomThemeProvider>
//   );
// }

// export default App;

import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider } from './ThemeContext';
import RecipeFetcher from './components/recipeFetcher';
import LeftSidebar from './components/utils/LeftSideBar';

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={(theme) => theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <LeftSidebar />
          <Box sx={{ ml: { xs: '80px', sm: '220px' }, flexGrow: 1 }}>
            <RecipeFetcher />
          </Box>
        </Box>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;

