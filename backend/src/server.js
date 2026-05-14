import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import personagensRouter from './routes/personagens.js'
import classesRouter from './routes/classes.js'
import habilidadesRouter from './routes/habilidades.js'
import itensRouter from './routes/itens.js'
import questsRouter from './routes/quests.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/rpg-manager')
  .then(() => console.log('MongoDB conectado!'))
  .catch((err) => console.log('Erro ao conectar:', err))

app.use('/personagens', personagensRouter)
app.use('/classes', classesRouter)
app.use('/habilidades', habilidadesRouter)
app.use('/itens', itensRouter)
app.use('/quests', questsRouter)

app.listen(3001, () => console.log('Servidor rodando na porta 3001'))