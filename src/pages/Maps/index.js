import React from 'react';
import Logo from "components/mitigate-ny/Logo"

import AvlMap from "AvlMap"

import buildingsLayer from "./layers/buildingsLayer"
import parcelLayer from "./layers/parcelLayer"
import threedLayer from "./layers/3d-buildingsLayer"

import censusLayerFactory from "./layers/censusLayer.js"
// import acsLayerFactory from './layers/acsLayer.js'
import acsLayerFactory from "./layers/acsLayerNew"

import theme from "components/common/themes/light_new"

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
          theme={ theme }
          header={ SidebarHeader }
          { ...this.ACS_Layer.baseMapSettings }
          header={ false }/>
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
