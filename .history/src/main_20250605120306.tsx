
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ModeProvider } from './components/context/ModeContext'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModeProvider> {/* 👈 envolver toda la app */}
      <App />
    </ModeProvider>
  </React.StrictMode>
)
