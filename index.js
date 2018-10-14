const express = require('express')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const path = require('path')
const pug = require('pug')
const cookieParser = require('cookie-parser')

let maxid = -1
const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.use(cookieParser())

function AuthMiddleware(req, res, next) {
  const username = req.cookies.username
  if (!username) {
    res.redirect('/')
  }
  next()
}

const users = [
  {
    username: '123',
    id: 1
  },
  {
    username: '234',
    id: 2
  },
  {
    username: '345',
    id: 3
  }
]
const chatHistory = {}
const authorized = [
  {
    username: '123',
    id: 1
  },
  {
    username: '234',
    id: 2
  },
  {
    username: '345',
    id: 3
  }
]

app.post('/register', (req, res) => {
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
})

app.post('/login', (req, res) => {
  const username = req.body.username
  var user = users.filter(u => u.username === username)[0]
  if (user) {
    res.cookie('username', user)
    if (!authorized.map(u => u.username).includes(username)) authorized.push(user)

    const authorizedQstr = authorized.filter(un => un.username !== username).reduce((a, current, index, arr) => {
      return index === arr.length - 1 ? a + current.username : `${a + current.username},`
    }, '')

    return res.redirect(`/userList?authorized=${authorizedQstr}`)
  }

  res.redirect('/?error=such username does not exist')
})

app.get('/userList', AuthMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname + '/userList.html'))
})

app.get('/chat', (req, res) => {
  var username = req.query.username
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(3000, () => {
  console.log('server is running')
})
