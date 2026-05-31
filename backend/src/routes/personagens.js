import express from 'express'
import Personagem from '../models/Personagem.js'
import upload from '../upload.js'
import { io } from '../server.js'

const router = express.Router()

// Buscar todos os personagens
router.get('/', async (req, res) => {
  try {
    const personagens = await Personagem.find()
    res.json(personagens)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar personagens' })
  }
})

// Buscar um personagem por id
router.get('/:id', async (req, res) => {
  try {
    const personagem = await Personagem.findById(req.params.id)
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar personagem' })
  }
})

// Criar novo personagem com imagem
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const dados = JSON.parse(req.body.dados)
    if (req.file) {
      dados.imagem = `/uploads/${req.file.filename}`
    }
    const personagem = new Personagem(dados)
    await personagem.save()
    res.status(201).json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar personagem' })
  }
})

// Atualizar personagem
router.put('/:id', async (req, res) => {
  try {
    const personagem = await Personagem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar personagem' })
  }
})

// Deletar personagem
router.delete('/:id', async (req, res) => {
  try {
    await Personagem.findByIdAndDelete(req.params.id)
    res.json({ mensagem: 'Personagem deletado com sucesso' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar personagem' })
  }
})

// Mestre associa habilidade disponível ao personagem
router.put('/:id/habilidades', async (req, res) => {
  try {
    const { habilidadeId } = req.body
    const personagem = await Personagem.findById(req.params.id)
    if (!personagem) return res.status(404).json({ erro: 'Personagem não encontrado' })
    if (personagem.habilidades.includes(habilidadeId)) return res.status(400).json({ erro: 'Habilidade já associada' })
    personagem.habilidades.push(habilidadeId)
    await personagem.save()
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao associar habilidade' })
  }
})

// Mestre associa item disponível ao personagem
router.put('/:id/itens', async (req, res) => {
  try {
    const { itemId, quantidade } = req.body
    const personagem = await Personagem.findById(req.params.id)
    if (!personagem) return res.status(404).json({ erro: 'Personagem não encontrado' })
    const itemExiste = personagem.inventario.find(i => i.itemId === itemId)
    if (itemExiste) return res.status(400).json({ erro: 'Item já associado' })
    personagem.inventario.push({ itemId, quantidade: quantidade || 1 })
    await personagem.save()
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao associar item' })
  }
})

// Jogador equipa habilidade
router.put('/:id/equipar-habilidade', async (req, res) => {
  try {
    const { habilidadeId, mesaId } = req.body
    const personagem = await Personagem.findById(req.params.id)
    if (!personagem) return res.status(404).json({ erro: 'Personagem não encontrado' })
    if (personagem.habilidadesEquipadas.length >= 3) return res.status(400).json({ erro: 'Limite de 3 habilidades equipadas' })
    if (personagem.habilidadesEquipadas.includes(habilidadeId)) return res.status(400).json({ erro: 'Habilidade já equipada' })
    personagem.habilidadesEquipadas.push(habilidadeId)
    await personagem.save()
    if (mesaId) io.to(mesaId).emit('personagem-atualizado', personagem)
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao equipar habilidade' })
  }
})

// Jogador desequipa habilidade
router.put('/:id/desequipar-habilidade', async (req, res) => {
  try {
    const { habilidadeId, mesaId } = req.body
    const personagem = await Personagem.findById(req.params.id)
    if (!personagem) return res.status(404).json({ erro: 'Personagem não encontrado' })
    personagem.habilidadesEquipadas = personagem.habilidadesEquipadas.filter(h => h !== habilidadeId)
    await personagem.save()
    if (mesaId) io.to(mesaId).emit('personagem-atualizado', personagem)
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao desequipar habilidade' })
  }
})

// Jogador equipa item
router.put('/:id/equipar-item', async (req, res) => {
  try {
    const { itemId, mesaId } = req.body
    const personagem = await Personagem.findById(req.params.id)
    if (!personagem) return res.status(404).json({ erro: 'Personagem não encontrado' })
    if (personagem.itensEquipados.length >= 2) return res.status(400).json({ erro: 'Limite de 2 itens equipados' })
    if (personagem.itensEquipados.includes(itemId)) return res.status(400).json({ erro: 'Item já equipado' })
    personagem.itensEquipados.push(itemId)
    await personagem.save()
    if (mesaId) io.to(mesaId).emit('personagem-atualizado', personagem)
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao equipar item' })
  }
})

// Jogador desequipa item
router.put('/:id/desequipar-item', async (req, res) => {
  try {
    const { itemId, mesaId } = req.body
    const personagem = await Personagem.findById(req.params.id)
    if (!personagem) return res.status(404).json({ erro: 'Personagem não encontrado' })
    personagem.itensEquipados = personagem.itensEquipados.filter(i => i !== itemId)
    await personagem.save()
    if (mesaId) io.to(mesaId).emit('personagem-atualizado', personagem)
    res.json(personagem)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao desequipar item' })
  }
})

export default router