
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './UserContext/Context.jsx'
console.error = () => {};
createRoot(document.getElementById('root')).render(
  
    <App />
  
)
