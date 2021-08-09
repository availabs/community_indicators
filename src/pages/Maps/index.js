import React from 'react';
import Logo from "components/mitigate-ny/Logo"

import { withRouter } from "react-router-dom"

import AvlMap, { DEFAULT_STYLES } from "AvlMap"

import buildingsLayer from "./layers/buildingsLayer"
import parcelLayer from "./layers/parcelLayer"
import threedLayer from "./layers/3d-buildingsLayer"

import censusLayerFactory from "./layers/censusLayer.js"
// import acsLayerFactory from './layers/acsLayer.js'
import acsLayerFactory from "./layers/acsLayerNew"

import bgPointsLayerFactory from "./layers/bg_points"

const SidebarHeader = ({}) =>
  <div style={ { paddingLeft: "50px" } }><Logo width={ 200 }/></div>

class MapPage extends React.Component {
  // CensusLayer = censusLayerFactory({ active: false });
  ACS_Layer = acsLayerFactory({ active: true, props: this.props });
  BG_Points = bgPointsLayerFactory({ active: false });
  render() {
    return (
      <div style={ { height: '100vh', paddingTop: "49px" } }>
        <AvlMap id="haz-mit-avl-map"
          preserveDrawingBuffer={ true }
          layers={ [this.BG_Points, this.ACS_Layer] }
          header={ SidebarHeader }
          { ...this.ACS_Layer.baseMapSettings }
          header={ false }
          style="mapbox://styles/am3081/ck3uimjaa0p6u1cqmndfy4nmr"
          sidebarPages={ ["layers"] }
          layerProps={ {
            [this.ACS_Layer.name]: {
              history: this.props.history
            }
          } }/>
      </div>
    )
  }
}

export default {
	icon: 'os-icon-map',
	path: '/map',
	exact: true,
	mainNav: true,
   menuSettings: {
        image: 'none',
        'scheme': 'color-scheme-dark',
        style: 'color-style-default'
    },
    name: 'Maps',
	auth: false,
	component: withRouter(MapPage)
}
