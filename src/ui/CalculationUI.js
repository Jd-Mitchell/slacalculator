import { BusinessHours } from '../core/BusinessHours.js';
import { Calculation } from '../core/Calculation.js';
import { HoursInput } from '../core/HandleInput.js';
import { HoursDisplay } from './HoursDisplay.js';
import { HoursUI } from './HoursUI.js';
import { Message } from '../core/Messages.js';
import { MessageDisplay } from './Messagehandler.js';
import { ProvidersUI } from './ProvidersUI.js';
import { HandleTime } from '../core/HandleTime.js';
import { TimeUI } from './TimeUI.js';

class CalculationUI {
    static state = {
        overlay: null,
        calculateButton: null,
        resetButton: null,
       calculationResult: null

    };

    static calculateButtonListener() {
        this.state.calculateButton = document.querySelector('#calculate-button');
        this.state.calculateButton.addEventListener('click', (e) => {
            console.log('FIRE!');
            this.callCalculation();
        });
    }

    static callCalculation() {
        const hoursArray = [];

        Object.values(HoursUI.state.hoursBlockDetails).forEach((block) => {
            let dayFrom = block.dayFrom;
            let dayTo = block.dayTo;
            let openingTime = block.openingText.element.value;
            let closingTime = block.closingText.element.value;

            const hoursObject = { dayFrom, dayTo, openingTime, closingTime };
            // console.log(hoursObject);
            hoursArray.push(hoursObject);
            // console.log(hoursArray)
        });
        console.log(hoursArray);
        let message = ''
        try {
            console.log('validating Input...');
            HoursInput.validateInput(hoursArray);
            console.log('Validated!')
            let hours = BusinessHours.getCertifiedHours(hoursArray, ProvidersUI.state.selectedProvider)
            console.log('Hours check passed!')
            console.log('calculating...')
            this.state.calculationResult = Calculation.callCalculation(HandleTime.state.initialDate, ProvidersUI.state.selectedProvider, ProvidersUI.state.selectedSLA, hours)
            message =  Message.success(this.state.calculationResult)
            console.log(this.state.calculationResult.currentDate.toString())
            TimeUI.displayTime('calculation', this.state.calculationResult.currentDate)
            this.lockHoursUI()
            HoursDisplay.hoursDisplay()
            
        } catch (error) {
            if (error.customError) {
                console.warn(`${error.name}. ${error.message}`);
                message = error
            } else {
                throw error;
            }
        }
        // console.log(message)
        MessageDisplay.displayMessage(message)


        // console.log(dayFrom)
        // console.log(`Opening From: ${openingText} ${dayFrom}, day To: ${dayTo}`)
    }
     static resetButtonListener() {
        this.state.resetButton = document.querySelector('#reset-button');
        this.state.resetButton.addEventListener('click', () => {
            location.reload();
        });
    }
    static lockHoursUI(){
        this.state.overlay = document.querySelector('#overlay')
        this.state.overlay.style.zIndex = '2'
        this.state.calculateButton.disabled = true
    }
}

export { CalculationUI };
