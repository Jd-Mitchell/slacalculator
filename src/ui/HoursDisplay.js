import { HoursUI } from './HoursUI.js';

class HoursDisplay {
    static state = {
        hoursText: null
    };

    static hoursDisplay() {
        const hoursDisplayBox = document.querySelector('.hours-display-box');
        this.state.hoursText = document.querySelector('.hours-text');
        const displayList = [];
        console.log(HoursUI.state.hoursBlockDetails);
        Object.values(HoursUI.state.hoursBlockDetails).forEach((block) => {
            let dayFrom = parseInt(block.dayFrom);
            let dayTo = parseInt(block.dayTo);
            let opening = block.openingText.element.value.toUpperCase();
            let closing = block.closingText.element.value.toUpperCase();
            displayList.push({ dayFrom, dayTo, opening, closing });
        });
        console.log(displayList);
        this.state.hoursText.value = '';

        for (let i = 0; i < displayList.length; i++) {
            let dayFrom = displayList[i].dayFrom;
            if (dayFrom === 7) {
                dayFrom = 0;
            }
            let date = new Date();
            console.log(date);
            date.setDate(date.getDate() - date.getDay() + dayFrom);
            console.log(date);
            dayFrom = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
            let dayTo = displayList[i].dayTo;
            if (dayTo === 7) {
                dayTo = 0;
            }
            date.setDate(date.getDate() - date.getDay() + dayTo);
            dayTo = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
            if (displayList[i].opening === 'CLOSED') {
                console.log('CLOSED!');
                if (displayList[i].dayFrom === displayList[i].dayTo) {
                    this.state.hoursText.value += `${dayFrom} - CLOSED\n`;
                } else {
                    this.state.hoursText.value += `${dayFrom} - ${dayTo} CLOSED\n `;
                }
            } else if (displayList[i].dayTo > displayList[i].dayFrom) {
                this.state.hoursText.value += `${displayList[i].opening} - ${displayList[i].closing} ${dayFrom} - ${dayTo}\n`;
            } else if (displayList[i].dayFrom > displayList[i].dayTo) {
                this.state.hoursText.value += `${displayList[i].opening} - ${displayList[i].closing} ${dayFrom} - ${dayTo}\n`;
            }
        }
        this.copyHoursButton()
        this.state.hoursText.value = this.state.hoursText.value.trim();
    }
    static copyHoursButton(){
        const copyButton = document.querySelector('#copy-hob-button')
        copyButton.disabled = false
        copyButton.style.opacity = 1
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this.state.hoursText.value)
            .then(() => {})
            .catch((error => {}))
        })

    }
}

export { HoursDisplay };
