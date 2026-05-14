import express from 'express'
import Classe from '../models/Classe.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const classes = await Classe.find()
    res.json(classes)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar classes' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id)
    res.json(classe)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar classe' })
  }
})

router.post('/', async (req, res) => {
  try {
    const classe = new Classe(req.body)
    await classe.save()
    res.status(201).json(classe)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar classe' })
  }
})

export default router