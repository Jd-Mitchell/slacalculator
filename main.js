import { CalculationUI } from './src/ui/CalculationUI.js'
// import { StatesUI } from './src/ui/UIBuilder.js'
import { HoursUI } from './src/ui/HoursUI.js'
import { ProvidersUI } from './src/ui/ProvidersUI.js'
import { HandleTime } from './src/core/Util.js'
import { StatesUI, TimeUI } from './src/ui/UIBuilder.js'
import { Version } from './src/ui/Version.js'
// import { HoursList } from './src/ui/hourslistUI.js'

StatesUI.setupStatesDropdown()
ProvidersUI.setupProviderDropdowns()
ProvidersUI.QRGButton()
HoursUI.create247Button()
HoursUI.createHoursContainer()
HoursUI.createHoursBlock()
HoursUI.addMoreButtonListener()
CalculationUI.calculateButtonListener()
CalculationUI.resetButtonListener()

// setup the initial date display:

setInterval(() => {
    HandleTime.getCurrentDate(StatesUI.state.selectedState)
    TimeUI.displayTime('current',HandleTime.state.initialDate)
}, 1000)

Version.versionDisplay()
Version.copyrightDisplay()