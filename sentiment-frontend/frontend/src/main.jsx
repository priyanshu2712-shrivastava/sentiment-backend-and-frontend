import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UtilsProvider } from './contexts/Utils.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UtilsProvider>
    <App />
    </UtilsProvider>
  </StrictMode>,
)
