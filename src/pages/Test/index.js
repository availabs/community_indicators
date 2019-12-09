import React from "react"

import AvlMap from "AvlMap"
import MapLayer from "AvlMap/MapLayer"

class TestPage extends React.Component {
  testLayer = new MapLayer("Test Layer", {
    active: true,
    modals: {
      test: {
        title: "Test",
        comp: ({ layer }) => (
          <div style={ { width: "100%", height: "100%" } }>
            <iframe src="http://localhost:3000/share/embed?type=%22CensusMap%22&title=%22Population%22&geoids=%5B%2236001%22%5D&censusKeys=%5B%22B01003_001E%22%5D&divisorKeys=%5B%5D&format=%22,d%22&year=2017" width="810" height="480" style={ { border: "2px solid #ccc", borderRadius: "4px" } }/>
          </div>
        ),
        show: false,
        position: "bottom"
      }
    },
    mapActions: {
      toggle: {
        Icon: () => <span className="fa fa-car"/>,
        tooltip: "Toggle",
        action: ["toggleModal", "test"]
      }
    },
    layers: [
      {
        id: "blockgroup",
        source: "blockgroup",
        'source-layer': "blockgroups",
        'type': 'fill',
        filter : ['in', 'geoid', 'none']
      },
    ],
    sources: [
      {
        id: "blockgroup",
        source: {
            'type': "vector",
            'url': 'mapbox://am3081.52dbm7po'
        }
      }
    ]
  })
  render() {
    return (
      <div style={ { width: "100%", height: "100vh" } }>
        <AvlMap layers={ [this.testLayer] }/>
      </div>
    )
  }
}

export default [
  {
    path: '/test',
    exact: true,
    name: 'Test',
    mainNav: false,
    menuSettings: {
      display: 'none'
    },
    auth: false,
    component: TestPage
  }
]
