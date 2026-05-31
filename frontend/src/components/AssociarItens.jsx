import { useState, useEffect } from 'react'
import api from '../services/api'

function AssociarItens({ personagem, onFechar, onAtualizar }) {
  const [habilidades, setHabilidades] = useState([])
  const [itens, setItens] = useState([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    api.get('/habilidades').then(res => setHabilidades(res.data))
    api.get('/itens').then(res => setItens(res.data))
  }, [])

  const handleAssociarHabilidade = async (habilidadeId) => {
    try {
      await api.put(`/personagens/${personagem._id}/habilidades`, { habilidadeId })
      setSucesso('Habilidade associada!')
      setErro('')
      onAtualizar()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao associar habilidade')
      setSucesso('')
    }
  }

  const handleAssociarItem = async (itemId) => {
    try {
      await api.put(`/personagens/${personagem._id}/itens`, { itemId, quantidade: 1 })
      setSucesso('Item associado!')
      setErro('')
      onAtualizar()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao associar item')
      setSucesso('')
    }
  }

  const habilidadesDisponiveis = habilidades.filter(h => !personagem.habilidades.includes(h._id))
  const itensDisponiveis = itens.filter(i => !personagem.inventario.find(inv => inv.itemId === i._id))

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-start z-50 p-8 overflow-y-auto">
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Associar ao personagem</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-500">Personagem</p>
          <p className="text-sm font-bold text-purple-400">{personagem.nome}</p>
        </div>

        {erro && <p className="text-xs text-center text-red-400">{erro}</p>}
        {sucesso && <p className="text-xs text-center text-green-400">{sucesso}</p>}

        {/* Habilidades */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Habilidades disponíveis</p>
          {habilidadesDisponiveis.length === 0 && (
            <p className="text-sm text-gray-500">Todas as habilidades já foram associadas</p>
          )}
          {habilidadesDisponiveis.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <div className="flex items-center gap-3">
                {h.imagem && (
                  <img src={`http://localhost:3001${h.imagem}`} alt={h.nome} className="w-8 h-8 object-contain" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-200">{h.nome}</span>
                  <span className="text-xs text-gray-500">
                    {h.dano ? `Dano: ${h.dano}` : ''}
                    {h.cura ? `Cura: ${h.cura}` : ''}
                    {h.efeito ? `${h.efeito}` : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleAssociarHabilidade(h._id)}
                className="text-xs text-purple-400 border border-purple-900 px-3 py-1 rounded-full hover:bg-purple-900 transition">
                Associar
              </button>
            </div>
          ))}
        </div>

        {/* Itens */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Itens disponíveis</p>
          {itensDisponiveis.length === 0 && (
            <p className="text-sm text-gray-500">Todos os itens já foram associados</p>
          )}
          {itensDisponiveis.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <div className="flex items-center gap-3">
                {item.imagem && (
                  <img src={`http://localhost:3001${item.imagem}`} alt={item.nome} className="w-8 h-8 object-contain" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-200">{item.nome}</span>
                  <span className="text-xs text-gray-500">{item.efeito}</span>
                </div>
              </div>
              <button
                onClick={() => handleAssociarItem(item._id)}
                className="text-xs text-cyan-400 border border-cyan-900 px-3 py-1 rounded-full hover:bg-cyan-900 transition">
                Associar
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AssociarItens