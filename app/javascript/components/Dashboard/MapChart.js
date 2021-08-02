import React from 'react'
import {makeStyles} from '@material-ui/core'
import {geoCentroid} from 'd3-geo'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from 'react-simple-maps'

import allStates from './data/allstates.json'

const useStyles = makeStyles((theme) => {
  return {
    root: {},
    mapChart: {
      position: 'relative',
      left: -67,
      top: -80
    },
    state: {
      fill: theme.palette.primary
    },
    selectedState: {
      fill: theme.palette.primary
    }
  }
})
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
}

const MapChart = ({originState, mapChartData, setTooltipContent}) => {
  const classes = useStyles()

  return (
    <div className={classes.mapChart}>
      <ComposableMap projection="geoAlbersUsa" projectionConfig={{scale: 980,}}>
        <Geographies geography={geoUrl}>
          {({geographies}) => (
            <>
              {geographies.map(geo => {
                const cur = allStates.find(s => s.val === geo.id)
                const isSelected = cur.id === originState
                // TODO: pass in theme from above and replace fill
                return (
                  <Geography
                    key={geo.rsmKey}
                    stroke="#FFF"
                    geography={geo}
                    fill={isSelected ? '#F00' : '#DDD'}
                    onMouseEnter={() => {
                      const {name} = geo.properties
                      const {sum, avg} = mapChartData[cur.id]
                      setTooltipContent(`${name} — Avg:${avg} & Sum:${sum}`)
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('')
                    }}
                    satyle={{
                      default: {
                        fill: "#D6D6DA",
                        outline: "none"
                      },
                      hover: {
                        fill: "#F53",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none"
                      }
                    }}
                  />
                )
              })}
              {geographies.map(geo => {
                const centroid = geoCentroid(geo)
                const cur = allStates.find(s => s.val === geo.id)

                return (
                  <g key={geo.rsmKey + '-name'}>
                    {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <text y="2" fontSize={10} textAnchor="middle">
                          <tspan className="em" y="0">{cur.id}</tspan>
                          <tspan className="strong em" x="-0.1cm"
                                 y="0.4cm">{_validateValuesByDate(cur, mapChartData)}</tspan>
                        </text>
                      </Marker>
                    ) : (
                      <Annotation
                        subject={centroid}
                        dx={offsets[cur.id][0]}
                        dy={offsets[cur.id][1]}
                      >
                        <text x={4} fontSize={10} alignmentBaseline="middle">
                          {cur.id}&nbsp;-&nbsp;
                          {mapChartData ? mapChartData[cur.id].sum : ''}
                        </text>
                      </Annotation>
                    ))}
                  </g>
                )
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  )
}

const _formatCount = num => {
  return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

const _validateValuesByDate = (cur, mapChartData) => {
  if (mapChartData) {
    return mapChartData ? mapChartData[cur.id].sum : ''
  }

  return ''
}
const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn"
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M"
  } else {
    return Math.round(num / 100) / 10 + "K"
  }
}

export default MapChart
