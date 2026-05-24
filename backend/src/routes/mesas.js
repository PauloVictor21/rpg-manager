import express from 'express'
import Mesa from '../models/Mesa.js'

const router = express.Router()

// Criar mesa
router.post('/', async (req, res) => {
  try {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()
    const mesa = new Mesa({
      nome: req.body.nome,
      codigo,
      mestreId: req.body.mestreId,
      jogadores: []
    })
    await mesa.save()
    res.status(201).json(mesa)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar mesa' })
  }
})

// Buscar mesa por código
router.get('/codigo/:codigo', async (req, res) => {
  try {
    const mesa = await Mesa.findOne({ codigo: req.params.codigo })
    if (!mesa) return res.status(404).json({ erro: 'Mesa não encontrada' })
    res.json(mesa)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar mesa' })
  }
})

// Buscar mesas do mestre
router.get('/mestre/:mestreId', async (req, res) => {
  try {
    const mesas = await Mesa.find({ mestreId: req.params.mestreId })
    res.json(mesas)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar mesas' })
  }
})

// Entrar na mesa como jogador
router.post('/entrar', async (req, res) => {
  try {
    const { codigo, usuarioId } = req.body
    const mesa = await Mesa.findOne({ codigo })
    if (!mesa) return res.status(404).json({ erro: 'Mesa não encontrada' })

    const jaEntrou = mesa.jogadores.find(j => j.usuarioId === usuarioId)
    if (jaEntrou) return res.json(mesa)

    mesa.jogadores.push({ usuarioId, personagemId: null })
    await mesa.save()
    res.json(mesa)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao entrar na mesa' })
  }
})

// Designar personagem para jogador
router.put('/designar', async (req, res) => {
  try {
    const { mesaId, usuarioId, personagemId } = req.body
    const mesa = await Mesa.findById(mesaId)
    if (!mesa) return res.status(404).json({ erro: 'Mesa não encontrada' })

    const jogador = mesa.jogadores.find(j => j.usuarioId === usuarioId)
    if (!jogador) return res.status(404).json({ erro: 'Jogador não encontrado na mesa' })

    jogador.personagemId = personagemId
    await mesa.save()
    res.json(mesa)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao designar personagem' })
  }
})

// Remover jogador da mesa
router.put('/remover', async (req, res) => {
  try {
    const { mesaId, usuarioId } = req.body
    const mesa = await Mesa.findById(mesaId)
    if (!mesa) return res.status(404).json({ erro: 'Mesa não encontrada' })

    mesa.jogadores = mesa.jogadores.filter(j => j.usuarioId !== usuarioId)
    await mesa.save()
    res.json(mesa)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover jogador' })
  }
})

export default router