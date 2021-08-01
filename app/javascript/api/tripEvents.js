import { checkStatus, parseJSON } from './tools'

export function getAllTripEvents() {
  return fetch('/api/v1/events.json')
    .then(checkStatus)
    .then(parseJSON)
}

export function getTripEvents({ state, date }) {
  return fetch(`/api/v1/events?state=${state}&date=${date}`)
    .then(checkStatus)
    .then(parseJSON)
}
