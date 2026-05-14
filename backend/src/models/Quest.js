import mongoose from 'mongoose'

const questSchema = new mongoose.Schema({
  _id: String,
  nome: String,
  descricao: String,
  recompensa: Number,
  classe: String
})

export default mongoose.model('Quest', questSchema, 'quests')