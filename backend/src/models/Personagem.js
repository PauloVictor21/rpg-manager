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
  vidaAtual: Number,
  mana: Number,
  manaAtual: Number,
  imagem: String,
  inventario: [
    {
      itemId: String,
      quantidade: Number
    }
  ],
  itensEquipados: [String],
  habilidades: [String],
  habilidadesEquipadas: [String],
  quests: [
    {
      questId: String,
      status: String
    }
  ]
}, { versionKey: false })

export default mongoose.model('Personagem', personagemSchema, 'personagens')