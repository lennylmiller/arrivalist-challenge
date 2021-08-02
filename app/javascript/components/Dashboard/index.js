import React from 'react'
import {withRouter} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import SpinnerPanel from '@arrivalist/common/SpinnerPanel'
import withStyles from '@material-ui/core/styles/withStyles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MapChart from './MapChart'
import LineChart from './LineChart'
import {KeyboardDatePicker} from '@material-ui/pickers'
import ReactTooltip from 'react-tooltip'

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1)
  },
  formControl: {
    minWidth: 100
  },

  formControlDate: {
    marginTop: 0,
    marginLeft: theme.spacing(2),
  },
  originState: {
    minWidth: 100,
    marginTop: theme.spacing(2),
    marginRight: 30,
    [theme.breakpoints.only('xs')]: {
      marginLeft: 20
    }
  },
  startDate: {
    maxWidth: 144,
    [theme.breakpoints.only('xs')]: {
      marginLeft: theme.spacing(0.3)
    }
  },
  endDate: {
    maxWidth: 144,
    [theme.breakpoints.only('xs')]: {
      marginLeft: theme.spacing(0.3)
    }
  },
  period: {
    minWidth: 172,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  lineChart: {
    display: 'flex'
  },
  filterControls: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

@withRouter
@inject('contextStore', 'tripEventsStore')
@withStyles(styles, {withTheme: true})
@observer
class Dashboard extends React.Component {

  _analyzer

  constructor(props) {
    super(props)
    const {contextStore, tripEventsStore} = props
    this._analyzer = tripEventsStore.getAnalyzer()
    this._analyzer
      .load()
      .catch(contextStore.handleRejection)
  }

  render() {
    const {
      classes
    } = this.props

    if (this._analyzer.isBusy) {
      return <SpinnerPanel/>
    }

    return (
      <div className={classes.root}>
        <div className={classes.filterControls}>
          <FormControl className={classes.originState}>
            <InputLabel id="originState">Origin State </InputLabel>
            <Select
              labelId="originState"
              id="originState"
              value={this._analyzer.originState}
              onChange={e => {
                this._analyzer.setOriginState(e.target.value)
              }}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this._analyzer.stateList.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.startDate}>
            <KeyboardDatePicker
              autoOk="true"
              margin="normal"
              id="startDate-picker-dialog"
              label="Start Date"
              format="MM/DD/yyyy"
              value={this._analyzer.startDate}
              onChange={moment => {
                this._analyzer.setStartDate(moment.toDate())
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </FormControl>
          <FormControl className={classes.endDate}>
            <KeyboardDatePicker
              autoOk="true"
              margin="normal"
              id="endDate-picker-dialog"
              label="End Date"
              format="MM/DD/yyyy"
              value={this._analyzer.endDate}
              onChange={moment => {
                this._analyzer.setEndDate(moment.toDate())
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </FormControl>
          <FormControl className={classes.period}>
            <InputLabel id="period">Period</InputLabel>
            <Select
              labelId="period"
              onChange={e => {
                this._analyzer.setPeriod(e.target.value)
              }}
              id="period"
              value={this._analyzer.period}>
              <MenuItem value="all">
                <em>Using Date Selectors</em>
              </MenuItem>
              <MenuItem value="2019">
                <em>2019</em>
              </MenuItem>
              <MenuItem value="2020">
                <em>2020</em>
              </MenuItem>
              <MenuItem value="2019VS2020">
                <em>2019 vs 2020</em>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <LineChart
          data={this._analyzer.lineChartData}
          dataIndex={this._analyzer.dataIndex}
          selectedYears={this._analyzer.selectedYears}/>
        <MapChart
          mapChartData={this._analyzer.mapChartData}
          originState={this._analyzer.originState}
          setTooltipContent={this._analyzer.setMapChartTooltip}/>
        <ReactTooltip>this._analyzer.mapChartTooltip</ReactTooltip>
      </div>
    )
  }
}

export default Dashboard
