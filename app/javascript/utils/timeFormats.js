import { timeFormat, timeParse } from 'd3-time-format'

export const day            = timeFormat('%-m/%-d')              // 4/14
export const longDay        = timeFormat('%A')                   // Monday
export const shortDay       = timeFormat('%a')                   // Mon
export const month          = timeFormat('%B')                   // April
export const shortMonth     = timeFormat('%b')                   // Apr
export const monthDay       = timeFormat('%B %-d')               // April 1
export const dayMonth       = timeFormat('%b %d')                // Apr 01
export const shortMonthDay  = timeFormat('%b %-d')               // Apr 1
export const monthYear      = timeFormat('%B %Y')                // April 2016
export const shortMonthYear = timeFormat('%b %Y')                // Jan 2018
export const shortDate      = timeFormat('%-m/%-d/%Y')           // 4/14/2016
export const mediumDate     = timeFormat('%b %-d, %Y')           // Apr 14, 2016
export const fullDate       = timeFormat('%A, %B %-d, %Y')       // Thursday, April 14, 2016
export const dayMonthDate   = timeFormat('%A, %B %-d')           // Thursday, April 14
export const rfc3339Date    = timeFormat('%Y-%m-%d')             // 2016-04-14
export const shortDateTime  = timeFormat('%-m/%-d/%Y %H:%M %p')  // 4/14/2016 10:30 AM

// TODO should parsing live here? should all date stuff be moved to dates maybe? not sure
export const parseShortDate   = timeParse('%-m/%-d/%Y')
export const parseRFC3339Date = timeParse('%Y-%m-%d')

export function dateISOString(date) {
  date = new Date(date)
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )
}

const suffixes = ['th', 'st', 'nd', 'rd']

export const monthDayWithSuffix = date => {
  const tail = date.getDate() % 100
  const suffix = suffixes[(tail < 11 || tail > 13) && (tail % 10)] || suffixes[0]
  return `${monthDay(date)}${suffix}`
}

export const shortDayOfWeek = (d = new Date()) => {
  switch(d.getDay()) {
    case 0: return 'Su'
    case 1: return 'M'
    case 2: return 'Tu'
    case 3: return 'W'
    case 4: return 'Th'
    case 5: return 'F'
    case 6: return 'Sa'
  }
}

export const weekendDates = (today) => {
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  return `S/S, ${month(today)} ${today.getDate()}/${tomorrow.getDate()}, ${today.getFullYear()}`
}
