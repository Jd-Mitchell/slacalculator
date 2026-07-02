class LuxonBridge {

    static DateTime 
    static Settings
    static Interval
    static {

        let luxonLibrary
        
        if (typeof window !== 'undefined' && window.luxon) {
          // USING FROM BROWSER, use the global window
          luxonLibrary = window.luxon
          console.log('Browser detected, using Luxon Global Window')
        } else {
          // NODE: Use standard import
        
          try {
            import('luxon')
            .then((module) => {
                this.DateTime = module.DateTime
                this.Settings = module.Settings
                this.Interval = module.Interval
            })
          } catch (error) {
            console.error("Luxon couldn't be loaded here. Abort")
          }
        }
        this.DateTime = luxonLibrary?.DateTime
        this.Settings = luxonLibrary?.Settings
        this.Interval = luxonLibrary?.Interval
    }
    
}


export { LuxonBridge }

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
}

export { StatesCreator }


class HandleTime {
    static state = {
        initialDate: '',

    }

    static getCurrentDate(selectedState) {
        // console.log(selectedState.state)
        this.state.initialDate = LuxonBridge.DateTime.now().setZone(selectedState.timezone)
    }

    static splitTime(time) {
        const [hour, minute] = [time.slice(0, 2), time.slice(2)].map(Number)
        return { hour, minute }
    }
    static getHours(initialDate, hours) {
        let selectedHours = this.splitTime(hours)
        let hourTime = initialDate
        hourTime = hourTime.set({
            hour: selectedHours.hour,
            minute: selectedHours.minute,
            second: 0,
            millisecond: 0
        })
        return hourTime
    }
}

export { HandleTime }
