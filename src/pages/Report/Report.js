import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from 'pages/Report/GeoPage-submenu.js'
import Overview from "./Overview";
//import GraphLayout from 'pages/Analysis/GraphLayout'
const GRAPH_CONFIG = require('pages/Report/graphConfig')

class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            graphConfig:[]
        }
    }

    componentWillMount(){
        this.setState({
            graphConfig: GRAPH_CONFIG
        })
    }

    render(){
        let geoid = this.props.match.params.geoid ?
            this.props.match.params.geoid
            :36001;

        this.state.graphConfig.overview.map(function(config){
            config['geoid'] = [geoid]
        })

        this.state.graphConfig.socialWelfare.map(function(config){
            config['geoid'] = [geoid]
        })

        this.state.graphConfig.education.map(function(config){
            config['geoid'] = [geoid]
        })

        this.state.graphConfig.housing.map(function(config){
            config['geoid'] = [geoid]
        })


        return (
        <div>
        <div>
        <h1 align='center'> Overview </h1>
        <br/>
        <GridLayout
        sideWidth={800}
        minifiedWidth={1}
        isOpen={1}
        title={''}
        viewing={false}
        graphs={this.state.graphConfig.overview}
        onOpenOrClose={function noop() {}}
        onLayoutChange={ this.props.onLayoutChange }
        verticalCompact={false}
        />
        </div>
        <div>
        <h1 align='center'> Social Welfare </h1>
        <br/>
        <GridLayout
        sideWidth={1000}
        minifiedWidth={1}
        isOpen={1}
        title={''}
        viewing={false}
        graphs={this.state.graphConfig.socialWelfare}
        onOpenOrClose={function noop() {}}
        onLayoutChange={ this.props.onLayoutChange }
        verticalCompact={false}
        />
        </div>
        <div>
        <h1 align='center'> Education </h1>
            <br/>
            <GridLayout
        sideWidth={1000}
        minifiedWidth={1}
        isOpen={1}
        title={''}
        viewing={false}
        graphs={this.state.graphConfig.education}
        onOpenOrClose={function noop() {}}
        onLayoutChange={ this.props.onLayoutChange }
        verticalCompact={false}
        />
        </div>
        <div>
        <h1 align='center'> Housing </h1>
            <br/>
            <GridLayout
        sideWidth={1000}
        minifiedWidth={1}
        isOpen={1}
        title={''}
        viewing={false}
        graphs={this.state.graphConfig.housing}
        onOpenOrClose={function noop() {}}
        onLayoutChange={ this.props.onLayoutChange }
        verticalCompact={false}
        />
        </div>
        </div>

    )
    }

    static defaultProps = {
        width:[],
        height:[]
    }

}

const mapStateToProps = state => {
    return {
        geoGraph: state.graph.geo,
        router: state.router
    };
};

const mapDispatchToProps = {};

export default
{
    path: '/report/:geoid',
    name: 'Report',
    mainNav: false,
    breadcrumbs: [
        {param: 'geoid', path: '/report/'}
    ],
    menuSettings:
        {
            image: 'none',
            scheme: 'color-scheme-dark',
            position: 'menu-position-left',
            layout: 'menu-layout-mini',
            style: 'color-style-default',
            subemenustyle: 'sub-menu-style-over'
        },
    subMenus: subMenus,
    auth: false,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Report))
}

/*

 */