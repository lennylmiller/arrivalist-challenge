import fetch, { checkStatus, parseJSON } from './fetch'

export function getAllTripEvents() {
  return fetch('/events')
    .then(checkStatus)
    .then(parseJSON)
}

export function getTripEvents({ state, date }) {
  return fetch(`/events?state=${state}&date=${date}`)
    .then(checkStatus)
    .then(parseJSON)
}
