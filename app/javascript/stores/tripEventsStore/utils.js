import {
  timeFormat
} from 'd3'

export const between = (here, low, high) => {
  return low > high
    ? here >= high && here <= low
    : here >= low && here <= high
}

export const START_TIME = new Date()

export const appendTimeToDate = (d = START_TIME) => {
  return new Date(`${d}T08:00:00.000Z`)
}

export const shortDateTime = timeFormat('%-m/%-d/%Y %H:%M %p')

