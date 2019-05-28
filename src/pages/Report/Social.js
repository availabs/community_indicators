import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from 'pages/SocialWelfare/SocialWelfare-submenu.js'
//import GraphLayout from 'pages/Analysis/GraphLayout'
const GRAPH_CONFIG = require('pages/Report/graphConfig.js')

class Social extends React.Component{
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
        this.state.graphConfig.socialWelfare.map(function(config){
            config['geoid'] = [geoid]
        })
        return (
            <div>
            <GridLayout
        sideWidth={800}
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

    path: '/social/:geoid',
    name: 'Social Welfare Report',
    mainNav: false,
    breadcrumbs: [
        {param: 'geoid', path: '/social/'}
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
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Social))
}