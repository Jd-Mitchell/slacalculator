import { Providers } from '../core/Providers.js';
import { UICreator } from './UICreator.js';

class ProvidersUI {
    static state = {
        selectedProvider: null,
        selectedSLA: null,
    };
    static setupProviderDropdowns() {
        // setup the main provider select box
        const parentBox = document.querySelector('.sla-dropdowns');
        const providerDropDownBox = UICreator.createNewElement(
            parentBox,
            'select',
            ['drop-down'],
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
        const parentBox = document.querySelector('.sla-dropdowns');
        this.slaDropDownBox = UICreator.createNewElement(
            parentBox,
            'select',
            ['drop-down'],
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
}
export { ProvidersUI }