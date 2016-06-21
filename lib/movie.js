'use strict'

const request = require('request')

function createHttpError (msg, body) {
  const httpErr = new Error(msg)
  httpErr.code = 'HTTP_ERROR'
  httpErr.body = body
  return httpErr
}

module.exports = {
  findByName (name) {
    return new Promise((resolve, reject) => {
      const apiBaseUrl = process.env.FINDANYFILM_API_BASE_URL
      request(`${apiBaseUrl}/movies/find-by-name/${name}`, (err, res, body) => {
        if (err) return reject(err)
        if (res.statusCode === 404) {
          return reject(new Error('The movie you are looking for has not been found'))
        } else if (res.statusCode > 399) {
          return reject(createHttpError(`Server returned ${res.statusCode}`, body))
        }
        resolve(JSON.parse(body))
      })
    })
    .then((movies) => movies[0])
  },
  findByCinemaDate (cinema, date) {
    return new Promise((resolve, reject) => {
      const apiBaseUrl = process.env.FINDANYFILM_API_BASE_URL
      request(`${apiBaseUrl}/movies/find-by-cinema-date/${cinema}/${date}`, (err, res, body) => {
        if (err) return reject(err)
        if (res.statusCode > 399) {
          return reject(createHttpError(`Server returned ${res.statusCode}`, body))
        }
        resolve(JSON.parse(body))
      })
    })
  }
}
