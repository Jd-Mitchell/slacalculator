import initialHoursTemplate from './data/initialHoursTemplate.json' with { type: 'json' };
import { Message } from './Messages.js';
import { Providers } from './Providers.js';
import { HandleTime } from './Util.js';
class BusinessHours {
    static #hours;
    constructor(day, opening, closing) {
        this.day = day;
        this.opening = opening;
        this.closing = closing;
    }
    
    static getInitialHours() {
        return this.#hours ? !null : initialHoursTemplate.map((item) => new BusinessHours(item.day, item.opening, item.closing));
    }

    static getHours(hoursObjects) {
        const hours = this.getInitialHours();
            hoursObjects.forEach((object) => {
                if (object.dayFrom <= object.dayTo) {
                    for (let i = 0; i < hours.length; i++) {
                        if (hours[i].day >= object.dayFrom && hours[i].day <= object.dayTo) {
                            hours[i].opening = object.openingTime;
                            hours[i].closing = object.closingTime;
                        }
                    }
                } else if (object.dayTo < object.dayFrom) {
                    for (let i = 0; i < hours.length; i++) {
                        if (hours[i].day <= object.dayTo || (hours[i].day >= object.dayFrom && i < hours.length)) {
                            hours[i].opening = object.openingTime;
                            hours[i].closing = object.closingTime;
                        }
                    }
                }
            });
            return hours;
        }

    static validateHours(hours, provider) {

            console.log(provider)

            if (provider === null){
                Message.throwError(this, 'PROVIDER_NOT_SELECTED', hours)
            }
            return hours.every((object) => {
                let closedCount = 0;
                hours.forEach((day) => {
                    if (day.opening === 'CLOSED') {
                        closedCount++;
                    }
                    return closedCount;
                });
                if (closedCount === 7) {
                    Message.throwError(this, 'NO_HOURS_INPUT', hours)
                  
                }
                console.log(hours)
                hours.forEach((day) => {
                    let validatedDay = false
                    while (validatedDay === false) {

                        validatedDay = true

                        if (day.opening !== 'CLOSED') {
                            const techStart = HandleTime.splitTime(provider.techStart)
                            const techFinish = HandleTime.splitTime(provider.techFinish)
                            if (day.opening !== '24/7'){
    
                                const opening = HandleTime.splitTime(day.opening);
                                const closing = HandleTime.splitTime(day.closing);
                                console.log(opening)
                                console.log(closing)
    
                                 if (opening.hour >= 0 && opening.hour < techStart.hour){
                                    console.log('Before Tech Start time!')
                                    day.opening = provider.techStart
                                    console.log(day.opening)
                                    validatedDay = false
                                    continue
                                }
                                 if ((closing.hour > techFinish.hour) || (closing.hour >= 0 && closing.hour < techStart.hour)){
                                    console.log('After TechHours!')
                                    day.closing = provider.techFinish
                                    console.log(day.closing)
                                    validatedDay = false
                                    continue
                                } else if (closing.hour >= 0 && closing.hour <= techStart.hour){
                                    console.log('After Midnight!')
                                    day.closing = '2400'
                                    console.log(day.closing)
                                    validatedDay = false
                                    continue
                                }
    
                               if (opening.hour > closing.hour && (closing.hour > techStart.hour)){
                                   Message.throwError(this, 'OUT_OF_BOUNDS', hours)  
                                } 
                                if (
                                    (opening.hour >= techFinish.hour && closing.hour <= techStart.hour)||
                                    (opening.hour < techStart.hour && closing.hour <= techStart.hour) ||
                                    (opening.hour >= techFinish.hour && closing.hour >= techFinish.hour)||
                                    (opening.hour >= closing.hour && closing.hour <= techStart.hour)
                                ){
                                    Message.throwError(this, 'OUT_OF_TECH_BOUNDS', hours)                           
                                }
                            //    vaildatedDay = true
                            }
                        }
                    }
                });
                  console.log(hours)
                
            });
            
            return true
      
    }
    static getCertifiedHours (hoursObject, provider){

      
           
            console.log('Collecting Hours...')
            const hours = this.getHours(hoursObject)
             console.log('Hours collected');
            console.log('Validating Hours...')
            // console.log(provider)
            this.validateHours(hours, provider)
            return hours


    }
     static errors = [
        {
            code: 'PROVIDER_NOT_SELECTED',
            name: 'Procedure: Provider blank',
            message: 'Please  select a provider first.',
        },
         {
            code: 'NO_HOURS_INPUT',
            name: 'Procedure: No hours entered',
            message: 'There must be at least 1 set of opening and closing hours',
        },
         {
            code: 'OUT_OF_BOUNDS',
            name: 'Out Of Bounds: Opening later than closing',
            message: 'Opening hour must be less than closing hour',
        },
         {
            code: 'OUT_OF_TECH_BOUNDS',
            name: 'Out Of Tech Bounds: Operating hours outside of Tech hours',
            message: 'Operating hours never fall within tech start and finish times.',
        },
    ]
}

export { BusinessHours };
