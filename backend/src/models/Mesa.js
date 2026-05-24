import mongoose from 'mongoose'

const mesaSchema = new mongoose.Schema({
  nome: String,
  codigo: String,
  mestreId: String,
  jogadores: [
    {
      usuarioId: String,
      personagemId: String
    }
  ]
}, { versionKey: false })

export default mongoose.model('Mesa', mesaSchema, 'mesas')