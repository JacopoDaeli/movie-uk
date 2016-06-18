'use strict'

if (['staging', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  require('dotenv').config({path: `${__dirname}/.env`})
}

const express = require('express')
const nodeWit = require('node-wit')
const bodyParser = require('body-parser')
const sessions = require('./sessions')

console.log(sessions)

const app = express()

const Logger = nodeWit.Logger
const levels = nodeWit.logLevels
const Wit = nodeWit.Wit

const logger = new Logger(levels.ERROR)
const client = new Wit(process.env.WIT_TOKEN, require('./wit-actions'), logger)

function witProcessing (sessionId, msg) {
  // console.log(msg)
  const ctx = sessions.list[sessionId].context
  client.runActions(sessionId, msg, ctx, (error, context) => {
    if (error) console.error(error)
  }, process.WIT_PROCESSING_STEPS)
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Impero Movie UK')
})

app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
})

app.post('/webhook/', (req, res) => {
  const messagingEvents = req.body.entry[0].messaging

  messagingEvents.forEach((messagingEvent) => {
    const sender = messagingEvent.sender.id
    if (messagingEvent.message && messagingEvent.message.text) {
      const sessionId = sessions.findOrCreateSession(sender)
      witProcessing(sessionId, messagingEvent.message.text)
    }
  })

  res.sendStatus(200)
})

app.listen(3000, () => {
  console.log('impero-movie-uk app is now listening on port 3000.')
  console.log(`Env: ${process.env.NODE_ENV}`)
  console.log(`Verify token: ${process.env.VERIFY_TOKEN}`)
  console.log(`Page access token: ${process.env.PAGE_ACCESS_TOKEN}`)
  console.log(`WIT token: ${process.env.WIT_TOKEN}`)
})
