import { useState } from 'react'
import api from '../services/api'

function AjustarStatus({ personagem, mesa, onFechar }) {
  const [vidaAtual, setVidaAtual] = useState(personagem.vidaAtual)
  const [manaAtual, setManaAtual] = useState(personagem.manaAtual)

  const aplicar = async (novaVida, novaMana) => {
    try {
      await api.put(`/personagens/${personagem._id}/status`, {
        vidaAtual: novaVida,
        manaAtual: novaMana,
        mesaId: mesa._id
      })
    } catch (err) {
      console.log(err)
    }
  }

  const ajustarVida = (delta) => {
    const novaVida = Math.max(0, Math.min(personagem.vida, vidaAtual + delta))
    setVidaAtual(novaVida)
    aplicar(novaVida, manaAtual)
  }

  const ajustarMana = (delta) => {
    const novaMana = Math.max(0, Math.min(personagem.mana, manaAtual + delta))
    setManaAtual(novaMana)
    aplicar(vidaAtual, novaMana)
  }

  const handleVidaInput = (e) => {
    let valor = parseInt(e.target.value)
    if (isNaN(valor)) valor = 0
    valor = Math.max(0, Math.min(personagem.vida, valor))
    setVidaAtual(valor)
    aplicar(valor, manaAtual)
  }

  const handleManaInput = (e) => {
    let valor = parseInt(e.target.value)
    if (isNaN(valor)) valor = 0
    valor = Math.max(0, Math.min(personagem.mana, valor))
    setManaAtual(valor)
    aplicar(vidaAtual, valor)
  }

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-center z-50 p-8">
      <div className="w-full max-w-md flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Ajustar status</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-500">Personagem</p>
          <p className="text-sm font-bold text-purple-400">{personagem.nome}</p>
        </div>

        {/* Vida */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Vida</p>
          <div className="relative w-full h-7 bg-[#ffffff08] rounded-full overflow-hidden border border-[#ffffff10]">
            <div
              className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${(vidaAtual / personagem.vida) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {vidaAtual}/{personagem.vida}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={vidaAtual}
              onChange={handleVidaInput}
              min={0}
              max={personagem.vida}
              className="w-24 bg-[#ffffff08] border border-[#ffffff20] rounded-full py-1 px-3 text-sm text-center text-gray-300 focus:outline-none focus:border-red-500"
            />
            <span className="text-xs text-gray-500">/ {personagem.vida}</span>
          </div>

          <div className="flex gap-2 justify-center">
            <button onClick={() => ajustarVida(-10)} className="px-3 py-1 rounded-full bg-red-900 hover:bg-red-800 text-sm transition">-10</button>
            <button onClick={() => ajustarVida(-5)} className="px-3 py-1 rounded-full bg-red-900 hover:bg-red-800 text-sm transition">-5</button>
            <button onClick={() => ajustarVida(-1)} className="px-3 py-1 rounded-full bg-red-900 hover:bg-red-800 text-sm transition">-1</button>
            <button onClick={() => ajustarVida(1)} className="px-3 py-1 rounded-full bg-green-900 hover:bg-green-800 text-sm transition">+1</button>
            <button onClick={() => ajustarVida(5)} className="px-3 py-1 rounded-full bg-green-900 hover:bg-green-800 text-sm transition">+5</button>
            <button onClick={() => ajustarVida(10)} className="px-3 py-1 rounded-full bg-green-900 hover:bg-green-800 text-sm transition">+10</button>
          </div>
        </div>

        {/* Mana */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[#ffffff06] border border-[#ffffff10]">
          <p className="text-xs text-gray-400 tracking-widest uppercase">Mana</p>
          <div className="relative w-full h-7 bg-[#ffffff08] rounded-full overflow-hidden border border-[#ffffff10]">
            <div
              className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${(manaAtual / personagem.mana) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {manaAtual}/{personagem.mana}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={manaAtual}
              onChange={handleManaInput}
              min={0}
              max={personagem.mana}
              className="w-24 bg-[#ffffff08] border border-[#ffffff20] rounded-full py-1 px-3 text-sm text-center text-gray-300 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-xs text-gray-500">/ {personagem.mana}</span>
          </div>

          <div className="flex gap-2 justify-center">
            <button onClick={() => ajustarMana(-10)} className="px-3 py-1 rounded-full bg-cyan-900 hover:bg-cyan-800 text-sm transition">-10</button>
            <button onClick={() => ajustarMana(-5)} className="px-3 py-1 rounded-full bg-cyan-900 hover:bg-cyan-800 text-sm transition">-5</button>
            <button onClick={() => ajustarMana(-1)} className="px-3 py-1 rounded-full bg-cyan-900 hover:bg-cyan-800 text-sm transition">-1</button>
            <button onClick={() => ajustarMana(1)} className="px-3 py-1 rounded-full bg-green-900 hover:bg-green-800 text-sm transition">+1</button>
            <button onClick={() => ajustarMana(5)} className="px-3 py-1 rounded-full bg-green-900 hover:bg-green-800 text-sm transition">+5</button>
            <button onClick={() => ajustarMana(10)} className="px-3 py-1 rounded-full bg-green-900 hover:bg-green-800 text-sm transition">+10</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AjustarStatus