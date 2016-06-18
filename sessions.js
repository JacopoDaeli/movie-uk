'use strict'

const uuid = require('node-uuid')

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> { fbid: facebookUserId, context: sessionState }

module.export = {
  sessions: {},
  findOrCreateSession (fbid) {
    let sessionId

    Object.keys(this.sessions).forEach(k => {
      if (this.sessions[k].fbid === fbid) {
        sessionId = k
      }
    })

    if (!sessionId) {
      // No session found for user fbid, let's create a new one
      sessionId = uuid.v1()
      this.sessions[sessionId] = { fbid, context: {} }
    }

    return sessionId
  }
}
