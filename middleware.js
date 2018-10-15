function AuthMiddleware(req, res, next) {
  const username = req.cookies.username
  if (!username) {
    res.redirect('/')
  }
  next()
}

module.exports = AuthMiddleware
