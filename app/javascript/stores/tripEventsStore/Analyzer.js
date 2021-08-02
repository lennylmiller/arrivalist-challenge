import {action, observable, computed} from 'mobx'
import * as api from '@arrivalist/api'
import {
  between,
  appendTimeToDate,
  shortDateTime
} from './utils'
import {
  sum,
  nest,
} from 'd3'

class Analyzer {

  _loadPromise

  @observable selectedStates = ['OR']
  @observable selectedPeriods = ['all']
  @observable isBusy = true
  @observable dataPoints
  @observable originState = 'OR'
  @observable clampStartDate = new Date('2019-12-08T08:00:00.000Z')
  @observable clampEndDate = new Date('2020-09-30T07:00:00.000Z')
  @observable startDate = new Date('2019-12-08T08:00:00.000Z')
  @observable endDate = new Date('2020-09-30T07:00:00.000Z')
  @observable period = 'all'
  @observable dataIndex = 0
  @observable stateList = []

  @computed get lineChartData() {
    return this.selectedStates.map(state => {
      return this.byState[state]
    })
  }

  @computed get mapChartData() {
    /*
    * Each state
    *
    *
    *  */


    const key = shortDateTime(this.startDate)
    // console.log('key', key)
    // console.log('this.byDate', this.byDate)
    return this.byDate[key]
  }

  @computed get byYear() {
    return nest()
      .key(tripEvent => tripEvent.trip_date.getFullYear())
      .key(tripEvent => shortDateTime(tripEvent.trip_date))
      .key(tripEvent => tripEvent.home_state === this.originState ? tripEvent.home_state : '')
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.stateDateRangeFiltered)
  }

  @computed get dateRangeFiltered() {
    return this.dataPoints
      .filter(item => {
        return between(item.trip_date, this.startDate, this.endDate)
      })
  }

  @computed get stateDateRangeFiltered() {
    return this.dateRangeFiltered
      .filter(item => item.home_state === this.originState)
  }

  @action load = ({force = false} = {}) => {
    if (!this._loadPromise || force) {
      this._loadPromise = api
        .getAllTripEvents()
        .then(action(response => {
          this.dataPoints = response
            .map(tripEvent => this._transform(tripEvent))
          this.stateList = this._getEmbeddedStates()
          this.isBusy = false
        }))
    }

    return this._loadPromise
  }

  @action setOriginState(state) {
    this.selectedStates.length = 0
    this.selectedStates.push(state)
    this.originState = state
  }

  @action setStartDate(date) {
    this.period = 'all'
    this.startDate = date
  }

  @action setEndDate(date) {
    this.period = 'all'
    this.startDate = date
  }

  @action setPeriod(period) {
    this.selectedPeriods.length = 0
    this.period = period

    const {startDate, endDate} = this._getPeriodRange(period)
    this.startDate = startDate
    this.endDate = endDate

    // TODO: Placeholder/hint of the direction I want to go to fix the multi-line lineChart
    switch (period) {
      case 'all':
        this.dataIndex = 0
        this.selectedPeriods.push('all')
        break
      case '2019':
        this.dataIndex = 0
        this.selectedPeriods.push('2019')
        break
      case '2020':
        this.dataIndex = 0
        this.selectedPeriods.push('2020')
        break
      case '2019VS2020':
        this.dataIndex = 0
        this.selectedPeriods.push('2019')
        this.selectedPeriods.push('2020')
        break
      default:
        this.dataIndex = 0
    }
  }

  _transform = tripEvent => {
    return {
      id: tripEvent.id,
      trip_date: appendTimeToDate(tripEvent.trip_date),
      home_state: tripEvent.home_state,
      trip_count: tripEvent.trip_count
    }
  }

  _getFirstAndLast = array => {
    let startDate = array[0].trip_date
    let endDate = array[array.length - 1].trip_date

    return {
      startDate,
      endDate
    }
  }

  _getEmbeddedStates = () => {
    // Group by state
    const statesGroup = nest()
      .key(tripEvent => tripEvent.home_state)
      .key(tripEvent => shortDateTime(tripEvent.trip_date))
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.dataPoints)
      .reduce((results, item) => {
        results[item.key] = item.values
        return results
      }, {})

    // const statesGroup = group()
    //   .key(tripEvent => tripEvent.home_state)
    //   .key(tripEvent => shortDateTime(tripEvent.trip_date))
    //   .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
    //   .entries(this.dataPoints)
    //   .reduce((results, item) => {
    //     results[item.key] = item.values
    //     return results
    //   }, {})

    const states = []

    for (let state in statesGroup) {
      states.push(state)
    }
    // console.log('initialize states', states)
    return states
  }

  _getPeriodRange = period => {
    let year = 2019
    let dataWithinRange = this.dataPoints
    if (!['all', '2019VS2020'].includes(period)) {
      year = parseInt(period)
      dataWithinRange = this.dataPoints.filter(item => {
        return item.trip_date.getFullYear() === year
      })
    }

    return this._getFirstAndLast(dataWithinRange)
  }


  // Wall of Shame
  @computed get byDate() {
    return nest()
      .key(tripEvent => shortDateTime(tripEvent.trip_date))
      .key(tripEvent => tripEvent.home_state)
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.stateDateRangeFiltered)
      .reduce((results, item) => {
        results[item.key] = item.values.reduce((values, item) => {
          values[item.key] = item.value
          return values
        }, {})
        return results
      }, {})
  }

  @computed get timesByState() {
    return this.byState[this.originState]
  }

  @computed get byState() {
    return nest()
      .key(tripEvent => tripEvent.home_state)
      .key(tripEvent => shortDateTime(tripEvent.trip_date))
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.stateDateRangeFiltered)
      .reduce((results, item) => {
        results[item.key] = item.values
        return results
      }, {})
  }
}

export default Analyzer
