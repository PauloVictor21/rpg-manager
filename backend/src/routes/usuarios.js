import express from 'express'
import Usuario from '../models/Usuario.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, { senha: 0 })
    res.json(usuarios)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' })
  }
})

export default router