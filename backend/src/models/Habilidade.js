import mongoose from 'mongoose'

const habilidadeSchema = new mongoose.Schema({
  _id: String,
  nome: String,
  dano: Number,
  cura: Number,
  efeito: String,
  custoMana: Number,
  classe: String
})

export default mongoose.model('Habilidade', habilidadeSchema, 'habilidades')