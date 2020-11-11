import React from "react"

import LayerData from "../components/LayerData"

export default ({ layer, type, geoData }) => {
  return (
    <div style={ { width: "100%", height: "100%" } }>
      <LayerData layer={ layer }/>
    </div>
  )
}
