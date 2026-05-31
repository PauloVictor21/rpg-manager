import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import personagensRouter from './routes/personagens.js'
import classesRouter from './routes/classes.js'
import habilidadesRouter from './routes/habilidades.js'
import itensRouter from './routes/itens.js'
import questsRouter from './routes/quests.js'
import authRouter from './routes/auth.js'
import mesasRouter from './routes/mesas.js'
import usuariosRouter from './routes/usuarios.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

mongoose.connect('mongodb://localhost:27017/rpg-manager')
  .then(() => console.log('MongoDB conectado!'))
  .catch((err) => console.log('Erro ao conectar:', err))

app.use('/personagens', personagensRouter)
app.use('/classes', classesRouter)
app.use('/habilidades', habilidadesRouter)
app.use('/itens', itensRouter)
app.use('/quests', questsRouter)
app.use('/auth', authRouter)
app.use('/mesas', mesasRouter)
app.use('/usuarios', usuariosRouter)

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('entrar-mesa', (mesaId) => {
    socket.join(mesaId)
    console.log(`Cliente ${socket.id} entrou na sala ${mesaId}`)
  })

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

export { io }

httpServer.listen(3001, () => console.log('Servidor rodando na porta 3001'))