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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RecipeFetcher from './components/recipeFetcher';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#00796b',
    },
    secondary: {
      main: '#ff5722',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecipeFetcher />
    </ThemeProvider>
  );
}

export default App;
