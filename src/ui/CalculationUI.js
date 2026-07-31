import { BusinessHours } from '../core/BusinessHours.js';
import { Calculation } from '../core/Calculation.js';
import { HoursInput } from '../core/HandleInput.js';
// import { HoursDisplay } from './HoursDisplay.js';
import { HoursUI, HoursDisplay } from './HoursUI.js';
import { Message } from '../core/Messages.js';
// import { MessageDisplay } from './UIBuilder.js';
import { ProvidersUI } from './ProvidersUI.js';
import { HandleTime } from '../core/Util.js';
import { MessageDisplay, TimeUI } from './UIBuilder.js';

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
            console.log(`DAY FROM? ${block.dayFrom}`)
            let dayFrom = block.dayFrom;
            console.log(`DAY TO? ${block.dayTo}`)
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
            this.disableCalculateButton()
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
        
    }
    static disableCalculateButton() {
        this.state.calculateButton.disabled = true
    }
}

export { CalculationUI };
