import { useState, useEffect } from 'react'
import api from '../services/api'

function FormPersonagem({ onFechar, onSalvar }) {
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({
    nome: '',
    classeId: '',
    vida: '',
    mana: '',
    atributos: {
      forca: '',
      inteligencia: '',
      agilidade: ''
    },
    descricao: ''
  })

  useEffect(() => {
    api.get('/classes').then(res => setClasses(res.data))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (['forca', 'inteligencia', 'agilidade'].includes(name)) {
      setForm(prev => ({ ...prev, atributos: { ...prev.atributos, [name]: value } }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSalvar = async () => {
    const novoId = `p${Date.now()}`
    const novoPersonagem = {
      _id: novoId,
      ...form,
      nivel: 1,
      xp: 0,
      inventario: [],
      habilidades: [],
      quests: []
    }
    await api.post('/personagens', novoPersonagem)
    onSalvar()
    onFechar()
  }

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-center z-50 p-8">
      
      <div className="w-full max-w-lg flex flex-col gap-6">
        
        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Adicionar novo personagem</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome do personagem"
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />

          <select
            name="classeId"
            value={form.classeId}
            onChange={handleChange}
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Classe do personagem</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.nome}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <input
              name="vida"
              value={form.vida}
              onChange={handleChange}
              placeholder="Vida"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <input
              name="mana"
              value={form.mana}
              onChange={handleChange}
              placeholder="Mana"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-3">
            <input
              name="forca"
              value={form.atributos.forca}
              onChange={handleChange}
              placeholder="Força"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <input
              name="inteligencia"
              value={form.atributos.inteligencia}
              onChange={handleChange}
              placeholder="Inteligência"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <input
              name="agilidade"
              value={form.atributos.agilidade}
              onChange={handleChange}
              placeholder="Agilidade"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <input
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Descrição do personagem"
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSalvar}
            className="flex-1 py-3 bg-black rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-gray-900 transition">
            Adicionar
          </button>
          <button
            onClick={() => setForm({ nome: '', classeId: '', vida: '', mana: '', atributos: { forca: '', inteligencia: '', agilidade: '' }, descricao: '' })}
            className="flex-1 py-3 bg-red-600 rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-red-700 transition">
            Redefinir
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormPersonagem