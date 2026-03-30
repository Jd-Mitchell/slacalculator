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

class MessageDisplay {
    static messageContainer = document.querySelector('.message-display');
    static messageBoxContainer = null;
    static createMessageBox() {
        this.messageBoxContainer = UICreator.createNewElement(this.messageContainer, 'div', [], [], {}, {}, '');
    }
    static createMessage(message) {
        if (message.status === 'SUCCESS') {
            this.messageBoxContainer.element.classList.add('success-message');
            const messageHeader = UICreator.createNewElement(this.messageBoxContainer.element, 'p', [], [], {}, {}, 'SUCCESS!');
        } else {
            this.messageBoxContainer.element.classList.add('error-message');
            const messageHeader = UICreator.createNewElement(this.messageBoxContainer.element, 'p', [], [], {}, {}, 'ERROR:');
            const messageName = UICreator.createNewElement(this.messageBoxContainer.element, 'p', [], [], {}, {}, message.name);
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

export { UICreator }