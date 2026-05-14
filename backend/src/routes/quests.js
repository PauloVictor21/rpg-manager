import express from 'express'
import Quest from '../models/Quest.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const quests = await Quest.find()
    res.json(quests)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar quests' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)
    res.json(quest)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar quest' })
  }
})

router.post('/', async (req, res) => {
  try {
    const quest = new Quest(req.body)
    await quest.save()
    res.status(201).json(quest)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar quest' })
  }
})

export default router