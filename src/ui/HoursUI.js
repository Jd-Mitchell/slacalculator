import { BusinessHours } from '../core/BusinessHours.js'
import { CalculationUI } from './CalculationUI.js'
import { UICreator } from '././UIBuilder.js'

class HoursUI {
    static state = {
        hoursBlockIdentifier: 0,
        hoursBlockElements: {},
        hoursBlockDetails: {},
    }
    static getDaysList() {
        return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => ({ name: day, value: index + 1 }))
    }
    static create247Button() {
        console.log('2 Four 7 Button!')
        const container = document.querySelector('.operating-hours-inner');
        const buttonContainer = UICreator.createNewElement(
            container,
            'div',
            ['two-four-seven-container'],
            [],
            {},
            {},
            '',
        )
        const twoFourSevenButton = UICreator.createNewElement(
            buttonContainer.element,
            'button',
            ['two-four-seven-button'],
            [],
            {},
            {
                click: (e) => {
                    this.set247()
                }
            },
            '24 Hours',
        )
    }

    static set247() {
        console.log('24 button touched')

        const elementBlocks = this.state.hoursBlockElements
        const oldElements = Object.values(elementBlocks)
        console.log(elementBlocks)
        oldElements.forEach((block) => {
            console.log(block)
            if (block.removeButton) {
                console.log(block.removeButton.element)
                block.removeButton.element.click()
            }
        })
        console.log(this.state.hoursBlockElements)
        console.log(elementBlocks)
        const newElements = Object.values(elementBlocks)
        console.log(newElements)
        console.log('element left over:')
        console.dir(newElements[0])
        newElements[0].selectTo.element.value = '7'
        newElements[0].selectTo.element.dispatchEvent(new Event('change'));
        console.log(newElements[0].selectTo.element.value)
        newElements[0].openingInput.element.value = '24/7'
        newElements[0].openingInput.element.dispatchEvent(new Event('change'));
        CalculationUI.lockHoursUI()
        // CalculationUI.state.calculateButton.click()
    }

    static createHoursContainer() {
        const outerContainer = document.querySelector('.operating-hours-inner')
        this.state.operatingInputContainer = UICreator.createNewElement(outerContainer, 'div', ['operating-input-container'], [], {}, {}, '')

        console.log(this.state.operatingInputContainer);
    }

    static createHoursBlock() {
        console.log('FIRE!')
        const blockName = `hoursBlock${this.state.hoursBlockIdentifier}`;
        const currentBlock = (this.state.hoursBlockElements[blockName] = {});
        this.state.hoursBlockDetails[blockName] = { dayFrom: '', dayTo: '', openingText: '', closingText: '' };
        console.log(this.state.hoursBlockDetails);

        // element creation
        

        currentBlock.operatingInputBox = UICreator.createNewElement(this.state.operatingInputContainer.element, 'div', ['operating-input-box'], [`operating-input-box${blockName}`], {}, {}, '');
        console.log(currentBlock.operatingInputBox.element);
        currentBlock.operatingInput = UICreator.createNewElement(currentBlock.operatingInputBox.element, 'div', ['operating-input'], [], {}, {}, '');
        console.log(currentBlock.operatingInput.element);
        currentBlock.daySelector = UICreator.createNewElement(currentBlock.operatingInput.element, 'div', ['day-selector'], [], {}, {}, '');
        console.log(currentBlock.daySelector);

        currentBlock.selectFrom = UICreator.createNewElement(
            currentBlock.daySelector.element,
            'select',
            ['inputfield'],
            [`day-from-${blockName}`],
            {},
            {
                change: (e) => {
                    this.state.hoursBlockDetails[blockName].dayFrom = e.target.value;
                    console.log(`saved to ${blockName}: ${e.target.value}`);
                    console.log(this.state.hoursBlockDetails[blockName]);
                },
            },
            '',
        );

        console.log(currentBlock.selectFrom.element);
        currentBlock.dayOptions = this.getDaysList();
        console.log(currentBlock.dayOptions);

        currentBlock.dayOptions.forEach((day, index) => {
            currentBlock.optionElement = UICreator.createNewElement(currentBlock.selectFrom.element, 'option', [], [], { value: day.value }, {}, day.name);
        });
        currentBlock.selectFrom.element.dispatchEvent(new Event('change'));
        // console.log(currentBlock.selectFrom.element)
        currentBlock.dayFromText = UICreator.createNewElement(currentBlock.daySelector.element, 'p', [], [], {}, {}, 'To');
        currentBlock.selectTo = UICreator.createNewElement(
            currentBlock.daySelector.element,
            'select',
            ['inputfield'],
            [`day-from-${blockName}`],
            {},
            {
                change: (e) => {
                    this.state.hoursBlockDetails[blockName].dayTo = e.target.value;
                    console.log(`saved to ${blockName}: ${e.target.value}`);
                    console.log(this.state.hoursBlockDetails[blockName]);
                },
            },
            '',
        );

        currentBlock.dayOptions.forEach((day, index) => {
            currentBlock.optionElement = UICreator.createNewElement(currentBlock.selectTo.element, 'option', [], [], { value: day.value }, {}, day.name);
            if (day.name === 'FRI') {
                currentBlock.optionElement.element.setAttribute('selected', 'FRI');
            }
        });
        currentBlock.selectTo.element.dispatchEvent(new Event('change'));
        currentBlock.OperatingHoursBox = UICreator.createNewElement(currentBlock.operatingInput.element, 'div', ['operating-hours'], [`opening-${blockName}`], {}, {}, '');
        currentBlock.openingInput = UICreator.createNewElement(currentBlock.OperatingHoursBox.element, 'input', ['inputfield'], [`opening-${blockName}`], { type: 'text', placeholder: 'Opening', autoComplete: 'off' }, '');
        console.log(currentBlock.openingInput.element);
        this.state.hoursBlockDetails[blockName].openingText = currentBlock.openingInput;
        currentBlock.operatingFromText = UICreator.createNewElement(currentBlock.OperatingHoursBox.element, 'p', ['operating-to-text'], [], {}, {}, 'To');
        currentBlock.closingInput = UICreator.createNewElement(currentBlock.OperatingHoursBox.element, 'input', ['inputfield'], [`closing-${blockName}`], { type: 'text', placeholder: 'Closing', autoComplete: 'off' }, '');
        console.log(currentBlock.closingInput.element);
        this.state.hoursBlockDetails[blockName].closingText = currentBlock.closingInput;
        currentBlock.removeButton = UICreator.createNewElement(
            currentBlock.operatingInputBox.element,
            'button',
            ['remove-button'],
            [`remove-button-${blockName}`],
            { data: this.state.hoursBlockIdentifier },
            {
                click: (e) => {
                    console.log(e.target)
                    const target = parseInt(e.target.getAttribute('data'));
                    console.log(target);
                    this.removeHoursBlock(target);
                },
            },
            'REMOVE!',
        );
        console.log(this.state.hoursBlockDetails);
        this.state.hoursBlockIdentifier++;
    }



    static removeHoursBlock(data) {
        console.log(this.state.hoursBlockElements);
        const keys = Object.keys(this.state.hoursBlockElements);
        const block = `hoursBlock${data}`;
        console.log(block);

        if (keys.length > 1) {
            console.log('Wake up, time to die!');
            UICreator.removeElement(this.state.hoursBlockElements[block].operatingInputBox.element.id);
            console.log(this.state.hoursBlockElements[block])
            delete this.state.hoursBlockElements[block];
            delete this.state.hoursBlockDetails[block]
            console.log(this.state.hoursBLockElements)
            console.log(this.state.hoursBlockDetails)
        } else {
            console.log('there can only be one!');
            console.log(this.state.hoursBlockElements)
            UICreator.removeElement(this.state.hoursBlockElements[block].operatingInputBox.element.id);
            delete this.state.hoursBlockElements[block];
            delete this.state.hoursBlockDetails[block]
            console.log(this.state.hoursBlockDetails)
            this.createHoursBlock();
        }

    }
    static getHoursBlock() {
        // const result = {};
        if (!this.state.hoursObject) {
            this.state.hoursObject = [];
        }

        this.state.hoursObject = Object.values(this.state.hoursBlockDetails).map((block) => {
            return {
                dayFrom: block.dayFrom,
                dayTo: block.dayTo,
                openingTime: block.openingText.element.value.toUpperCase(),
                closingTime: block.closingText.element.value.toUpperCase(),
            };
        })
    }

    static addMoreButtonListener() {
        const addMoreButton = document.querySelector('#more-button');
        addMoreButton.addEventListener('click', () => {
            this.createHoursBlock();
        });
    }

}

export { HoursUI }

class HoursDisplay {
    static state = {
        hoursText: null,
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
                    this.state.hoursText.value += `${dayFrom} CLOSED\n`;
                } else {
                    this.state.hoursText.value += `${dayFrom} - ${dayTo} CLOSED\n `;
                }
            } else if (displayList[i].opening === '24/7'){
                console.log('TWO FOUR SEVEN!')
                 this.state.hoursText.value += ` 24/7\n`;

            } else {
                console.log('NOT CLOSED!');

                if (displayList[i].dayTo > displayList[i].dayFrom) {
                    this.state.hoursText.value += `${displayList[i].opening} - ${displayList[i].closing} ${dayFrom} - ${dayTo}\n`;
                } else if (displayList[i].dayFrom > displayList[i].dayTo) {
                    this.state.hoursText.value += `${displayList[i].opening} - ${displayList[i].closing} ${dayFrom} - ${dayTo}\n`;
                } else if (displayList[i].dayTo === displayList[i].dayTo) {
                    this.state.hoursText.value += `${displayList[i].opening} - ${displayList[i].closing} ${dayTo}\n`
                }
            }
        }
        this.state.hoursText.value = this.state.hoursText.value.trim();
        this.copyHoursButton();
    }
    static copyHoursButton() {
        const copyButton = document.querySelector('#copy-hob-button');
        copyButton.disabled = false;
        copyButton.style.opacity = 1;
        copyButton.addEventListener('click', () => {
            navigator.clipboard
                .writeText(this.state.hoursText.value)
                .then(() => {})
                .catch((error) => {});
        });
    }
}

export { HoursDisplay };
