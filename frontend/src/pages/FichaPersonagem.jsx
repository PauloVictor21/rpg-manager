import { useState, useEffect } from 'react'
import api from '../services/api'

function FichaPersonagem({ personagem, onFechar }) {
  const [classe, setClasse] = useState(null)
  const [habilidades, setHabilidades] = useState([])
  const [itens, setItens] = useState([])
  const [quests, setQuests] = useState([])

  useEffect(() => {
    api.get(`/classes/${personagem.classeId}`).then(res => setClasse(res.data))

    Promise.all(personagem.habilidades.map(id => api.get(`/habilidades/${id}`)))
      .then(res => setHabilidades(res.map(r => r.data)))

    Promise.all(personagem.inventario.map(item => api.get(`/itens/${item.itemId}`)))
      .then(res => setItens(res.map((r, i) => ({ ...r.data, quantidade: personagem.inventario[i].quantidade }))))

    Promise.all(personagem.quests.map(q => api.get(`/quests/${q.questId}`)))
      .then(res => setQuests(res.map((r, i) => ({ ...r.data, status: personagem.quests[i].status }))))
  }, [])

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-start z-50 p-8 overflow-y-auto">
      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Ficha do personagem</h2>
          <div className="w-6" />
        </div>

        {/* Avatar e info básica */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-900 border-2 border-[#ffffff15] flex items-center justify-center">
            <img 
              src={personagem?.imagem ? `http://localhost:3001${personagem.imagem}` : '/images/Personagem.png'} 
              alt="Personagem" 
              className="w-16 h-16 object-contain" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-gray-200">{personagem.nome}</p>
            <p className="text-sm text-purple-400">{classe ? `${classe.nome} • ${classe.tipo}` : 'Carregando...'}</p>
            <p className="text-xs text-gray-500">Nível {personagem.nivel} • {personagem.xp} XP</p>
          </div>
        </div>

        {/* Barras de vida e mana */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Status</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-10">Vida</span>
              <div className="flex-1 h-6 bg-[#ffffff08] rounded-full overflow-hidden border border-[#ffffff10]">
                <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {personagem.vida}/{personagem.vida}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-10">Mana</span>
              <div className="flex-1 h-6 bg-[#ffffff08] rounded-full overflow-hidden border border-[#ffffff10]">
                <div className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">
                  {personagem.mana}/{personagem.mana}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Atributos */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Atributos</p>
          <div className="flex gap-3">
            {[
              { nome: 'Força', valor: personagem.atributos.forca },
              { nome: 'Inteligência', valor: personagem.atributos.inteligencia },
              { nome: 'Agilidade', valor: personagem.atributos.agilidade }
            ].map((atr, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
                <span className="text-2xl font-bold text-purple-400">{atr.valor}</span>
                <span className="text-xs text-gray-500">{atr.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habilidades */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Habilidades</p>
          {habilidades.length === 0 && <p className="text-sm text-gray-500">Nenhuma habilidade</p>}
          {habilidades.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-200">{h.nome}</span>
                <span className="text-xs text-gray-500">
                  {h.dano ? `Dano: ${h.dano}` : ''}
                  {h.cura ? `Cura: ${h.cura}` : ''}
                  {h.efeito ? `Efeito: ${h.efeito}` : ''}
                </span>
              </div>
              <span className="text-xs text-cyan-400 border border-cyan-900 px-2 py-1 rounded-full">{h.custoMana} mana</span>
            </div>
          ))}
        </div>

        {/* Inventário */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Inventário</p>
          {itens.length === 0 && <p className="text-sm text-gray-500">Inventário vazio</p>}
          {itens.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-200">{item.nome}</span>
                <span className="text-xs text-gray-500">{item.efeito}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 border border-[#ffffff20] px-2 py-1 rounded-full">{item.raridade}</span>
                <span className="text-xs text-yellow-400 border border-yellow-900 px-2 py-1 rounded-full">x{item.quantidade}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quests */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Quests</p>
          {quests.length === 0 && <p className="text-sm text-gray-500">Nenhuma quest</p>}
          {quests.map((quest, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-200">{quest.nome}</span>
                <span className="text-xs text-gray-500">Recompensa: {quest.recompensa} XP</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${quest.status === 'ativa' ? 'text-green-400 border-green-900' : 'text-gray-400 border-gray-700'}`}>
                {quest.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default FichaPersonagem