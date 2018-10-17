const path = require('path')
const db = require('./db')
const { users, chatHistory, authorized } = db

let maxid = -1

const login = (req, res) => {
  const username = req.body.username
  var user = users.filter(u => u.username === username)[0]
  console.log(user)
  if (user) {
    res.cookie('username', user)
    if (!authorized.map(u => u.username).includes(username)) authorized.push(user)

    const authorizedQstr = authorized.filter(un => un.username !== username).reduce((a, current, index, arr) => {
      return index === arr.length - 1 ? a + current.username : `${a + current.username},`
    }, '')

    return res.redirect(`/userList?authorized=${authorizedQstr}`)
  }

  res.redirect('/?error=such username does not exist')
}

const userList = (req, res) => {
  res.sendFile(path.join(__dirname + '/userList.html'))
}

const chat = (req, res) => {
  const reciever = req.query.username

  res.sendFile(path.join(__dirname + '/chat.html'))
}

const home = (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
}

const register = (req, res) => {
  const username = req.body.username
  if (users.map(u => u.username).includes(username)) {
    return res.redirect('/?error=such username is already taken')
  }

  const user = {
    username,
    id: ++maxid
  }
  users.push(user)
  res.cookie('username', user.username)
  authorized.push(user)

  var authorizedQstr = authorized.filter(un => un.username !== username).reduce((a, current, index, arr) => {
    return index === arr.length - 1 ? a + current.username : `${a + current.username},`
  }, '')
  return res.redirect(`/userList?authorized=${authorizedQstr}`)
}

const sendChatMessage = io => (req, res) => {
  console.log('sendChatMessage ctrl io')
  console.log(io)
  const reciever = req.body.reciever
  const recieverId = users.filter(u => u.username === reciever)[0].id
  const senderId = req.cookies.username.id
  const chatId = [senderId, recieverId].sort((a, b) => a - b).join('')
  const chat = chatHistory[chatId]

  let maxMessageId = chat.messages[chat.messages.length - 1].id
  const newMessage = {
    id: ++maxMessageId,
    text: req.body.message,
    author: senderId
  }
  chat.messages.push(newMessage)

  io.emit('newMessage', newMessage)

  return res.send('ok')
}

const getChatHistory = (req, res) => {
  const reciever = req.query.reciever
  console.log(req.cookies)
  const senderId = req.cookies.username.id
  const recieverId = users.filter(u => u.username === reciever)[0].id
  const chatId = [senderId, recieverId].sort((a, b) => a - b).join('')
  const chat = chatHistory[chatId]

  return res.json(chat.messages)
}

module.exports = {
  login,
  userList,
  chat,
  home,
  register,
  getChatHistory,
  sendChatMessage
}
