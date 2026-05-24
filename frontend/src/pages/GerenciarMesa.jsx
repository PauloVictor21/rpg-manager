import { useState, useEffect } from 'react'
import api from '../services/api'

function GerenciarMesa({ mesa, usuario, onFechar }) {
  const [jogadores, setJogadores] = useState([])
  const [personagens, setPersonagens] = useState([])
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    api.get('/personagens').then(res => setPersonagens(res.data))
    api.get('/usuarios').then(res => setUsuarios(res.data))
    setJogadores(mesa.jogadores)
  }, [])

  const getNomeUsuario = (usuarioId) => {
    const u = usuarios.find(u => u._id === usuarioId)
    return u ? u.nome : usuarioId
  }

  const getNomePersonagem = (personagemId) => {
    const p = personagens.find(p => p._id === personagemId)
    return p ? p.nome : 'Sem personagem'
  }

  const handleDesignar = async (usuarioId, personagemId) => {
    try {
      await api.put('/mesas/designar', {
        mesaId: mesa._id,
        usuarioId,
        personagemId
      })
      setJogadores(prev =>
        prev.map(j => j.usuarioId === usuarioId ? { ...j, personagemId } : j)
      )
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemoverJogador = async (usuarioId) => {
    try {
      await api.put('/mesas/remover', {
        mesaId: mesa._id,
        usuarioId
      })
      setJogadores(prev => prev.filter(j => j.usuarioId !== usuarioId))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-center z-50 p-8">
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Gerenciar mesa</h2>
          <div className="w-6" />
        </div>

        {/* Código da mesa */}
        <div className="flex flex-col gap-1 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-500 tracking-widest uppercase">Código da mesa</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold tracking-widest text-purple-400">{mesa.codigo}</p>
            <button
              onClick={() => navigator.clipboard.writeText(mesa.codigo)}
              className="text-xs text-gray-400 hover:text-white border border-[#ffffff20] px-3 py-1 rounded-full transition">
              Copiar
            </button>
          </div>
          <p className="text-xs text-gray-600">Compartilhe esse código com os jogadores</p>
        </div>

        {/* Jogadores */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Jogadores na mesa ({jogadores.length})</p>
          {jogadores.length === 0 && (
            <div className="p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <p className="text-sm text-gray-500 text-center">Nenhum jogador entrou ainda</p>
            </div>
          )}
          {jogadores.map((jogador, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">👤</span>
                  <span className="text-sm font-bold text-gray-200">{getNomeUsuario(jogador.usuarioId)}</span>
                </div>
                <button
                  onClick={() => handleRemoverJogador(jogador.usuarioId)}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-900 px-3 py-1 rounded-full transition">
                  Remover
                </button>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <span className="text-xs text-gray-500">Personagem:</span>
                <select
                  value={jogador.personagemId || ''}
                  onChange={e => handleDesignar(jogador.usuarioId, e.target.value)}
                  className="flex-1 bg-[#ffffff08] border border-[#ffffff20] rounded-full py-1 px-3 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Sem personagem</option>
                  {personagens.map(p => (
                    <option key={p._id} value={p._id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              {jogador.personagemId && (
                <div className="flex items-center gap-2 pl-6">
                  <span className="text-xs text-gray-500">Designado:</span>
                  <span className="text-xs text-purple-400">{getNomePersonagem(jogador.personagemId)}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default GerenciarMesa