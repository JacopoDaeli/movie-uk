'use strict'

function firstEntityValue (entities, entity) {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value

  if (!val) {
    return null
  }
  return typeof val === 'object' ? val.value : val
}

function formatSearchDatetime (searchDatetime) {
  const d = new Date(searchDatetime)
  const year = d.getFullYear()
  let month = d.getMonth() + 1
  let day = d.getDate()

  month = month > 9 ? month : `0${month}`
  day = day > 9 ? day : `0${day}`

  return `${year}-${month}-${day}`
}

function sanitizePostcode (searchPostcode) {
  return searchPostcode.replace(/\s/g, '')
}

exports.firstEntityValue = firstEntityValue
exports.formatSearchDatetime = formatSearchDatetime
exports.sanitizePostcode = sanitizePostcode
