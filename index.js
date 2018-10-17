const express = require('express')
const bodyParser = require('body-parser')
const pug = require('pug')
const cookieParser = require('cookie-parser')
const http = require('http')

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use('/scripts', express.static(__dirname + '/node_modules'))
app.use(bodyParser.json())
app.use(cookieParser())

const server = http.Server(app)
const io = require('socket.io')(server)
require('./router')(app, io)

server.listen(3000, () => {
  console.log('server is running')
})
