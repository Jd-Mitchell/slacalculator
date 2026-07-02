import { Message } from './Messages.js';
import { HandleTime } from './Util.js';
class HoursInput {
    // static state = {
    //     #daysArray: []
    // }
    static #daysArray = [];
    constructor({ dayFrom, dayTo, openingTime, closingTime }) {
        this.dayFrom = dayFrom;
        this.dayTo = dayTo;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
    }

    static fillDaysInput() {
        const sourceArray = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return sourceArray.map((day, index) => ({
            id: index + 1,
            day,
        }));
    }

    static createDaysInput() {
        return new HoursInput({
            dayFrom: this.fillDaysInput(),
            dayTo: this.fillDaysInput(),
            openingTime: '',
            closingTime: '',
        });
    }

    static setDaysInput(selector, day) {
        day = selector.find((item) => item.id === day);
        return day;
    }

    static getDaysInput(days, dayFrom, dayTo, opening, closing) {
        const hoursList = {
            dayFrom: this.setDaysInput(days.dayFrom, dayFrom).id,
            dayTo: this.setDaysInput(days.dayTo, dayTo).id,
            openingTime: opening,
            closingTime: closing,
        };
        this.#daysArray.push(hoursList);
        return this.#daysArray;
    }

    static validateInput(hoursObjects) {
        hoursObjects.every((object) => {
            object.openingTime = object.openingTime.toUpperCase().trim()
            object.closingTime = object.closingTime.toUpperCase().trim()


            if (!/^\d{4}$/.test(object.openingTime) || !/^\d{4}$/.test(object.closingTime)) {
                // input is not a number string and not 4 digits

                // check the inputs
                // create the keywords list (Add to this list)
                let keywords = ['CLOSED', '24/7', 'HOLIDAY', 'STOCKTAKE']
                // if the closed or 24/7 is used on the opening Input
                if (keywords.includes(object.openingTime) || keywords.includes(object.closingTime)) {
                    let keyword = keywords.includes(object.openingTime)
                    ? object.openingTime
                    : object.closingTime
                    // success path:
                    if (object.closingTime === object.openingTime || object.closingTime === '') {
                        return true
                    }
                    // fail path:
                    else if (object.openingTime !== object.closingTime) {
                        Message.throwError(this, `INCORRECT_${keyword}_USAGE`, hoursObjects)
                    }
                }
                // keywords used incorrectly

                else if (/[A-Z]/i.test(object.openingTime) || /[A-Z]/i.test(object.closingTime)) {
                    Message.throwError(this, 'NO_LETTERS_ALLOWED', hoursObjects);
                }
                else {
                    if (object.openingTime === '' || object.closingTime === '') {
                        Message.throwError(this, 'BLANK_TIMES', hoursObjects);
                    } else {

                        Message.throwError(this, 'INCORRECT_NUMBER_FORMAT', hoursObjects);
                    }
                }
            } else {
                console.log('input is 4 numbers')
                const opening = HandleTime.splitTime(object.openingTime);
                console.log(opening)

                const closing = HandleTime.splitTime(object.closingTime);
                console.log(closing)
                if ((opening.hour < 0 || opening.hour > 23) || (opening.minute < 0 || opening.minute >= 60)) {
                    Message.throwError(this, 'TIMES_OUT_OF_BOUNDS', hoursObjects);
                } else if ((closing.hour < 0 || closing.hour > 23) || (closing.minute < 0 || closing.minute >= 60)) {
                    Message.throwError(this, 'TIMES_OUT_OF_BOUNDS', hoursObjects);
                }
            }

            return true;
        });
        console.log('Input validated');
    }

    static getValidatedHoursList(hoursList, dayFrom, dayTo, opening, closing) {
        // try {
        console.log('validating Input...');
        this.validateInput(hoursList);
        console.log('SUCCESS');
    }

    static errors = [
        {
            code: 'BLANK_TIMES',
            name: 'Typo: Blank Times',
            message: 'Opening and closing times cannot be blank',
        },
        {
            code: 'INCORRECT_CLOSED_USAGE',
            name: 'Typo: "CLOSED" used incorrectly.',
            message: '"CLOSED" must either be in the opening field and nothing in the closing field, OR "CLOSED" in both fields.',
        },
        {
            code: 'INCORRECT_24/7_USAGE',
            name: 'Typo: "24/7" used incorrectly.',
            message: '"24/7" must either be in the opening field and nothing in the closing field, OR "24/7" in both fields.',
        },

        {
            code: 'INCORRECT_NUMBER_FORMAT',
            name: 'Typo Error: Numbers too short / long / incorrect',
            message: 'input must be exactly 4 numbers such as "0800" or "1700"',
        },
        {
            code: 'NO_LETTERS_ALLOWED',
            name: 'Typo: No letters allowed',
            message: 'The input must either be all numbers or the word "CLOSED".',
        },
        {
            code: 'TIMES_OUT_OF_BOUNDS',
            name: 'Typo: Hours and Minutes out of Bounds',
            message: 'Hours must be between 00 and 23 and Minutes between 00 and 60',
        },
    ];
}

export { HoursInput };
