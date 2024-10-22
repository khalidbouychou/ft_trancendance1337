
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './UserContext/Context.jsx'



createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
  <AuthProvider>

    <App />
  </AuthProvider>
  </BrowserRouter>
  // </StrictMode>,
)
