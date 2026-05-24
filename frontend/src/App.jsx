import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Mesas from './pages/Mesas'

function App() {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })
  const [mesa, setMesa] = useState(null)

  const handleLogin = (usuario) => {
    setUsuario(usuario)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    setMesa(null)
  }

  const handleEntrarMesa = (mesa) => {
    setMesa(mesa)
  }

  if (!usuario) return <Login onLogin={handleLogin} />
  if (!mesa) return <Mesas usuario={usuario} onEntrarMesa={handleEntrarMesa} onLogout={handleLogout} />

  return <Home usuario={usuario} mesa={mesa} onLogout={handleLogout} />
}

export default App