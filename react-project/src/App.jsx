import Main from './pages/main.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/root_layout.jsx'
import Login from './pages/login.jsx'
import './App.css'
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Main /> },
      { path: 'login', element: <Login /> },
    ]
  },
])
function App() {

  return <RouterProvider router={router} />
}

export default App
