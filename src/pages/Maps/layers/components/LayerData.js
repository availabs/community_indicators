import React from "react"

import AvlTable from "components/AvlStuff/AvlTable"

import get from "lodash.get"

export default ({ layer }) => {
  const data = Object.keys(layer.geoData)
    .map(geoid => ({
      "geography": get(layer.falcorCache, ["geo", geoid, "name"], geoid),
      [layer.filters.census.value]: layer.geoData[geoid],
      geoid
    }));

  const keys = [
    "geography", "geoid", layer.filters.census.value
  ]
  return (
    <div>
      <AvlTable data={ data } keys={ keys }
        showHelp={ true }
        title={ layer.filters.census.value }
        downloadedFileName={ layer.filters.census.value }/>
    </div>
  )
}
