import express from 'express'
import Habilidade from '../models/Habilidade.js'
import upload from '../upload.js'

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

router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const dados = JSON.parse(req.body.dados)
    if (req.file) {
      dados.imagem = `/uploads/${req.file.filename}`
    }
    const habilidade = new Habilidade(dados)
    await habilidade.save()
    res.status(201).json(habilidade)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar habilidade' })
  }
})

export default router