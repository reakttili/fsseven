const tokenExtractor = (request, response, next) => {
  try {
    const tokenString = request.headers.authorization.slice(7,)
    request.token = tokenString
    next()
  } catch (exception) {
    next()
  }
}
module.exports = { tokenExtractor }