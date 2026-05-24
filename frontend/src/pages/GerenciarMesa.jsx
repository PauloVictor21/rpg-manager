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
    const usuario = usuarios.find(u => u._id === usuarioId)
    return usuario ? usuario.nome : usuarioId
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

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-center z-50 p-8">
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Gerenciar mesa</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Código da mesa</p>
          <p className="text-2xl font-bold tracking-widest text-purple-400">{mesa.codigo}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Jogadores na mesa</p>
          {jogadores.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum jogador entrou ainda</p>
          )}
          {jogadores.map((jogador, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <span className="text-sm text-gray-300 flex-1">{getNomeUsuario(jogador.usuarioId)}</span>
              <select
                value={jogador.personagemId || ''}
                onChange={e => handleDesignar(jogador.usuarioId, e.target.value)}
                className="bg-[#ffffff08] border border-[#ffffff20] rounded-full py-1 px-3 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
              >
                <option value="">Sem personagem</option>
                {personagens.map(p => (
                  <option key={p._id} value={p._id}>{p.nome}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default GerenciarMesa