import { UICreator } from './UICreator.js'

class Version {

    static state = {
        version: '2.0.1',
        build: 3,
        isDev: true
    }

    static versionDisplay() {
        const versionElement = document.querySelector('#version')

        if (this.state.isDev){
            const devTag = UICreator.createNewElement(
                versionElement,
                'b',
                [],
                [],
                {},
                {},
                'DEV '
            )
            versionElement.appendChild(document.createTextNode(`ver. ${this.state.version} `))
            const BuildTag = UICreator.createNewElement(
                versionElement,
                'b',
                [],
                [],
                {},
                {},
                `Build ${this.state.build}`
            )
        
        } else {
            versionElement.textContent = `Ver ${this.state.version}`
        }

    
    }

    
}

export { Version }
