import React from 'react';
import Logo from "components/mitigate-ny/Logo"

import AvlMap from "AvlMap"

import buildingsLayer from "./layers/buildingsLayer"
import parcelLayer from "./layers/parcelLayer"
import threedLayer from "./layers/3d-buildingsLayer"

import censusLayerFactory from "./layers/censusLayer.js"
// import acsLayerFactory from './layers/acsLayer.js'
import acsLayerFactory from "./layers/acsLayerNew"

const SidebarHeader = ({}) =>
  <div style={ { paddingLeft: "50px" } }><Logo width={ 200 }/></div>

class MapPage extends React.Component {
  CensusLayer = censusLayerFactory({ active: false });
  ACS_Layer = acsLayerFactory({ active: true });
  render() {
    return (
      <div style={ { height: '100vh', paddingTop: "49px" } }>
        <AvlMap layers={ [
            this.ACS_Layer,
            this.CensusLayer
          ] }
          header={ SidebarHeader }
          center={ [-73.8014, 42.91] }
          minZoom={ 2 }
          zoom={ 7.75 }/>
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
	component: MapPage
}
