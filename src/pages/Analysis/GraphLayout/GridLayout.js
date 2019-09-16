import React from 'react'

import { WidthProvider, Responsive } from 'react-grid-layout'
import GraphFactory from './GraphFactory'

const ReactGridLayout = WidthProvider(Responsive);

class GridLayout extends React.Component {
    loadComps() {
      const { graphs, ...rest } = this.props;
      return graphs.map(({ layout, id, ...rest }, i) => {
        const newLayout = {
          x: layout.x,
          y: layout.y,
          w: layout.w,
          h: layout.h,
          i: layout.i,
          static: true
        }
        return (
            <div key={ newLayout.i }
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
                        />
            </div>
        )
      })
    }

    render() {
      return (
        <div className='container'>
          <ReactGridLayout
            rowHeight={ 30 }
            cols={ { lg: 12, md: 12, sm: 6, xs: 6, xxs: 6 } }>

            { this.loadComps() }

          </ReactGridLayout>
        </div>
      )
    }
}
export default GridLayout
