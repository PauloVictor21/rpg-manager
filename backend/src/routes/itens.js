import express from 'express'
import Item from '../models/Item.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const itens = await Item.find()
    res.json(itens)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar itens' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    res.json(item)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar item' })
  }
})

router.post('/', async (req, res) => {
  try {
    const item = new Item(req.body)
    await item.save()
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar item' })
  }
})

export default router