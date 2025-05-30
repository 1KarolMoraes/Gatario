import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ResetStyle from '../styles/ResetStyle.jsx'
import GlobalStyle from '../styles/GlobalStyle.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResetStyle />
    <GlobalStyle />
    <App />
  </StrictMode>,
)
