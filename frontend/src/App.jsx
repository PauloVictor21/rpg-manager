import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  const handleLogin = (usuario) => {
    setUsuario(usuario)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  if (!usuario) {
    return <Login onLogin={handleLogin} />
  }

  return <Home usuario={usuario} onLogout={handleLogout} />
}

export default App