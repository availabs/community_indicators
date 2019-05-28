import React from 'react'
//import WidthProvider from 'pages/auth/NetworkView/components/utils/WidthProvider'
import { WidthProvider, Responsive as ResponsiveGridLayout} from 'react-grid-layout'
import GraphFactory from './GraphFactory'
import _ from "lodash";
const ReactGridLayout = WidthProvider(ResponsiveGridLayout);

const DEFAULT_LAYOUT = {
    h: 15,
    w: 10,
    maxH: 20,
    maxW: 12,
    minH: 5,
    minW: 2,
    static: false,
    x: 0,
    y: 0
}
const getDefaultLayout = i => ({ ...DEFAULT_LAYOUT, i: i.toString() });

class GridLayout extends React.Component {

    constructor(props){
        super(props);

        const layout = this.generateLayout();
        this.state = { layout };
    }
    loadComps() {
        const {graphs,viewing, ...rest } = this.props;
        return graphs.map((graph, i) => {
            let layout = { ...getDefaultLayout(graph.id) };
            console.log('layout',graph.layout)
            if (graph.layout) {
                layout = {
                    ...layout,
                    ...graph.layout,
                    i: graph.id
                };
            }
            if (viewing) {
                layout.static = true;
                delete layout.isDraggable;
                delete layout.isResizable;
            }
            return (
                <div key={ graph.id }
                data-grid={layout}
                style={ {
                    backgroundColor: 'none',
                    border: '1px dashed rgba(0, 0, 0, 0.25)',
                    zIndex: 100
                } }>

                <GraphFactory
                    viewing={ viewing }
                    graph={ graph }
                    index={ i }
                    { ...rest }
                    />
                </div>
        )
        })

    }

    generateLayout() {
        const p = this.props;
        return _.map(new Array(p.items), function(item, i) {
            const w = Math.ceil(Math.random() * 4);
            const y = Math.ceil(Math.random() * 4) + 1;
            return {
                x: (i * 2) % 12,
                y: Math.floor(i / 6) * y,
                w: w,
                h: y,
                i: i.toString()
            };
        });
    }



    render() {
        return (
            <div className='container'>
            <ReactGridLayout
                    rowHeight={ 30 }
                    breakpoints={ { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 } }
                    cols={ { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 } }
                    onLayoutChange={this.onLayoutChange}
                    >
                        {this.loadComps()}
            </ReactGridLayout>
            </div>
    )
    }


    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 30,
        onLayoutChange: function() {},
        cols: 12
    };
}
export default GridLayout

/*
layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
 */

/*

 */