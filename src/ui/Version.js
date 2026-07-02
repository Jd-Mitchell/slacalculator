import { UICreator } from './UIBuilder.js'

class Version {

    static state = {
        version: '2.1.0',
        build: 11,
        isDev: false,
        copyright: '2026',
        vendor: 'JDMCreative'
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
    static copyrightDisplay() {
        const copyrightElement = document.querySelector('#copyright')
        copyrightElement.appendChild(document.createTextNode(`Copyright © ${this.state.copyright} ${this.state.vendor}`))

    }

    
}

export { Version }
