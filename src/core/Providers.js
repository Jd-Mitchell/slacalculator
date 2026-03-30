import providersData from './data/providers.json' with { type: "json" }

class Providers {
    static #providers
    constructor (name, techStart, techFinish, slas) {
        this.name = name
        this.techStart = techStart
        this.techFinish = techFinish
        this.slas = slas
    }
    static getProviders() {
        return this.#providers
        ? !null
        : providersData.map((provider) => (
            new Providers(provider.name, provider.techStart, provider.techFinish, provider.slas)
        ))
    }
    static getProvider(provider){
        return this.getProviders().find((item) => (
            item.name === provider
        ))
    }
    static getSlaOptions(provider) {
        // console.log(provider.slas)
        return provider.slas
    }
    static getSlaHours(provider, sla){
        return provider.slas[sla]
    }
}

export { Providers }