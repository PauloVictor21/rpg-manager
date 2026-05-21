import { useState } from 'react'
import api from '../services/api'

function FormClasse({ onFechar, onSalvar }) {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    atributosBase: {
      forca: '',
      inteligencia: '',
      agilidade: ''
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (['forca', 'inteligencia', 'agilidade'].includes(name)) {
      setForm(prev => ({ ...prev, atributosBase: { ...prev.atributosBase, [name]: value } }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSalvar = async () => {
    const novoId = `c${Date.now()}`
    const novaClasse = {
      _id: novoId,
      ...form
    }
    await api.post('/classes', novaClasse)
    onSalvar()
    onFechar()
  }

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-center z-50 p-8">
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Adicionar nova classe</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome da classe"
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Tipo da classe</option>
            <option value="tanque">Tanque</option>
            <option value="dano">Dano</option>
            <option value="suporte">Suporte</option>
          </select>

          <div className="flex gap-3">
            <input
              name="forca"
              value={form.atributosBase.forca}
              onChange={handleChange}
              placeholder="Força base"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <input
              name="inteligencia"
              value={form.atributosBase.inteligencia}
              onChange={handleChange}
              placeholder="Inteligência base"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <input
              name="agilidade"
              value={form.atributosBase.agilidade}
              onChange={handleChange}
              placeholder="Agilidade base"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <input
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Descrição da classe"
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
            onClick={() => setForm({ nome: '', descricao: '', tipo: '', atributosBase: { forca: '', inteligencia: '', agilidade: '' } })}
            className="flex-1 py-3 bg-red-600 rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-red-700 transition">
            Redefinir
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormClasse