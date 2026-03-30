import { HoursInput } from '../core/HandleInput.js';
import { Providers } from '../core/Providers.js';
import { BusinessHours } from '../core/BusinessHours.js';
import { HandleTime } from '../core/HandleTime.js';
import { Calculation } from '../core/Calculation.js';
import { DateTime } from '../../luxon-bridge.js';

class UICreator {
    constructor({ parentName = document.body, tagName = 'div', classes = [], ids = [], attributes = {}, events = {}, text = '' }) {
        this.parentName = parentName;
        this.tagName = tagName;
        this.classes = classes;
        this.ids = ids;
        this.attributes = attributes;
        this.events = events;
        this.text = text;

        this.element = document.createElement(this.tagName);

        if (this.text) this.element.textContent = this.text;
        if (this.classes.length) this.element.classList.add(...this.classes);
        if (this.ids.length) this.ids.forEach((id) => (this.element.id = id));
        Object.entries(this.attributes).forEach(([key, value]) => {
            this.element.setAttribute(key, value);
        });
        Object.entries(this.events).forEach(([type, func]) => {
            this.element.addEventListener(type, func);
        });
        parentName.append(this.element);
    }

    static createNewElement(parentName, tagName, classes, ids, attributes, events, text) {
        const newElement = new UICreator({ parentName, tagName, classes, ids, attributes, events, text });

        return newElement;
    }

    static removeElement(elementName) {
        if (typeof elementName === 'string') {
            console.log('string!');
            console.log(elementName);
            const elementId = document.getElementById(elementName);
            console.log(elementId);
            if (elementId) elementId.remove();
        } else if (elementName && elementName.remove) {
            elementName.remove();
        }
    }
}

class UIController {
    static state = {};
    static timeDisplay(section, time) {
        let displayDOM = '';
        if (section === 'current') {
            displayDOM = { day: 'current-day', date: 'current-date', time: 'current-time' };
        } else if (section === 'calculation') {
            displayDOM = { day: 'calculated-day', date: 'calculated-date', time: 'calculated-time' };
        }
        Object.keys(displayDOM).forEach((key) => {
            displayDOM[key] = document.querySelector(`#${displayDOM[key]}`);
        });
        displayDOM.day.value = time.toFormat('ccc').toUpperCase();
        displayDOM.date.value = time.toFormat('dd/MM/yyyy');
        displayDOM.time.value = time.toFormat('HH:mm');
    }

    static setupStatesDropDown() {
        const statesSelector = document.querySelector('#state');
        const states = HandleTime.getOptions();

        this.state.selectedState = 'VIC';
        this.state.initialTime = HandleTime.getCurrentDate(this.state.selectedState);

        statesSelector.addEventListener('change', (e) => {
            // e.target is the select element; its value is the chosen option's value
            this.state.selectedState = e.target.value;
            this.state.initialTime = HandleTime.getCurrentDate(this.state.selectedState);
        });
        states.forEach((state) => {
            const optionElement = UICreator.createNewElement(statesSelector, 'option', [], [], { value: state.state }, {}, state.state);

            if (state.state === 'VIC') {
                optionElement.element.selected = true;
            }
        });
        statesSelector.dispatchEvent(new Event('change'));
    }

    static setupProviderDropdowns() {
        // setup the main provider select box
        const parentBox = document.querySelector('.sla');
        const providerDropDownBox = UICreator.createNewElement(
            parentBox,
            'select',
            ['inputfield'],
            ['provider'],
            {},
            {
                change: (e) => {
                    this.state.selectedProvider = Providers.getProvider(e.target.value);
                    if (this.slaDropDownBox) {
                        UICreator.removeElement(this.slaDropDownBox.element);
                    }
                    this.setupSlaDropDown(this.state.selectedProvider);
                },
            },
            '',
        );

        const defaultOptionElement = UICreator.createNewElement(providerDropDownBox.element, 'option', [], [], { disabled: true, selected: true }, {}, 'Provider:');
        const providers = Providers.getProviders();
        providers.forEach((provider) => {
            const optionEelement = UICreator.createNewElement(providerDropDownBox.element, 'option', [], [], { value: provider.name }, {}, provider.name);
        });
    }

    static setupSlaDropDown(provider) {
        const parentBox = document.querySelector('.sla');
        this.slaDropDownBox = UICreator.createNewElement(
            parentBox,
            'select',
            ['inputfield'],
            ['sla'],
            {},
            {
                change: (e) => {
                    const target = e.target.value;
                    this.state.selectedSLA = Providers.getSlaHours(provider, target);
                },
            },
            '',
        );

        const slaOptions = Providers.getSlaOptions(provider);
        console.log(slaOptions);
        if (this.slaDropDownBox?.element) {
            this.slaDropDownBox.element.replaceChildren();
        }
        Object.entries(slaOptions).forEach(([key, value]) => {
            const optionElement = UICreator.createNewElement(this.slaDropDownBox.element, 'option', [], [], { value: key }, {}, key);
        });

        this.slaDropDownBox.element.dispatchEvent(new Event('change'));
    }

    static hoursBlockIdentifier = 0;
    static hoursBlockStorage = {};
    static createHoursBlock() {
        const blockName = `hoursBlock${this.hoursBlockIdentifier}`;
        // this.state[blockName] = { dayFrom: '', dayTo: '' };
        const currentBlock = (this.hoursBlockStorage[blockName] = {});
        if (!this.state.hoursBlockDetails) {
            this.state.hoursBlockDetails = {};
        }

        this.state.hoursBlockDetails[blockName] = { dayFrom: '', dayTo: '', openingText: '', closingText: '' };
        console.log(this.state.hoursBlockDetails);
        const container = document.querySelector('.operating-input-container');

        console.log(container);

        currentBlock.operatingInputBox = UICreator.createNewElement(container, 'div', ['operating-input-box'], [`operating-input-box${this.hoursBlockIdentifier}`], {}, {}, '');
        console.log(currentBlock.operatingInputBox.element);
        currentBlock.operatingInput = UICreator.createNewElement(currentBlock.operatingInputBox.element, 'div', ['operating-input'], [], {}, {}, '');
        console.log(currentBlock.operatingInput.element);
        currentBlock.daySelector = UICreator.createNewElement(currentBlock.operatingInput.element, 'div', ['day-selector'], [], {}, {}, '');
        console.log(currentBlock.daySelector);

        currentBlock.selectFrom = UICreator.createNewElement(
            currentBlock.daySelector.element,
            'select',
            ['inputfield'],
            [`day-from-${this.hoursBlockIdentifier}`],
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
        currentBlock.dayOptions = BusinessHours.getDaysList();
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
            [`day-from-${this.hoursBlockIdentifier}`],
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
        currentBlock.OperatingHoursBox = UICreator.createNewElement(currentBlock.operatingInput.element, 'div', ['operating-hours'], [`opening-${this.hoursBlockIdentifier}`], {}, {}, '');
        currentBlock.openingInput = UICreator.createNewElement(currentBlock.OperatingHoursBox.element, 'input', ['inputfield'], [`opening-${this.hoursBlockIdentifier}`], { type: 'text', placeholder: 'Opening', autoComplete: 'off' }, '');
        console.log(currentBlock.openingInput.element);
        this.state.hoursBlockDetails[blockName].openingText = currentBlock.openingInput;
        currentBlock.operatingFromText = UICreator.createNewElement(currentBlock.OperatingHoursBox.element, 'p', ['operating-to-text'], [], {}, {}, 'To');
        currentBlock.closingInput = UICreator.createNewElement(currentBlock.OperatingHoursBox.element, 'input', ['inputfield'], [`closing-${this.hoursBlockIdentifier}`], { type: 'text', placeholder: 'Closing', autoComplete: 'off' }, '');
        console.log(currentBlock.closingInput.element);
        this.state.hoursBlockDetails[blockName].closingText = currentBlock.closingInput;
        currentBlock.removeButton = UICreator.createNewElement(
            currentBlock.operatingInputBox.element,
            'button',
            ['remove-button'],
            [`remove-button-${this.hoursBlockIdentifier}`],
            { data: this.hoursBlockIdentifier },
            {
                click: (e) => {
                    const target = parseInt(e.target.getAttribute('data'));
                    console.log(target);
                    this.removeHoursBlock(target);
                },
            },
            'REMOVE!',
        );
        console.log(this.state.hoursBlockDetails);
        this.hoursBlockIdentifier++;
    }

    static removeHoursBlock(data) {
        console.log(UIController.hoursBlockStorage);
        const keys = Object.keys(UIController.hoursBlockStorage);
        const block = `hoursBlock${data}`;
        console.log(block);

        if (keys.length > 1) {
            console.log('Wake up, time to die!');
            UICreator.removeElement(this.hoursBlockStorage[block].operatingInputBox.element.id);
            delete this.hoursBlockStorage[block];
        } else {
            console.log('there can only be one!');
            UICreator.removeElement(this.hoursBlockStorage[block].operatingInputBox.element.id);
            delete this.hoursBlockStorage[block];
            this.createHoursBlock();
        }
    }

    static addMoreButtonListener() {
        const addMoreButton = document.querySelector('#more-button');
        addMoreButton.addEventListener('click', () => {
            this.createHoursBlock();
        });
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

    // Object.entries(this.state.hoursBlockDetails).forEach((block) => {
    //     // console.log(this.state.hoursBlockDetails.openingText.element)
    //     console.log(block)
    //     // console.log
    //     const result = Object.entries(this.state.hoursBlockDetails).map(([key, blockData]) =>{

    //         const selectedDayFrom = block[1].dayFrom;
    //         const selectedDayTo = block[1].dayTo;

    //         console.log(`Day From: ${selectedDayFrom} to ${selectedDayTo}`);
    //         console.log(block[1].openingText.element)
    //         const openingTime = block[1].openingText.element.value.toUpperCase()
    //         const closingTime = block[1].closingText.element.value.toUpperCase()
    //         console.log(`from ${openingTime} to ${closingTime}`);

    //         return {
    //             dayFrom: selectedDayFrom,
    //             dayTo: selectedDayTo,
    //             opeingTime: openingTime,
    //             closingTime: closingTime
    //         }
    //     })
    // });
    // this.state.hoursObject = result
    // }

    static calculateButtonListener() {
        const calculateButton = document.querySelector('#calculate-button');
        calculateButton.addEventListener('click', () => {
            console.log('FIRE!');
            this.getHoursBlock();
            
            console.log(this.state.initialTime)
            console.log(this.state.selectedProvider)
            console.log(this.state.selectedSLA)
            console.log(this.state.hoursObject)
            console.log('everything is all good')
            HoursInput.validateInput(this.state.hoursObject);
            const hours = BusinessHours.getCertifiedHours(this.state.hoursObject, this.state.selectedProvider);
            Calculation.callCalculation(this.state.initialTime, this.state.selectedProvider, this.state.selectedSLA, hours);

            this.timeDisplay('calculation', this.state.calculatedTime)
           
        });
    }
    static resetButtonListener() {
        const resetButton = document.querySelector('#reset-button');
        resetButton.addEventListener('click', () => {
            location.reload();
        });
    }

    static StatusMessageHandler(statusObject) {
        const container = document.querySelector('#sla')
        const statusMessageBox = UICreator.createNewElement(
            container,
            'div',
            [],
            [],
            {},
            {},
            '')
        
    }
}

export { UICreator, UIController };
