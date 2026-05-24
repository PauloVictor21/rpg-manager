import { useState, useEffect } from 'react'
import api from '../services/api'

function Mesas({ usuario, onEntrarMesa, onLogout }) {
  const [mesas, setMesas] = useState([])
  const [nomeMesa, setNomeMesa] = useState('')
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (usuario.tipo === 'mestre') {
      api.get(`/mesas/mestre/${usuario.id}`)
        .then(res => setMesas(res.data))
    }
  }, [])

  const handleCriarMesa = async () => {
    try {
      const res = await api.post('/mesas', {
        nome: nomeMesa,
        mestreId: usuario.id
      })
      setMesas(prev => [...prev, res.data])
      setNomeMesa('')
    } catch (err) {
      setErro('Erro ao criar mesa')
    }
  }

  const handleEntrarMesa = async () => {
    try {
      const res = await api.post('/mesas/entrar', {
        codigo,
        usuarioId: usuario.id
      })
      onEntrarMesa(res.data)
    } catch (err) {
      setErro('Mesa não encontrada')
    }
  }

  return (
    <div className="flex h-screen bg-[#0b0b2c] text-white items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-6 p-8">

        <div className="flex flex-col items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-200">RPG Manager</h1>
          <p className="text-xs text-gray-500 tracking-widest">Olá, {usuario.nome}!</p>
          <button
            onClick={onLogout}
            className="text-xs text-red-400 hover:text-red-300 transition mt-1">
            Sair
          </button>
        </div>

        {usuario.tipo === 'mestre' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 tracking-widest uppercase">Criar nova mesa</p>
            <div className="flex gap-2">
              <input
                value={nomeMesa}
                onChange={e => setNomeMesa(e.target.value)}
                placeholder="Nome da mesa"
                className="flex-1 bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleCriarMesa}
                className="py-2 px-5 bg-purple-700 rounded-full text-sm font-bold hover:bg-purple-800 transition">
                Criar
              </button>
            </div>

            {mesas.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs text-gray-400 tracking-widest uppercase">Suas mesas</p>
                {mesas.map((mesa) => (
                  <div
                    key={mesa._id}
                    onClick={() => onEntrarMesa(mesa)}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10] hover:border-purple-500 cursor-pointer transition">
                    <span className="text-sm text-gray-300">{mesa.nome}</span>
                    <span className="text-xs text-gray-500 bg-[#ffffff08] px-3 py-1 rounded-full">{mesa.codigo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {usuario.tipo === 'jogador' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 tracking-widest uppercase">Entrar em uma mesa</p>
            <div className="flex gap-2">
              <input
                value={codigo}
                onChange={e => setCodigo(e.target.value.toUpperCase())}
                placeholder="Código da mesa"
                className="flex-1 bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleEntrarMesa}
                className="py-2 px-5 bg-purple-700 rounded-full text-sm font-bold hover:bg-purple-800 transition">
                Entrar
              </button>
            </div>
          </div>
        )}

        {erro && (
          <p className="text-xs text-center text-red-400">{erro}</p>
        )}

      </div>
    </div>
  )
}

export default Mesas