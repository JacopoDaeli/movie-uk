'use strict'

const fbMessenger = require('./lib/fb-messenger')
const firstEntityValue = require('./utils').firstEntityValue

const movie = require('./lib/movie')
const cinema = require('./lib/cinema')
const templates = require('./templates')
const sessions = require('./sessions')

const actions = {
  say (sessionId, context, message, cb) {
    fbMessenger.send(sessions.list[sessionId].fbid, message, cb)
  },
  merge (sessionId, context, entities, message, cb) {
    const searchMovieTitle = firstEntityValue(entities, 'movie')
    if (searchMovieTitle) context.searchMovieTitle = searchMovieTitle

    const searchPostcode = firstEntityValue(entities, 'location')
    if (searchPostcode) context.searchPostcode = searchPostcode

    const searchDatetime = firstEntityValue(entities, 'datetime')
    if (searchDatetime) context.searchDatetime = searchDatetime

    cb(context)
  },
  error (sessionId, context, error) {
    fbMessenger.send(error.message)
  },
  findCinemasByMovie (sessionId, context, cb) {
    movie
      .findByName(context.searchMovieTitle)
      .then((movie) => {
        const d = new Date(context.searchDatetime)
        const year = d.getFullYear()
        let month = d.getMonth() + 1
        let day = d.getDate()

        month = month > 9 ? month : `0${month}`
        day = day > 9 ? day : `0${day}`

        return cinema
          .findByMovieDatePostcode(movie.film_id, `${year}-${month}-${day}`, context.searchPostcode)
      })
      .then((cinema) => {
        context.result_text = templates.byMovie(context, cinema)
        cb(context)
      })
      .catch((err) => {
        context.result_text = `${err.message}.`
        cb(context)
      })
  },
  findCinemasByLocation (sessionId, context, cb) {
    // console.log(context)
    // cinema
    //   .findByPostcode(context.searchPostcode)
    //   .then((data) => {
    //     context.result_text = findCinemasTemplate(context, data)
    //     cb(context)
    //   })

    context.result_text = 'NOT_IMPLEMENTED'
    cb(context)
  }
}

module.exports = actions
