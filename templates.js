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
  const films = cinema.films
  const filmIds = Object.keys(films)

  let text = `The closest cinema to your postcode is ${cinema.name}. `
  text += `Here the address of the cinema: ${cinema.address1.replace(/<br \/>/g, '')}, ${cinema.postcode}.\n`
  text += `This cinema is currently showing: \n`
  filmIds.forEach((id, index) => {
    if (index > 5) return
    text += `${films[id].film_data.film_title}\n`
  })
  return text
}
