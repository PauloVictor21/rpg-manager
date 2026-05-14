import mongoose from 'mongoose'

const classeSchema = new mongoose.Schema({
  _id: String,
  nome: String,
  descricao: String,
  atributosBase: {
    forca: Number,
    inteligencia: Number,
    agilidade: Number
  },
  tipo: String
})

export default mongoose.model('Classe', classeSchema, 'classes')