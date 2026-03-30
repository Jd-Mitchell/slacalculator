import { DateTime } from './luxon-bridge.js'
class HandleTime {
    static state = {
        initialDate: '',

    }

    static getCurrentDate (selectedState) {
        // console.log(selectedState.state)
       this.state.initialDate = DateTime.now().setZone(selectedState.timezone)
    }
}

export { HandleTime }