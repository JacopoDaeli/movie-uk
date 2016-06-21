'use strict'

const fbMessenger = require('./lib/fb-messenger')
const firstEntityValue = require('./utils').firstEntityValue
const formatSearchDatetime = require('./utils').formatSearchDatetime
const sanitizePostcode = require('./utils').sanitizePostcode

const movie = require('./lib/movie')
const cinema = require('./lib/cinema')
const templates = require('./templates')
const sessions = require('./sessions')

const actions = {
  say (sessionId, context, message, cb) {
    fbMessenger.send(sessions.list[sessionId].fbid, message, cb)
  },
  merge (sessionId, context, entities, message, cb) {
    // console.log(context, entities)
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
    context.lastAction = 'findCinemasByMovie'

    movie
      .findByName(context.searchMovieTitle)
      .then((movie) => {
        const datetime = formatSearchDatetime(context.searchDatetime)
        const postcode = sanitizePostcode(context.searchPostcode)

        return cinema
          .findByMovieDatePostcode(movie.Film_id, datetime, postcode)
      })
      .then((cinema) => {
        context.resultText = templates.cinemasByMovie(context, cinema)
        cb(context)
      })
      .catch((err) => {
        context.resultText = `${err.message}.`
        cb(context)
      })
  },
  findCinemasByLocation (sessionId, context, cb) {
    context.lastAction = 'findCinemasByLocation'

    const postcode = sanitizePostcode(context.searchPostcode)
    cinema
      .findByPostcode(postcode)
      .then((cinemas) => {
        const datetime = formatSearchDatetime(context.searchDatetime)

        return movie
          .findByCinemaDate(cinemas[0].Id, datetime)
          .then((cinema) => {
            context.resultText = templates.cinemasByLocation(context, cinema[cinemas[0].Id])
            cb(context)
          })
      })
      .catch((err) => {
        context.resultText = `${err.message}.`
        cb(context)
      })
  }
}

module.exports = actions
