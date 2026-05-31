import axios from 'axios'
import { io } from 'socket.io-client'

const api = axios.create({
  baseURL: 'http://localhost:3001'
})

export const socket = io('http://localhost:3001')

export default api