import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from './submenu.js'
import ProfileHeader from './components/ProfileHeader'
//import GraphLayout from 'pages/Analysis/GraphLayout'
const GRAPH_CONFIG = require('./graphConfig')

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
        <ProfileHeader geoid={'36001'} />
        <div style={{ width: '100%', backgroundColor: '#293145', marginTop: '90vh', position: 'relative', zIndex: 4}}>
                <div className='container'>
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
    path: '/profile/:geoid',
    name: 'Report',
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-dark'},
    subMenus: subMenus,
    auth: false,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Report))
}

/*

 */