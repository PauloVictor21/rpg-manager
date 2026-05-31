import express from 'express'
import Item from '../models/Item.js'
import upload from '../upload.js'

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

router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const dados = JSON.parse(req.body.dados)
    if (req.file) {
      dados.imagem = `/uploads/${req.file.filename}`
    }
    const item = new Item(dados)
    await item.save()
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar item' })
  }
})

export default router