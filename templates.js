'use strict'

const moment = require('moment')

exports.byMovie = function (context, cinema) {
  const movieList = Object.keys(cinema.films)
  const movie = cinema.films[movieList[0]]

  const movieTitle = context.search_movieTitle
  const postcode = context.search_postCode
  const datetime = context.search_dateTime

  let text = `The closest cinema where you can watch ${movie.film_data.film_title} `
  text += `is ${cinema.name}. Movie starts ${moment(new Date(movie.showings[0].showtime)).calendar()}. `
  text += `Here the address of the cinema: ${cinema.address1.replace(/<br \/>/g, '')}, ${cinema.postcode}. Take it easy.`

  return text
}

exports.byLocation = function (context, data) {
  return ''
}
