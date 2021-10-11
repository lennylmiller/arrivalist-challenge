import {action, observable, computed} from 'mobx'
import * as api from '@arrivalist/api'
import { subtractMonths } from '../../utils/dates'
import {
  between,
  appendTimeToDate,
  shortDateTime
} from './utils'
import {
  sum,
  nest,
  mean,
} from 'd3'

class Analyzer {

  _loadPromise

  @observable period = 'all'
  @observable isBusy = true
  @observable dataIndex = 0
  @observable stateList = []
  @observable dataPoints
  @observable originState = 'OR'
  @observable selectedStates = ['OR']
  @observable selectedPeriods = ['all']
  @observable mapChartTooltip
  @observable extentsDateRange = []
  @observable selectedDateRange = []

  constructor() {
    // TODO: seed this with the zero'th element of the source Data
    const startDate = new Date('2019-12-08T08:00:00.000Z')
    const endDate = new Date('2020-09-30T07:00:00.000Z')

    this.extentsDateRange.push(startDate)
    this.extentsDateRange.push(endDate)
    this.selectedDateRange.push(subtractMonths(endDate, 1))
    this.selectedDateRange.push(endDate)
  }

  @computed get startDate() {
    return this.selectedDateRange[0]
  }

  @computed get endDate() {
    return this.selectedDateRange[1]
  }

  @computed get selectedData() {
    return this.dataPoints
      .filter(item => {
        return between(item.trip_date, this.startDate, this.endDate)
      })
  }

  @computed get selectedDataByState() {
    return this.selectedData
      .filter(item => item.home_state === this.originState)
  }

  @computed get byState() {
    return nest()
      .key(tripEvent => tripEvent.home_state)
      .key(tripEvent => tripEvent.trip_date)
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.selectedDataByState)
      .reduce((results, item) => {
        results[item.key] = item.values
        return results
      }, {})
  }

  @computed get lineChartData() {
    return this.selectedStates.map(state => {
      return this.byState[state]
    })
  }

  @computed get extentsStartDate() {
    return this.extentsDateRange[0]
  }

  @computed get extentsEndDate() {
    return this.extentsDateRange[1]
  }

  @computed get extentsData() {
    return this.dataPoints
      .filter(item => {
        return between(item.trip_date, this.extentsStartDate, this.extentsEndDate)
      })
  }

  @computed get extentsDataByState() {
    return this.extentsData
      .filter(item => item.home_state === this.originState)
  }

  @computed get byExtents() {
    let byExtents = nest()
      .key(tripEvent => tripEvent.home_state)
      .key(tripEvent => tripEvent.trip_date)
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.extentsDataByState)
      .reduce((results, item) => {
        results[item.key] = item.values
        return results
      }, {})


    const state = this.selectedStates[0]
    const items  =  byExtents[state].map(item => {
      return {
        key: new Date(item.key),
        value: item.value
      }
    })

    byExtents[state] = items


    console.log('byExtents', byExtents)

    return byExtents
  }

  @computed get lineChartExtentsData() {
    return this.selectedStates.map(state => {
      return this.byExtents[state]
    })
  }

  @computed get mapChartData() {
    return nest()
      .key(d => d.home_state)
      .rollup(v => {
        return {
          count: v.length,
          sum: sum(v, d => d.trip_count),
          avg: mean(v, d => d.trip_count)
        }
      })
      .entries(this.selectedData)
      .reduce((results, item) => {
        results[item.key] = item.value
        return results
      }, {})
  }

  @action load = ({force = false} = {}) => {
    if (!this._loadPromise || force) {
      this._loadPromise = api.getAllTripEvents()
        .then(action(response => {
          this.dataPoints = response.map(tripEvent => this._transform(tripEvent))
          this.stateList = this._getEmbeddedStates()
          this.isBusy = false
        }))
    }

    return this._loadPromise
  }

  @action setMapChartTooltip = tooltip => {
    this.mapChartTooltip = tooltip
  }

  @action setOriginState = state => {
    this.selectedStates.length = 0
    this.selectedStates.push(state)
    this.originState = state
  }

  @action setStartDate = date => {
    this.period = 'all'
    this.selectedDateRange[0] = date
  }

  @action setEndDate = date => {
    this.period = 'all'
    this.selectedDateRange[1] = date
  }

  @action setPeriod = period => {
    this.selectedPeriods.length = 0
    this.period = period

    // Get the range
    const {startDate, endDate} = this._getPeriodRange(period)

    // Set the plot range of the data
    this.extentsDateRange[0] = subtractMonths(this.endDate, 1)
    this.extentsDateRange[1] = this.endDate

    // Set the selected range
    this.selectedDateRange[0] = startDate
    this.selectedDateRange[1] = endDate

    // TODO: Placeholder/hint of the direction I want to go to fix the multi-line lineChart
    switch (period) {
      case 'all':
        this.dataIndex = 0
        // 12/08/2019 - 09/31/2020
        this.selectedPeriods.push('all')
        break
      case '2019':
        this.dataIndex = 0
        // 01/01/2019 - 12/31/2019
        this.selectedPeriods.push('2019')
        break
      case '2020':
        this.dataIndex = 0
        // 01/01/2020 - 12/31/2020
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

  @action selectDateRange = dateRange => {
    this.selectedDateRange = dateRange
  }

  _transform = tripEvent => {
    const trip_date = new Date(appendTimeToDate(tripEvent.trip_date))

    return {
      id: tripEvent.id,
      trip_date,
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

    const states = []

    for (let state in statesGroup) {
      states.push(state)
    }

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
  @computed get byYear() {
    return nest()
      .key(tripEvent => tripEvent.trip_date.getFullYear())
      .key(tripEvent => shortDateTime(tripEvent.trip_date))
      .key(tripEvent => tripEvent.home_state === this.originState ? tripEvent.home_state : '')
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.selectedDataByState)
  }

  @computed get byDate() {
    return nest()
      .key(tripEvent => shortDateTime(tripEvent.trip_date))
      .key(tripEvent => tripEvent.home_state)
      .rollup(values => sum(values, tripEvent => tripEvent.trip_count))
      .entries(this.selectedDataByState)
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

}

export default Analyzer
