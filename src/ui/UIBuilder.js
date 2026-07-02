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

export { UICreator }

import { HandleTime, StatesCreator } from '../core/Util.js';
// import { StatesCreator } from '../core/Util.js';
// import { UICreator } from './UICreator.js';
class StatesUI {
    static state = {
        selectedState: '',
    };
    static setupStatesDropdown() {
        console.log('states User Interface setup');
        const statesSelector = document.querySelector('#state');
        const states = StatesCreator.getOptions();

        // this.state.selectedState = 'VIC';
        // this.state.initialTime = HandleTime.getCurrentDate(this.state.selectedState);

        statesSelector.addEventListener('change', (e) => {
            // e.target is the select element; its value is the chosen option's value
            this.state.selectedState = StatesCreator.getState(e.target.value);
            HandleTime.getCurrentDate(this.state.selectedState);
            console.log(HandleTime.state.initialDate.toString())
        });
        states.forEach((state) => {
            const optionElement = UICreator.createNewElement(statesSelector, 'option', [], [], { value: state.state }, {}, state.state);

            if (state.state === 'VIC') {
                optionElement.element.selected = true;
            }
        });
        statesSelector.dispatchEvent(new Event('change'));
    }
}
export { StatesUI };

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



class MessageDisplay {
    static messageContainer = document.querySelector('.message-display');
    static messageBoxContainer = null;
    static createMessageBox() {
        this.messageBoxContainer = UICreator.createNewElement(this.messageContainer, 'div', [], [], {}, {}, '');
    }
    static createMessage(message) {
        if (message.status === 'SUCCESS') {
            this.messageBoxContainer.element.classList.add('success-message');
            const messageHeader = UICreator.createNewElement(this.messageBoxContainer.element, 'h3', [], [], {}, {}, 'SUCCESS!');
        } else {
            this.messageBoxContainer.element.classList.add('error-message');
            const messageHeader = UICreator.createNewElement(this.messageBoxContainer.element, 'h2', [], [], {}, {}, 'ERROR:');
            const headingBr = UICreator.createNewElement(this.messageBoxContainer.element, 'br', [], [], {}, {}, '');
            const messageName = UICreator.createNewElement(this.messageBoxContainer.element, 'h4', [], [], {}, {}, message.name);
            const messageBr = UICreator.createNewElement(this.messageBoxContainer.element, 'br', [], [], {}, {}, '');
            const messageMain = UICreator.createNewElement(this.messageBoxContainer.element, 'p', [], [], {}, {}, message.message);
        }
    }
    static removeDisplay(){

        UICreator.removeElement(this.messageBoxContainer.element)
        this.messageBoxContainer = null

    }
    static displayMessage(message) {
        if (this.messageBoxContainer !== null){
            console.log("Clear the Channels, Raj, there's too much chatter...")
            this.removeDisplay()
        }
        this.createMessageBox();
        this.createMessage(message);
    }
    
}

export { MessageDisplay };