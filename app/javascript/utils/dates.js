export function addMonths(date, amount) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + amount)
  return d
}


export function subtractMonths(date, amount) {
  return addMonths(date, -amount)
}
