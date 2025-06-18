  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App'
  import { ModeProvider } from './components/context/ModeContext'
  import { ThemeProvider, CssBaseline } from '@mui/material'
  import { Theme } from './t';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ModeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ModeProvider>
    </React.StrictMode>
  )
