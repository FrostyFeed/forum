import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import UserBanInfo from './components/banInfo/UserBanInfo.jsx'
createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <AuthProvider>
    <App />
    <UserBanInfo />
  </AuthProvider>
  //</StrictMode>,
)
