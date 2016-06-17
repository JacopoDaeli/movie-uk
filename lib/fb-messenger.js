'use strict'

const request = require('request')
const token = process.env.PAGE_ACCESS_TOKEN

module.exports = {
  send (sender, text, _cb) {
    const cb = _cb || function () {}

    const messageData = { text }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: token },
      method: 'POST',
      json: {
        recipient: { id: sender },
        message: messageData
      }
    }, (error, response, body) => {
      if (error) {
        console.error('Error sending message: ', error)
        cb(error)
      } else if (response.body.error) {
        console.error('Error: ', response.body.error)
        cb(response.body.error)
      } else {
        cb()
      }
    })
  }
}
