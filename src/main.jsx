import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { ConfirmProvider } from "material-ui-confirm";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ConfirmProvider>
      <App />
      </ConfirmProvider>
    </BrowserRouter>
  </StrictMode>,
)
