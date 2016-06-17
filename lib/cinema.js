'use strict'

const request = require('request')

function createHttpError (msg, body) {
  const httpErr = new Error(msg)
  httpErr.code = 'HTTP_ERROR'
  httpErr.body = body
  return httpErr
}

module.exports = {
  findByPostcode (postcode) {
    return new Promise((resolve, reject) => {
      const apiBaseUrl = process.env.FINDANYFILM_API_BASE_URL
      request(`${apiBaseUrl}/cinemas/find-by-postcode/${postcode}`, (err, res, body) => {
        if (err) return reject(err)
        if (res.statusCode > 399) {
          const httpErr = new Error(`Server returned ${res.statusCode}`)
          httpErr.code = 'HTTP_ERROR'
          httpErr.body = body
          return reject(httpErr)
        }
        resolve(JSON.parse(body))
      })
    })
  },
  findByMovieDatePostcode (movie, date, postcode) {
    return new Promise((resolve, reject) => {
      const apiBaseUrl = process.env.FINDANYFILM_API_BASE_URL
      const apiUrl = `${apiBaseUrl}/cinemas/find-by-movie-date-postcode/${movie}/${date}/${postcode}`
      // console.log(apiUrl)
      request(apiUrl, (err, res, body) => {
        if (err) return reject(err)
        if (res.statusCode === 404) {
          return reject(createHttpError('Sorry but I couldn\'t find any results for your query', body))
        } else if (res.statusCode >= 500) {
          return reject(createHttpError(`Sorry but something went wrong (${es.statusCode})`, body))
        }
        resolve(JSON.parse(body))
      })
    })
    .then((cinemas) => {
      if (cinemas && cinemas.result === 'alternatives') {
        throw new Error('Sorry but this movie is not avaiable at the time request')
      }
      return cinemas[0]
    })
  }
}
