
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './UserContext/Context.jsx'



// Add error handlers before rendering the app
window.addEventListener('error', (event) => {
  if (event.target?.src?.includes('http://10.13.1.9:8000/api/user/')) {
    event.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.config?.url?.includes('http://10.13.1.9:8000/api/user/')) {
    event.preventDefault();
    return false;
  }
});


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
  <AuthProvider>

    <App />
  </AuthProvider>
  </BrowserRouter>
  // </StrictMode>,
)
