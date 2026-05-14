import express from 'express'
import Personagem from '../models/Personagem.js'

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

// Criar novo personagem
router.post('/', async (req, res) => {
  try {
    const personagem = new Personagem(req.body)
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

export default router