import { splitTime } from './SplitTime.js'

class Calculation {
    // static timeKeeper
    constructor({ currentDate, techHours, slaTime, initialSLA, failsafe, failsafeSLA, isCalculated, timeDifference }) {
        this.currentDate = currentDate
        this.techHours = techHours
        this.slaTime = slaTime
        this.initialSLA = initialSLA
        this.failsafe = failsafe
        this.failsafeSLA = failsafeSLA
        this.isCalculated = isCalculated
        this.timeDifference = timeDifference
    }

    static initialise({ initialDate, selectedProvider, selectedSLA }) {
        const initialSLA = initialDate.plus({ hours: selectedSLA })
        const failsafeSLA = initialSLA.plus({ hours: 24 })
        return new Calculation({
            currentDate: initialDate,
            techHours: this.getTechHours(selectedProvider),
            slaTime: selectedSLA,
            initialSLA,
            failsafe: false,
            failsafeSLA,
            isCalculated: false,
            timeDifference: 0
        })
    }

    static getTechHours(selectedProvider) {
        return {
            start: splitTime(selectedProvider.techStart),
            finish: splitTime(selectedProvider.techFinish)
        }
    }

    static checkDay(hours, timeKeeper) {
        console.log(`currentdate is ${timeKeeper.currentDate}`)

        let i = 0
        let today = 0
        while (i < hours.length) {
            today = i
            if (hours[i].day === 7) {
                console.log('This is the end... my friend...')
                return this.checkClosed(hours, today, timeKeeper)
            } else if (hours[i].day !== timeKeeper.currentDate.weekday) {
                console.log(`Day ${today + 1}: Not Today, Zerg!`)
                i++
            } else {
                console.log(`Day ${today + 1}: Today, Zerg!`)
                return this.checkClosed(hours, today, timeKeeper)
            }
        }
        return this.checkDay(hours, timeKeeper)
    }

    static checkClosed(hours, today, timeKeeper) {
        if (hours[today].opening !== 'CLOSED') {
            console.log('open!')
            console.log(timeKeeper.currentDate)
            return this.checkHours(hours, today, timeKeeper)
        } else {
            console.log('Closed!')
            console.log(timeKeeper.currentDate)
            timeKeeper.currentDate = timeKeeper.currentDate.plus({
                days: 1
            })
            timeKeeper.currentDate = timeKeeper.currentDate.set({
                hour: 0,
                minute: 0
            })
            return this.checkDay(hours, timeKeeper)
        }

    }

    static checkHours(hours, today, timeKeeper) {
        console.log('FAIL SAFE:')
        console.log(timeKeeper.failsafeSLA.toString())
        if (timeKeeper.failsafe === false) {
            if (timeKeeper.currentDate >= timeKeeper.failsafeSLA) {
                console.log('the date has exceeded upper threshold!')
                timeKeeper.failsafe = true
            } else if (
                (timeKeeper.currentDate.day === timeKeeper.failsafeSLA.day && timeKeeper.currentDate.hour < timeKeeper.failsafeSLA.hour) && timeKeeper.isCalculated === false) {
                console.log("the date hasn't been calculated yet and the current date is within a day of the failsafe!")
                timeKeeper.failsafe = true
            } else {
                console.log('failsafe not tripped')
            }
        }
        const operatingHours = {}
        if (hours[today].opening === '24/7') {
            console.log('WE NEVER CLOSE!')
                operatingHours.open = timeKeeper.techHours.start,
                operatingHours.close = timeKeeper.techHours.finish            
        } else {
            console.log('WE CLOSE!')
                operatingHours.open = splitTime(hours[today].opening),
                operatingHours.close = splitTime(hours[today].closing)
        }

        console.log(operatingHours)

        const openCloseHours = {
            open: this.getCurrentHours(timeKeeper.techHours.start, operatingHours.open, timeKeeper),
            close: this.getCurrentHours(timeKeeper.techHours.finish, operatingHours.close, timeKeeper)
        }
        console.log(openCloseHours)
        console.log(timeKeeper.currentDate.hour)
        switch (true) {
            case timeKeeper.currentDate.hour < openCloseHours.open.hour || timeKeeper.currentDate.hour > openCloseHours.close.hour || (timeKeeper.currentDate.hour === openCloseHours.close.hour && timeKeeper.currentDate.minute >= openCloseHours.close.minute):
                console.log('Outside of Hours!')
                return this.handleOutsideHours(hours, openCloseHours, timeKeeper)
                break
            default:
                console.log('inside of hours!')
                if (timeKeeper.failsafe === false) {
                    console.log('failsafe has not been tripped')
                    if (timeKeeper.isCalculated === false) {
                        console.log('Not Calculated!')
                        this.calculate(timeKeeper)
                        return this.checkDay(hours, timeKeeper)
                    } else {
                        console.log('Calculated!')
                        // console.log(timeKeeper.currentDate.toString())

                    }
                } else {
                    console.log('failsafe has been tripped!')
                    const hoursPlusSLA = timeKeeper.currentDate.plus({ hours: timeKeeper.slaTime })
                    console.log(`Date: ${timeKeeper.currentDate.toString()}, date plus sla: ${hoursPlusSLA.toString()}`)
                    console.log(hoursPlusSLA)

                    const closingHours = timeKeeper.currentDate.set(openCloseHours.close)

                    timeKeeper.currentDate = (timeKeeper.slaTime <= 8 && hoursPlusSLA <= closingHours)
                        ? hoursPlusSLA
                        : closingHours

                    //   console.log(timeKeeper.currentDate.toString())
                }
                console.log(timeKeeper.currentDate.toString())
                console.log(timeKeeper)
                return timeKeeper
        }
    }

    static handleOutsideHours(hours, openCloseHours, timeKeeper) {
        switch (true) {
            case timeKeeper.currentDate.hour < openCloseHours.open.hour:
                console.log('Before Hours!')
                return timeKeeper.isCalculated === false
                    ? (console.log('not Calculated!'),
                        (timeKeeper.currentDate = timeKeeper.currentDate.set({
                            hour: openCloseHours.open.hour,
                            minute: openCloseHours.open.minute
                        })),
                        this.checkDay(hours, timeKeeper))
                    : (console.log('Calculated!'),
                        console.log(timeKeeper.timeDifference),
                        (timeKeeper.currentDate = timeKeeper.currentDate.set({
                            hour: openCloseHours.open.hour + Math.floor(timeKeeper.timeDifference / 60),
                            minute: openCloseHours.open.minute + (timeKeeper.timeDifference % 60)
                        })),
                        this.checkDay(hours, timeKeeper))
                break

            default:
                console.log('after hours!')
                if (timeKeeper.isCalculated === true) {
                    timeKeeper.timeDifference = timeKeeper.currentDate.hour * 60 + timeKeeper.currentDate.minute - (openCloseHours.close.hour * 60 + openCloseHours.close.minute)
                    console.log(timeKeeper.timeDifference)
                }
                timeKeeper.currentDate = timeKeeper.currentDate.plus({ days: 1 })
                timeKeeper.currentDate = timeKeeper.currentDate.set({
                    hour: 0,
                    minute: 0
                })
                return this.checkDay(hours, timeKeeper)
        }
    }

    static calculate(timeKeeper) {
        console.log('Calculating...')
        console.log(`current Date: ${timeKeeper.currentDate.toString()}`)
        const newDate = timeKeeper.currentDate.plus({ hours: timeKeeper.slaTime })
        timeKeeper.currentDate = newDate
        timeKeeper.isCalculated = true
        console.log('Calculated!')
        console.log(`New date: ${newDate.toString()}`)
        return timeKeeper
    }

    static getCurrentHours(techTime, operatingTime, timeKeeper) {
        let currentHours
        const startFinish = techTime === timeKeeper.techHours.start

        switch (startFinish) {
            case true:
                console.log('Start time!')
                switch (true) {
                    case techTime.hour > operatingTime.hour:
                        console.log('Tech start is later!')
                        currentHours = techTime
                        break
                    case techTime.hour <= operatingTime.hour:
                        console.log('opening is later!')
                        currentHours = operatingTime
                        break
                    default:
                        currentHours = techTime
                }
                break
            case false:
                console.log('finish time!')
                switch (true) {
                    case operatingTime.hour > 0 && operatingTime.hour <= timeKeeper.techHours.start.hour:
                        console.log('hours are after midnight but before or equal to techTime!')
                        currentHours = techTime
                        break
                    case techTime.hour <= operatingTime.hour:
                        console.log('Tech finish ealier!')
                        currentHours = techTime
                        break
                    case techTime.hour >= operatingTime.hour:
                        console.log('closing earlier!')
                        currentHours = operatingTime
                        break
                    default:
                        currentHours = techTime
                }
                break
        }
        return currentHours
    }

    static callCalculation(initialDate, selectedProvider, selectedSLA, hours) {
        const timeKeeper = this.initialise({ initialDate, selectedProvider, selectedSLA })
        return this.checkDay(hours, timeKeeper)
    }
}

export { Calculation }
