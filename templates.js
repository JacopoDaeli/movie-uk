'use strict'

const moment = require('moment')

exports.cinemasByMovie = function (context, cinema) {
  const movieList = Object.keys(cinema.films)
  const movie = cinema.films[movieList[0]]

  let text = `The closest cinema where you can watch ${movie.film_data.film_title} `
  text += `is ${cinema.name}. Movie starts ${moment(new Date(movie.showings[0].showtime)).calendar()}. `
  text += `Here the address of the cinema: ${cinema.address1.replace(/<br \/>/g, '')}, ${cinema.postcode}. Take it easy.`

  return text
}

exports.cinemasByLocation = function (context, cinema) {
  return JSON.stringify(cinema)
}
