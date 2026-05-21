import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  tipo: {
    type: String,
    enum: ['mestre', 'jogador'],
    default: 'jogador'
  }
}, { versionKey: false })

export default mongoose.model('Usuario', usuarioSchema, 'usuarios')