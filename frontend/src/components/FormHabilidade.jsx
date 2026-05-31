import { useState, useEffect } from 'react'
import api from '../services/api'

function FormHabilidade({ onFechar, onSalvar }) {
  const [classes, setClasses] = useState([])
  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    nome: '',
    classe: '',
    dano: '',
    cura: '',
    efeito: '',
    custoMana: ''
  })

  useEffect(() => {
    api.get('/classes').then(res => setClasses(res.data))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImagem = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagem(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSalvar = async () => {
    const novoId = `h${Date.now()}`
    const dados = {
      _id: novoId,
      ...form
    }

    const formData = new FormData()
    formData.append('dados', JSON.stringify(dados))
    if (imagem) formData.append('imagem', imagem)

    await api.post('/habilidades', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    onSalvar()
    onFechar()
  }

  return (
    <div className="fixed inset-0 bg-[#0b0b2c] text-white flex flex-col items-center justify-center z-50 p-8">
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition text-2xl">«</button>
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-300">Adicionar habilidade</h2>
          <div className="w-6" />
        </div>

        {/* Upload de imagem */}
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => document.getElementById('input-imagem-habilidade').click()}
            className="w-24 h-24 rounded-lg bg-[#ffffff08] border-2 border-dashed border-[#ffffff20] flex items-center justify-center cursor-pointer hover:border-purple-500 transition overflow-hidden">
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-contain" />
              : <span className="text-gray-500 text-sm">+ foto</span>
            }
          </div>
          <input id="input-imagem-habilidade" type="file" accept="image/*" onChange={handleImagem} className="hidden" />
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome da habilidade"
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />

          <select
            name="classe"
            value={form.classe}
            onChange={handleChange}
            className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Classe da habilidade</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.nome}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <input
              name="dano"
              value={form.dano}
              onChange={handleChange}
              placeholder="Dano"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <input
              name="cura"
              value={form.cura}
              onChange={handleChange}
              placeholder="Cura"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <input
              name="custoMana"
              value={form.custoMana}
              onChange={handleChange}
              placeholder="Custo de mana"
              type="number"
              className="w-full bg-[#ffffff08] border border-[#ffffff20] rounded-full py-2 px-5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <input
            name="efeito"
            value={form.efeito}
            onChange={handleChange}
            placeholder="Efeito da habilidade"
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
            onClick={() => {
              setForm({ nome: '', classe: '', dano: '', cura: '', efeito: '', custoMana: '' })
              setImagem(null)
              setPreview(null)
            }}
            className="flex-1 py-3 bg-red-600 rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-red-700 transition">
            Redefinir
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormHabilidade