import React from 'react'
//import WidthProvider from 'pages/auth/NetworkView/components/utils/WidthProvider'
import { WidthProvider, Responsive as ResponsiveGridLayout} from 'react-grid-layout'
import GraphFactory from './GraphFactory'
import TrackVisibility from 'react-on-screen';
//import _ from "lodash";

var _ = require('lodash');
const ReactGridLayout = WidthProvider(ResponsiveGridLayout);
const originalLayouts = {} //getFromLS("layouts") || {};

console.log('originalLayouts', originalLayouts)

const DEFAULT_LAYOUT = {
    h: 15,
    w: 10,
    maxH: 20,
    maxW: 12,
    minH: 2,
    minW: 2,
    static: false,
    x: 0,
    y: 0
}
const getDefaultLayout = i => ({ ...DEFAULT_LAYOUT, i: i.toString() });

class GridLayout extends React.Component {

    constructor(props){
        super(props);

        //const layout = this.generateLayout();
        this.state = { layouts: JSON.parse(JSON.stringify(originalLayouts)) };

        this.onLayoutChange = this.onLayoutChange.bind(this)
    }

    onLayoutChange(layout, layouts) {
        if (layouts.lg !== undefined){
            layouts.lg.forEach(function(layout){
                delete layout.isDraggable;
                delete layout.isResizable;
                delete layout.moved;
                delete layout.minH;
                delete layout.minW;
                delete layout.maxH;
                delete layout.maxW;
            })

        }
        this.props.graphs.map(function(graph,i){
            //console.log('test 123',layout, layouts)
            if (layouts.lg !== undefined){
                graph['layout'] = layouts.lg[i]
            }

        })
        //console.log(this.props.section,JSON.stringify(this.props.graphs))
        this.setState({ layouts : layouts });


    }


    loadComps() {
        const {graphs,viewing, ...rest } = this.props;
        return graphs.map((graph, i) => {
            let layout = { ...getDefaultLayout(graph.id) };
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
                    className=''
                    style={ {
                        backgroundColor: 'none',
                        border: '1px dashed rgba(0, 0, 0, 0.25)',
                        zIndex: 100,
                        height: '100%'
                    }}>
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


    render() {
        return (
            <div className='container'>
                <ReactGridLayout
                    rowHeight={ 30 }
                    cols={{ lg: 12, md: 12, sm: 6, xs: 6, xxs: 6 }}
                    layouts = {this.state.layouts}
                    onLayoutChange={(layout, layouts) =>
                        this.onLayoutChange(layout, layouts)
                    }
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
        isVisible:true,
        cols: { lg: 12, md: 12, sm: 6, xs: 6, xxs: 6 }
    };
}
export default GridLayout

function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
        } catch (e) {
            /*Ignore*/
        }
    }
    return ls[key];
}