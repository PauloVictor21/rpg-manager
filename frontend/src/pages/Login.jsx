import { useState } from 'react'
import api from '../services/api'

function Login({ onLogin }) {
  const [tela, setTela] = useState('login')
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'jogador'
  })
  const [erro, setErro] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        senha: form.senha
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
      onLogin(res.data.usuario)
    } catch (err) {
      setErro('Email ou senha incorretos')
    }
  }

  const handleCadastro = async () => {
    try {
      await api.post('/auth/cadastro', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo: form.tipo
      })
      setTela('login')
      setErro('Cadastro realizado! Faça login.')
    } catch (err) {
      setErro('Erro ao cadastrar, tente novamente')
    }
  }

  return (
    <div className="flex h-screen bg-[#0b0b2c] text-white items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-6 p-8">

        <div className="flex flex-col items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-200">RPG Manager</h1>
          <p className="text-xs text-gray-500 tracking-widest">Sistema de gerenciamento de fichas</p>
        </div>

        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setTela('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition
              ${tela === 'login' ? 'bg-purple-700 text-white' : 'bg-[#ffffff08] text-gray-400 hover:text-white'}`}>
            Login
          </button>
          <button
            onClick={() => setTela('cadastro')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition
              ${tela === 'cadastro' ? 'bg-purple-700 text-white' : 'bg-[#ffffff08] text-gray-400 hover:text-white'}`}>
            Cadastro
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {tela === 'cadastro' && (
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          )}

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />

          <input
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Senha"
            type="password"
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />

          {tela === 'cadastro' && (
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
            >
              <option value="jogador">Jogador</option>
              <option value="mestre">Mestre</option>
            </select>
          )}
        </div>

        {erro && (
          <p className="text-xs text-center text-red-400">{erro}</p>
        )}

        <button
          onClick={tela === 'login' ? handleLogin : handleCadastro}
          className="w-full py-3 bg-purple-700 rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-purple-800 transition">
          {tela === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>

      </div>
    </div>
  )
}

export default Login