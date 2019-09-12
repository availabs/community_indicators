import React from 'react';
import ACS_Layer from './layers/acsLayer.js'
import Logo from "components/mitigate-ny/Logo"

import AvlMap from "AvlMap"
import MapLayer from "AvlMap/MapLayer"

import buildingsLayer from "./layers/buildingsLayer"
import parcelLayer from "./layers/parcelLayer"
import threedLayer from "./layers/3d-buildingsLayer"
import censusLayer from "./layers/censusLayer.js"


const SidebarHeader = ({}) =>
  <div style={ { paddingLeft: "50px" } }><Logo width={ 200 }/></div>


const MapPage = ({}) =>
  <div style={ { height: 'calc(100vh - 45px)', marginTop:45 } }>
    <AvlMap layers={ [
        buildingsLayer,
        parcelLayer,
        threedLayer,
        ACS_Layer,
        censusLayer
      ] }
      header={ SidebarHeader }
      center={ [-73.8014, 42.6719] }
      minZoom={ 2 }
      zoom={ 8}/>
  </div>

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
