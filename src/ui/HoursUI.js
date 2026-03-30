import { BusinessHours } from '../core/BusinessHours.js'
import { UICreator } from './UICreator.js' 

class HoursUI {
    static state = {
        hoursBlockIdentifier: 0,
        hoursBlockElements: {},
        hoursBlockDetails: {},
    }         
    static getDaysList() {
        return ['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day, index) => ({name: day, value: index + 1}))
    }

    static createHoursBlock() {
        console.log('FIRE!')
        const blockName = `hoursBlock${this.state.hoursBlockIdentifier}`;
        const currentBlock = (this.state.hoursBlockElements[blockName] = {});
        this.state.hoursBlockDetails[blockName] = { dayFrom: '', dayTo: '', openingText: '', closingText: '' };
        console.log(this.state.hoursBlockDetails);

        // element creation
        const container = document.querySelector('.operating-input-container');

        console.log(container);

        currentBlock.operatingInputBox = UICreator.createNewElement(container, 'div', ['operating-input-box'], [`operating-input-box${blockName}`], {}, {}, '');
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
            delete this.state.hoursBlockElements[block];
        } else {
            console.log('there can only be one!');
            UICreator.removeElement(this.state.hoursBlockElements[block].operatingInputBox.element.id);
            delete this.state.hoursBlockElements[block];
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