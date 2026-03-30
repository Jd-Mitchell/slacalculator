import { CalculationUI } from './src/ui/CalculationUI.js'
import { StatesUI } from './src/ui/StatesUI.js'
import { HoursUI } from './src/ui/HoursUI.js'
import { ProvidersUI } from './src/ui/ProvidersUI.js'
import { HandleTime } from './src/core/HandleTime.js'
import { TimeUI } from './src/ui/TimeUI.js'
// import { HoursList } from './src/ui/hourslistUI.js'

StatesUI.setupStatesDropdown()
ProvidersUI.setupProviderDropdowns()
HoursUI.createHoursBlock()
HoursUI.addMoreButtonListener()
CalculationUI.calculateButtonListener()
CalculationUI.resetButtonListener()

// setup the initial date display:

setInterval(() => {
    HandleTime.getCurrentDate(StatesUI.state.selectedState)
    TimeUI.displayTime('current',HandleTime.state.initialDate)
}, 1000)

