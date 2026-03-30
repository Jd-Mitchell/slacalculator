import { HandleTime } from '../core/HandleTime.js';
import { StatesCreator } from '../core/StatesCreator.js';
import { UICreator } from './UICreator.js';
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
            HandleTime.state.initialTime = HandleTime.getCurrentDate(this.state.selectedState);
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
