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
const chatHistory = {
  12: {
    messages: [
      {
        id: 0,
        text: 'zdarova',
        author: 1
      },
      {
        id: 1,
        text: 'privet',
        author: 2
      }
    ]
  }
}

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

module.exports = {
  users,
  chatHistory,
  authorized
}
