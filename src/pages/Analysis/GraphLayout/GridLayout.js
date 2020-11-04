import React from 'react'

import { WidthProvider, Responsive } from 'react-grid-layout'
import GraphFactory from './GraphFactory'

import "./graph.css"

const ReactGridLayout = WidthProvider(Responsive);

class GridLayout extends React.Component {
    loadComps() {
      const { graphs, geoid, compareGeoid, geoids, ...props } = this.props;
      return graphs.map(({ layout, id, showBorder = true, ...rest }) => {
        const newLayout = {
          x: layout.x,
          y: layout.y,
          w: layout.w,
          h: layout.h,
          i: id,
          static: true
        }
        return (
          <div key={ id } className="ci-graph"
            data-grid={ newLayout }
            style={ {
              backgroundColor: 'none',
              boxShadow: showBorder ? '-1px -1px 2px 0 rgba(0, 0, 0, 0.1), 2px 2px 4px 0 rgba(0, 0, 0, 0.2)' : null,
              borderRadius: "4px",
              zIndex: 100,
              height: '100%'
            } }>
            <GraphFactory
              layout={ newLayout }
              { ...props } { ...rest }
              geoid={ [geoid] }
              geoids={ geoids ? geoids : [geoid] }
              compareGeoid={ compareGeoid }
              id={ id }/>
          </div>
        )
      })
    }

    render() {
      return (
        <ReactGridLayout rowHeight={ 30 } isDraggable={ false } isResizable={ false }
          breakpoints={ { lg: 1280, md: 1190, sm: 960, xs: 720, xxs: 540 } }
          cols={ { lg: 12, md: 12, sm: 12, xs: 12, xxs: 3 } }
          containerPadding={ [0, 10] } resizeHandle={ () => null }>

          { this.loadComps() }

        </ReactGridLayout>
      )
    }
}
export default GridLayout
