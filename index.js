const express = require('express')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const pug = require('pug')
const cookieParser = require('cookie-parser')

const AuthMiddleware = require('./middleware')
const { login, userList, chat, home, register, getChatHistory, sendChatMessage } = require('./controllers')

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.use(cookieParser())

app.post('/sendChatMessage', sendChatMessage)
app.get('/getChatHistory', getChatHistory)

app.post('/register', register)

app.post('/login', login)

app.get('/userList', AuthMiddleware, userList)

app.get('/chat', chat)

app.get('/', home)

app.listen(3000, () => {
  console.log('server is running')
})
