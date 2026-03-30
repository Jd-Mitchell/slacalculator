import { expect } from 'chai'
import {Provier, BusinessHours HandleTime, Calculation } from '..main.js'

describe('SLA Calculation tests', () => {

    let provider, proviers, sla, hours, calculatedDate

    beforeEach(() => {
        provider = Providers.getProvider('NAB')
        providers = Providers.getProviders()
        sla = Providers.getSlaHours(provider.name, 'country')
        currentDate = HandleTime.getCurrentDate('VIC')
    })

    describe('Test 1, input validation', =>{
        // fail tests
        it('Failure test for input validation', => {

        })
    })
})

const inputTests = [
    {
        name: "Blank Times"
        input: [],
        expectedResult: ''
    }
]