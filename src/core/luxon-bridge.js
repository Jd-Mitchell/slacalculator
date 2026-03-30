let luxonLibrary

if (typeof window !== 'undefined' && window.luxon) {
  // USING FROM BROWSER, use the global window
  luxonLibrary = window.luxon
  console.log('Browser detected, using Luxon Global Window')
} else {
  // NODE: Use standard import

  try {
    luxonLibrary = await import('luxon')
  } catch (error) {
    console.error("Luxon couldn't be loaded here. Abort")
  }
}

const { DateTime, Settings, Interval } = luxonLibrary

export { DateTime, Settings, Interval }
