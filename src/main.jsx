import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WikiProvider } from './context/WikiContext' // Import the Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the entire app in the WikiProvider */}
    <WikiProvider>
      <App />
    </WikiProvider>
  </StrictMode>,
)
