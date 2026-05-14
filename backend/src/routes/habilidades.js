import express from 'express'
import Habilidade from '../models/Habilidade.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const habilidades = await Habilidade.find()
    res.json(habilidades)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar habilidades' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const habilidade = await Habilidade.findById(req.params.id)
    res.json(habilidade)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar habilidade' })
  }
})

router.post('/', async (req, res) => {
  try {
    const habilidade = new Habilidade(req.body)
    await habilidade.save()
    res.status(201).json(habilidade)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar habilidade' })
  }
})

export default router