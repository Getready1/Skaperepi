module.exports = function(app, io) {
  const { login, userList, chat, home, register, getChatHistory, sendChatMessage } = require('./controllers')
  const AuthMiddleware = require('./middleware')
  app.post('/sendChatMessage', sendChatMessage(io))
  app.get('/getChatHistory', getChatHistory)

  app.post('/register', register)

  app.post('/login', login)

  app.get('/userList', AuthMiddleware, userList)

  app.get('/chat', chat)

  app.get('/', home)
}
