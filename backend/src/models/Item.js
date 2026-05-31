import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  _id: String,
  nome: String,
  tipo: String,
  raridade: String,
  efeito: String,
  imagem: String,
})

export default mongoose.model('Item', itemSchema, 'itens')