// import { Message } from '../core/Messages';
import { UICreator } from './UICreator.js';

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

export { MessageDisplay };
