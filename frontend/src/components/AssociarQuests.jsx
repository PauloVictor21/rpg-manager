import { useState, useEffect } from 'react'
import api from '../services/api'

function AssociarQuests({ personagem, mesa, onFechar, onAtualizar }) {
  const [quests, setQuests] = useState([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    api.get('/quests').then(res => setQuests(res.data))
  }, [])

  const handleAssociarQuest = async (questId) => {
    try {
      await api.put(`/personagens/${personagem._id}/quests`, { questId, mesaId: mesa._id })
      setSucesso('Quest associada!')
      setErro('')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao associar quest')
      setSucesso('')
    }
  }

  const handleRemoverQuest = async (questId) => {
    try {
      await api.put(`/personagens/${personagem._id}/remover-quest`, { questId, mesaId: mesa._id })
      setSucesso('Quest removida!')
      setErro('')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao remover quest')
      setSucesso('')
    }
  }

  const questsAssociadas = personagem.quests.map(q => q.questId)

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-start z-50 p-8 overflow-y-auto">
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Associar quests</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-500">Personagem</p>
          <p className="text-sm font-bold text-purple-400">{personagem.nome}</p>
        </div>

        {erro && <p className="text-xs text-center text-red-400">{erro}</p>}
        {sucesso && <p className="text-xs text-center text-green-400">{sucesso}</p>}

        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Quests disponíveis</p>
          {quests.length === 0 && <p className="text-sm text-gray-500">Nenhuma quest cadastrada</p>}
          {quests.map((quest, i) => {
            const associada = questsAssociadas.includes(quest._id)
            return (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${associada ? 'border-yellow-500 bg-yellow-900/20' : 'border-[#ffffff10] bg-[#ffffff06]'}`}>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-200">{quest.nome}</span>
                  <span className="text-xs text-gray-500">Recompensa: {quest.recompensa} XP</span>
                  {associada && (
                    <span className="text-xs text-yellow-400">
                      Status: {personagem.quests.find(q => q.questId === quest._id)?.status}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => associada ? handleRemoverQuest(quest._id) : handleAssociarQuest(quest._id)}
                  className={`text-xs px-3 py-1 rounded-full border transition ${associada ? 'text-red-400 border-red-900 hover:bg-red-900' : 'text-yellow-400 border-yellow-900 hover:bg-yellow-900'}`}>
                  {associada ? 'Remover' : 'Associar'}
                </button>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default AssociarQuests