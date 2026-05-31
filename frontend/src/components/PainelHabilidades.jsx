import { useState, useEffect } from 'react'
import api from '../services/api'

function PainelHabilidades({ personagem, mesa, modo, onFechar, onAtualizar }) {
  const [habilidades, setHabilidades] = useState([])
  const [itens, setItens] = useState([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (personagem.habilidades.length > 0) {
      Promise.all(personagem.habilidades.map(id => api.get(`/habilidades/${id}`)))
        .then(res => setHabilidades(res.map(r => r.data)))
    }
    if (personagem.inventario.length > 0) {
      Promise.all(personagem.inventario.map(inv => api.get(`/itens/${inv.itemId}`)))
        .then(res => setItens(res.map((r, i) => ({ ...r.data, quantidade: personagem.inventario[i].quantidade }))))
    }
  }, [personagem])

  const handleEquiparHabilidade = async (habilidadeId) => {
    try {
      await api.put(`/personagens/${personagem._id}/equipar-habilidade`, { habilidadeId, mesaId: mesa._id })
      setSucesso('Habilidade equipada!')
      setErro('')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao equipar habilidade')
      setSucesso('')
    }
  }

  const handleDesequiparHabilidade = async (habilidadeId) => {
    try {
      await api.put(`/personagens/${personagem._id}/desequipar-habilidade`, { habilidadeId, mesaId: mesa._id })
      setSucesso('Habilidade desequipada!')
      setErro('')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao desequipar habilidade')
      setSucesso('')
    }
  }

  const handleEquiparItem = async (itemId) => {
    try {
      await api.put(`/personagens/${personagem._id}/equipar-item`, { itemId, mesaId: mesa._id })
      setSucesso('Item equipado!')
      setErro('')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao equipar item')
      setSucesso('')
    }
  }

  const handleDesequiparItem = async (itemId) => {
    try {
      await api.put(`/personagens/${personagem._id}/desequipar-item`, { itemId, mesaId: mesa._id })
      setSucesso('Item desequipado!')
      setErro('')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao desequipar item')
      setSucesso('')
    }
  }

  return (
    <div className="flex flex-col w-72 bg-[#1a1a2e] border-r border-[#ffffff15] p-5 gap-5 shadow-2xl overflow-y-auto">
      <div className="flex items-center justify-between border-b border-[#ffffff15] pb-3">
        <div className="flex items-center gap-2">
          <img src="/images/icone-menu-habilidades.png" alt="Habilidades" className="w-7 h-7 object-contain" />
          <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Habilidades e Itens</span>
        </div>
        <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-lg">«</button>
      </div>

      {erro && <p className="text-xs text-center text-red-400">{erro}</p>}
      {sucesso && <p className="text-xs text-center text-green-400">{sucesso}</p>}

      {/* Habilidades */}
      {modo === 'habilidades' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Habilidades ({personagem.habilidadesEquipadas?.length || 0}/3)</p>
          {habilidades.length === 0 && <p className="text-xs text-gray-500">Nenhuma habilidade disponível</p>}
          {habilidades.map((h, i) => {
            const equipada = personagem.habilidadesEquipadas?.includes(h._id)
            return (
              <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${equipada ? 'border-purple-500 bg-purple-900/20' : 'border-[#ffffff10] bg-[#ffffff06]'}`}>
                <div className="flex items-center gap-2">
                  {h.imagem
                    ? <img src={`http://localhost:3001${h.imagem}`} alt={h.nome} className="w-8 h-8 object-contain" />
                    : <div className="w-8 h-8 bg-[#ffffff08] rounded-lg" />
                  }
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-200">{h.nome}</span>
                    <span className="text-xs text-cyan-400">{h.custoMana} mana</span>
                  </div>
                </div>
                <button
                  onClick={() => equipada ? handleDesequiparHabilidade(h._id) : handleEquiparHabilidade(h._id)}
                  className={`text-xs px-2 py-1 rounded-full border transition ${equipada ? 'text-red-400 border-red-900 hover:bg-red-900' : 'text-purple-400 border-purple-900 hover:bg-purple-900'}`}>
                  {equipada ? 'Tirar' : 'Equipar'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Itens */}
      {modo === 'itens' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Itens ({personagem.itensEquipados?.length || 0}/2)</p>
          {itens.length === 0 && <p className="text-xs text-gray-500">Nenhum item disponível</p>}
          {itens.map((item, i) => {
            const equipado = personagem.itensEquipados?.includes(item._id)
            return (
              <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${equipado ? 'border-cyan-500 bg-cyan-900/20' : 'border-[#ffffff10] bg-[#ffffff06]'}`}>
                <div className="flex items-center gap-2">
                  {item.imagem
                    ? <img src={`http://localhost:3001${item.imagem}`} alt={item.nome} className="w-8 h-8 object-contain" />
                    : <div className="w-8 h-8 bg-[#ffffff08] rounded-lg" />
                  }
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-200">{item.nome}</span>
                    <span className="text-xs text-gray-500">x{item.quantidade}</span>
                  </div>
                </div>
                <button
                  onClick={() => equipado ? handleDesequiparItem(item._id) : handleEquiparItem(item._id)}
                  className={`text-xs px-2 py-1 rounded-full border transition ${equipado ? 'text-red-400 border-red-900 hover:bg-red-900' : 'text-cyan-400 border-cyan-900 hover:bg-cyan-900'}`}>
                  {equipado ? 'Tirar' : 'Equipar'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PainelHabilidades