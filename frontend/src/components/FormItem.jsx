import { useState } from 'react'
import api from '../services/api'

function FormItem({ onFechar, onSalvar }) {
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    raridade: '',
    efeito: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSalvar = async () => {
    const novoId = `i${Date.now()}`
    const novoItem = {
      _id: novoId,
      ...form
    }
    await api.post('/itens', novoItem)
    onSalvar()
    onFechar()
  }

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-center z-50 p-8">
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Adicionar item</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome do item"
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Tipo do item</option>
            <option value="arma">Arma</option>
            <option value="armadura">Armadura</option>
            <option value="consumivel">Consumível</option>
          </select>

          <select
            name="raridade"
            value={form.raridade}
            onChange={handleChange}
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Raridade do item</option>
            <option value="comum">Comum</option>
            <option value="incomum">Incomum</option>
            <option value="raro">Raro</option>
            <option value="épico">Épico</option>
            <option value="lendário">Lendário</option>
          </select>

          <input
            name="efeito"
            value={form.efeito}
            onChange={handleChange}
            placeholder="Efeito do item"
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
            onClick={() => setForm({ nome: '', tipo: '', raridade: '', efeito: '' })}
            className="flex-1 py-3 bg-red-600 rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-red-700 transition">
            Redefinir
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormItem