function splitTime (time) {
  const [hour, minute] = [time.slice(0, 2), time.slice(2)].map(Number)
  return { hour, minute }
}

export { splitTime }
