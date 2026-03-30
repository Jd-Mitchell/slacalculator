import { CalculationUI } from './CalculationUI.js';

class TimeUI {
    static displayTime(section, time) {
        let displayDOM = '';
        if (section === 'current') {
            displayDOM = { day: 'current-day', date: 'current-date', time: 'current-time' };
        } else if (section === 'calculation') {
            let calculatedBox = document.querySelector('.output-box');
            calculatedBox.style.backgroundColor = 'green';
            displayDOM = { day: 'calculated-day', date: 'calculated-date', time: 'calculated-time' };
        }
        Object.keys(displayDOM).forEach((key) => {
            displayDOM[key] = document.querySelector(`#${displayDOM[key]}`);
        });
        displayDOM.day.value = time.toFormat('ccc').toUpperCase();
        displayDOM.date.value = time.toFormat('dd/MM/yyyy');
        displayDOM.time.value = time.toFormat('HH:mm');
    }
}

export { TimeUI };
