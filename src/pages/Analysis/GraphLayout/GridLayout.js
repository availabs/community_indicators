import React from 'react'

import { WidthProvider, Responsive } from 'react-grid-layout'
import GraphFactory from './GraphFactory'

const ReactGridLayout = WidthProvider(Responsive);

class GridLayout extends React.Component {
    loadComps() {
      const { graphs, geoid, compareGeoid, geoids } = this.props;
      return graphs.map(({ layout, id, ...rest }, i) => {
        const newLayout = {
          x: layout.x,
          y: layout.y,
          w: layout.w,
          h: layout.h,
          i: id,
          static: true
        }
        return (
            <div key={ id }
                data-grid={ newLayout }
                style={ {
                    backgroundColor: 'none',
                    boxShadow: '-1px -1px 2px 0 rgba(0, 0, 0, 0.1), 2px 2px 4px 0 rgba(0, 0, 0, 0.2)',
                    borderRadius: "4px",
                    zIndex: 100,
                    height: '100%'
                }}>
                    <GraphFactory
                        graph={ rest }
                        layout={ newLayout }
                        { ...rest }
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
        <ReactGridLayout
          rowHeight={ 30 }
          breakpoints={ { lg: 1260, md: 1170, sm: 940, xs: 700, xxs: 520 } }
          cols={ { lg: 12, md: 12, sm: 6, xs: 3, xxs: 3 } }>

          { this.loadComps() }

        </ReactGridLayout>
      )
    }
}
export default GridLayout
