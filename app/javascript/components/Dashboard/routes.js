import React from 'react'
import InsertChart from '@material-ui/icons/InsertChart'
import Dashboard from './index'

export default () => [{
  path                    : '/',
  title                   : 'Analyzer',
  exact                   : true,
  titleHideable           : true,
  excludeFromNav          : false,
  heightCalculationMethod : 'taggedElement',
  icon                    : <InsertChart />,
  main                    : () => <Dashboard />
}]
