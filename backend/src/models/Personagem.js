import mongoose from 'mongoose'

const personagemSchema = new mongoose.Schema({
  _id: String,
  nome: String,
  classeId: String,
  nivel: Number,
  xp: Number,
  atributos: {
    forca: Number,
    inteligencia: Number,
    agilidade: Number
  },
  vida: Number,
  mana: Number,
  inventario: [
    {
      itemId: String,
      quantidade: Number
    }
  ],
  habilidades: [String],
  quests: [
    {
      questId: String,
      status: String
    }
  ]
})

export default mongoose.model('Personagem', personagemSchema, 'personagens')