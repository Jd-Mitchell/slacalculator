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