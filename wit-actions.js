const fbMessenger = require('./lib/fb-messenger')
const firstEntityValue = require('./utils').firstEntityValue

const actions = {
  say (sessionId, context, message, cb) {
    fbMessenger.send(message, cb)
  },
  merge (sessionId, context, entities, message, cb) {
    const search_movieTitle = firstEntityValue(entities, 'movie')
    if (search_movieTitle) context.search_movieTitle = search_movieTitle

    const search_postCode = firstEntityValue(entities, 'location')
    if (search_postCode) context.search_postCode = search_postCode

    const search_dateTime = firstEntityValue(entities, 'datetime')
    if (search_dateTime) context.search_dateTime = search_dateTime

    cb(context)
  },
  error (sessionId, context, error) {
    fbMessenger.send(error.message)
  },
  findCinemasByMovie (sessionId, context, cb) {
    movie
      .findByName(context.search_movieTitle)
      .then((movie) => {
        const d = new Date(context.search_dateTime)
        const year = d.getFullYear()
        let month = d.getMonth() + 1
        let day = d.getDate()

        month = month > 9 ? month : `0${month}`
        day = day > 9 ? day : `0${day}`

        return cinema
          .findByMovieDatePostcode(movie.film_id, `${year}-${month}-${day}`, context.search_postCode)
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
    //   .findByPostcode(context.search_postCode)
    //   .then((data) => {
    //     context.result_text = findCinemasTemplate(context, data)
    //     cb(context)
    //   })

    context.result_text = 'NOT_IMPLEMENTED'
    cb(context)
  }
}
