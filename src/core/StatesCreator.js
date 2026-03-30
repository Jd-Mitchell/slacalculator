// import { DateTime } from '../luxon-bridge.js'

class StatesCreator {
  static #STATES_DATA = [
    { state: 'ACT', timezone: 'Australia/Sydney' },
    { state: 'NSW', timezone: 'Australia/Sydney' },
    { state: 'VIC', timezone: 'Australia/Sydney' },
    { state: 'TAS', timezone: 'Australia/Sydney' },
    { state: 'SA', timezone: 'Australia/Adelaide' },
    { state: 'NT', timezone: 'Australia/Darwin' },
    { state: 'QLD', timezone: 'Australia/Brisbane' },
    { state: 'WA', timezone: 'Australia/Perth' }
  ]

  static getOptions () {
    return [...this.#STATES_DATA].sort((a, b) => a.state.localeCompare(b.state))
  }

  static getState (state) {
    return this.#STATES_DATA.find(item => item.state === state.toUpperCase())
  }

//   static getCurrentDate (state) {
//     const recordedState = this.#getState(state)
//     const selectedState = recordedState || this.#getState(this.#DEFAULT_STATE)
//     return DateTime.now().setZone(selectedState.timezone)
//   }
}

export { StatesCreator }
