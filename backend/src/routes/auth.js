import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const router = express.Router()

// Cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body

    const usuarioExiste = await Usuario.findOne({ email })
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'Email já cadastrado' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada,
      tipo
    })

    await usuario.save()
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(400).json({ erro: 'Email ou senha incorretos' })
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(400).json({ erro: 'Email ou senha incorretos' })
    }

    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo },
      'rpg-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login' })
  }
})

export default router