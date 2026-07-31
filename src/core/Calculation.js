
import { HandleTime, LuxonBridge } from './Util.js';
import { Message } from './Messages.js';

class Calculation {
    // static timeKeeper
    constructor({ currentDate, techHours, slaTime, initialSLA, failsafe, failCount, failsafeSLA, isCalculated, timeDifference }) {
        this.currentDate = currentDate;
        this.techHours = techHours;
        this.slaTime = slaTime;
        this.initialSLA = initialSLA;
        this.failsafe = failsafe;
        this.failCount = failCount;
        this.failsafeSLA = failsafeSLA;
        this.isCalculated = isCalculated;
        this.timeDifference = timeDifference;
    }

    static initialise({ initialDate, selectedProvider, selectedSLA }) {
        const initialSLA = initialDate.plus({ hours: selectedSLA });
        const failsafeSLA = initialSLA.plus({ hours: 24 });
        return new Calculation({
            currentDate: initialDate,
            techHours: this.getInitialTechHours(selectedProvider),
            slaTime: selectedSLA,
            intitialSLA: initialSLA,
            failsafe: false,
            failCount: 0,
            failsafeSLA: failsafeSLA,
            isCalculated: false,
            timeDifference: 0,
        });

    }

    static getInitialTechHours(selectedProvider) {
        return {
            start: HandleTime.splitTime(selectedProvider.techStart),
            finish: HandleTime.splitTime(selectedProvider.techFinish),
        };
    }
    static updateTechHours(currentDate, hours) {
        console.log(hours)

        Object.keys(hours).forEach(key => {
            if (LuxonBridge.DateTime.isDateTime(hours[key])) {
                console.log(`tech hours exist already`)
                hours[key] = hours[key].set({
                    year: currentDate.year,
                    month: currentDate.month,
                    day: currentDate.day,
                 })
                console.log(hours[key].toString())
            } else {

                hours[key] = LuxonBridge.DateTime.fromObject({
                    day: currentDate.day,
                    hour: hours[key].hour,
                    minute: hours[key].minute,
                },
                    {
                        zone: currentDate.zoneName,
                    })
                hours[key]
            }


        })
        console.log("changed tech date")
        console.log(hours.start.toString())
        console.log(hours.finish.toString())
        return hours
    }
    static checkDay(hours, timeKeeper) {
        console.log(`currentdate is ${timeKeeper.currentDate}`);
        console.log(timeKeeper.techHours)

        let i = 0;
        let today = 0;
        while (i < hours.length) {
            today = i;
            if (hours[i].day === 7) {
                console.log('This is the end... my friend...');
                return this.checkClosed(hours, today, timeKeeper);
            } else if (hours[i].day !== timeKeeper.currentDate.weekday) {
                console.log(`Day ${today + 1}: Not Today, Zerg!`);
                i++;
            } else {
                console.log(`Day ${today + 1}: Today, Zerg!`);
                return this.checkClosed(hours, today, timeKeeper);
            }
        }
        return this.checkDay(hours, timeKeeper);
    }

    static checkClosed(hours, today, timeKeeper) {
        if (hours[today].opening !== 'CLOSED') {
            console.log('open!');
            console.log(timeKeeper.currentDate);
            return this.checkHours(hours, today, timeKeeper);
        } else {
            console.log('Closed!');
            console.log(timeKeeper.currentDate);
            timeKeeper.currentDate = timeKeeper.currentDate.plus({
                days: 1,
            });
            timeKeeper.currentDate = timeKeeper.currentDate.set({
                hour: 0,
                minute: 0,
            });
            return this.checkDay(hours, timeKeeper);
        }
    }

    static checkHours(hours, today, timeKeeper) {
        // Update the techHours for today's date if the current Date is different

        timeKeeper.techHours.start.day === timeKeeper.currentDate.day
            ? console.log('tech day is same day as current time')
            : this.updateTechHours(timeKeeper.currentDate, timeKeeper.techHours)

        console.log('FAIL SAFE:')
        console.log(timeKeeper.failsafeSLA.toString())
        console.log(timeKeeper.currentDate.toString())
        console.log(`fail Count: ${timeKeeper.failCount}`)
        if (timeKeeper.failsafe === false) {
            if (timeKeeper.currentDate >= timeKeeper.failsafeSLA) {
                console.log('the date has exceeded upper threshold!')
                timeKeeper.failsafe = true
                timeKeeper.failCount++
                console.log(`FAIL COUNT: ${timeKeeper.failCount}`)
            } else if (
                (timeKeeper.currentDate.day === timeKeeper.failsafeSLA.day && timeKeeper.currentDate < timeKeeper.failsafeSLA) && timeKeeper.isCalculated === false) {
                console.log("the date hasn't been calculated yet and the current date is within a day of the failsafe!")
                timeKeeper.failsafe = true
                timeKeeper.failCount++
            } else {
                console.log('failsafe not tripped');
            }
        } else if (timeKeeper.currentDate < timeKeeper.failsafeSLA) {
            console.log('no fail!');
        } else if (timeKeeper.failsafe === true) {
            console.log('FAILSAFE ENGAGED!');
            if (timeKeeper.failCount < 2) {
                console.log('loop threshold not met, continue until fail');
                timeKeeper.failCount++;
            } else {
                Message.throwError(this, 'LOOP_FAILURE', hours);
            }
        }
        const operatingHours = {};
        if (hours[today].opening === '24/7') {
            console.log('WE NEVER CLOSE!');
            ((operatingHours.open = timeKeeper.techHours.start), (operatingHours.close = timeKeeper.techHours.finish));
        } else {
            console.log('WE CLOSE!')
            operatingHours.open = HandleTime.getHours(timeKeeper.currentDate, hours[today].opening),
                operatingHours.close = HandleTime.getHours(timeKeeper.currentDate, hours[today].closing)
        }

        console.log(operatingHours.open.toString())
        console.log(operatingHours.close.toString())

        const openCloseHours = {
            open: this.getCurrentHours(timeKeeper.techHours.start, operatingHours.open, timeKeeper),
            close: this.getCurrentHours(timeKeeper.techHours.finish, operatingHours.close, timeKeeper)
        }
        console.log(openCloseHours.open.toString())
        console.log(openCloseHours.close.toString())
        console.log(timeKeeper.currentDate.toString())
        switch (true) {
            case timeKeeper.currentDate < openCloseHours.open || timeKeeper.currentDate > openCloseHours.close:
                console.log('Outside of Hours!')
                return this.handleOutsideHours(hours, openCloseHours, timeKeeper)
                break
            default:
                console.log('inside of hours!');
                if (timeKeeper.failsafe === false) {
                    console.log('failsafe has not been tripped');
                    if (timeKeeper.isCalculated === false) {
                        console.log('Not Calculated!');
                        this.calculate(timeKeeper);
                        return this.checkDay(hours, timeKeeper);
                    } else {
                        console.log('Calculated!');
                    }
                } else {
                    console.log('failsafe has been tripped!');
                    if (timeKeeper.isCalculated === true) {
                        console.log('Calculated!')
                        // changing time difference into luxon diff helper function
                        timeKeeper.timeDifference = this.getTimeDifference(timeKeeper.currentDate, openCloseHours.close, timeKeeper)
                        // timeKeeper.timeDifference = timeKeeper.currentDate.hour * 60 + timeKeeper.currentDate.minute - (openCloseHours.close.hour * 60 + openCloseHours.close.minute)
                        console.log(timeKeeper.timeDifference)
                    }
                    else {
                        console.log('Was not calculated!')
                        const hoursPlusSLA = timeKeeper.currentDate.plus({ hours: timeKeeper.slaTime })
                        console.log(`Date: ${timeKeeper.currentDate.toString()}, date plus sla: ${hoursPlusSLA.toString()}`)
                        console.log(hoursPlusSLA)
                        const closingHours = timeKeeper.currentDate.set(openCloseHours.close)

                        timeKeeper.currentDate = timeKeeper.slaTime <= 8 && hoursPlusSLA <= closingHours ? hoursPlusSLA : closingHours;

                        //   console.log(timeKeeper.currentDate.toString())
                    }
                }
                console.log(timeKeeper.currentDate.toString());
                console.log(timeKeeper);
                return timeKeeper;
        }
    }

    static handleOutsideHours(hours, openCloseHours, timeKeeper) {
        if (timeKeeper.failsafe === true) {
            console.log('The fail safe has been tripped!');
        }
        switch (true) {
            case timeKeeper.currentDate < openCloseHours.open:
                console.log('Before Hours!')

                timeKeeper.currentDate = timeKeeper.currentDate.set({
                    hour: openCloseHours.open.hour,
                    minute: openCloseHours.open.minute,
                });

                console.log(`Failesafe SLA: ${timeKeeper.failsafeSLA.toString()}`);
                console.log(`Current hours set to: ${timeKeeper.currentDate.toString()}`);
                if (timeKeeper.currentDate >= timeKeeper.failsafeSLA) {
                    console.log('The failSafe has been tripped! Setting the time to the opening hours!');
                    // return
                    return this.checkDay(hours, timeKeeper);
                } else {
                    return timeKeeper.isCalculated === false
                        ? (console.log('not Calculated!'),
                            (timeKeeper.currentDate = timeKeeper.currentDate.set({
                                hour: openCloseHours.open.hour,
                                minute: openCloseHours.open.minute,
                            })),
                            this.checkDay(hours, timeKeeper))
                        : (console.log('Calculated!'),
                            console.log(timeKeeper.timeDifference),
                            console.log(openCloseHours.open.hour.toString()),
                            console.log(openCloseHours.open.minute.toString()),
                            (timeKeeper.currentDate = timeKeeper.currentDate.set({
                                hour: openCloseHours.open.hour + Math.floor(timeKeeper.timeDifference / 60),
                                minute: openCloseHours.open.minute + (timeKeeper.timeDifference % 60)
                            })),
                            this.checkDay(hours, timeKeeper))

                }
                break;

            default:
                console.log('after hours!');
                if (timeKeeper.isCalculated === true) {
                    // changing time difference into luxon diff helper function
                    timeKeeper.timeDifference = this.getTimeDifference(timeKeeper.currentDate, openCloseHours.close, timeKeeper)
                    // timeKeeper.timeDifference = timeKeeper.currentDate.hour * 60 + timeKeeper.currentDate.minute - (openCloseHours.close.hour * 60 + openCloseHours.close.minute)
                    console.log(timeKeeper.timeDifference)
                }
                openCloseHours
                timeKeeper.currentDate = timeKeeper.currentDate.plus({ days: 1 }).startOf('day')
                return this.checkDay(hours, timeKeeper)
        }
    }

    static calculate(timeKeeper) {
        console.log('Calculating...')
        console.log(`current Date: ${timeKeeper.currentDate.toString()}`)
        timeKeeper.currentDate = timeKeeper.currentDate.plus({ hours: timeKeeper.slaTime })
        timeKeeper.isCalculated = true
        console.log('Calculated!')
        console.log(`New date: ${timeKeeper.currentDate.toString()}`)
        return timeKeeper
    }

    static getTimeDifference(currentDate, closingTime, timeKeeper) {
        timeKeeper.timeDifference = currentDate.diff(closingTime, 'minutes')
        timeKeeper.timeDifference = Math.floor(timeKeeper.timeDifference.minutes)
        return timeKeeper.timeDifference
    }

    static getCurrentHours(techTime, operatingTime, timeKeeper) {
        let currentHours;
        const startFinish = techTime === timeKeeper.techHours.start;

        switch (startFinish) {
            case true:
                console.log('Start time!');
                switch (true) {

                    case techTime.hour > operatingTime.hour:
                        console.log('Tech start is later!');
                        currentHours = techTime;
                        break;
                    case techTime.hour <= operatingTime.hour:
                        console.log('opening is later!');
                        currentHours = operatingTime;
                        break;

                    case techTime > operatingTime:
                }
                break;
            case false:
                console.log('finish time!');
                switch (true) {

                    case operatingTime.hour > 0 && operatingTime.hour <= timeKeeper.techHours.start.hour:
                        console.log('hours are after midnight but before or equal to techTime!');
                        break;
                    case techTime.hour <= operatingTime.hour:
                        console.log('Tech finish ealier!');
                        console.log(operatingTime.hour)
                        console.log(techTime.hour)
                        console.log(timeKeeper.currentDate.toString())
                        currentHours = techTime;
                        console.log(currentHours.toString())
                        break;
                    case techTime.hour >= operatingTime.hour:
                        console.log('closing earlier!');
                        currentHours = operatingTime;
                        break;
                    case operatingTime > 0 && operatingTime <= timeKeeper.techHours.start:
                        console.log('hours are after midnight but before or equal to techTime!')
                        currentHours = techTime
                        break
                    case techTime <= operatingTime:
                        console.log('Tech finish ealier!')
                        currentHours = techTime
                        break
                    case techTime >= operatingTime:
                        console.log('closing earlier!')
                        currentHours = operatingTime
                        break
                    default:
                        currentHours = techTime;
                }
                break;
        }
        return currentHours;
    }

    static callCalculation(initialDate, selectedProvider, selectedSLA, hours) {
        const timeKeeper = this.initialise({ initialDate, selectedProvider, selectedSLA });
        timeKeeper.techHours = this.updateTechHours(timeKeeper.currentDate, timeKeeper.techHours)
        return this.checkDay(hours, timeKeeper);
    }
    static errors = [
        {
            code: 'LOOP_FAILURE',
            name: 'CALCULATION FAILURE!',
            message: 'Please copy down the hours you have entered and report it to the developer for testing.',
        },
    ];
}

export { Calculation };
