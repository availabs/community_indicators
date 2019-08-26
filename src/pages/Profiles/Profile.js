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
        this.renderCategory = this.renderCategory.bind(this)
    }

    renderCategory(name, configData) {
        return (
            <div className='content-box'>
                <div className='element-wrapper'>
                    <h4 className='element-header'> {name.toUpperCase()} </h4>
                    <div classname='element-content'>
                        <GridLayout
                            sideWidth={800}
                            minifiedWidth={1}
                            isOpen={1}
                            title={''}
                            viewing={false}
                            graphs={configData}
                            onOpenOrClose={function noop() {}}
                            onLayoutChange={ this.props.onLayoutChange }
                            verticalCompact={false}
                        />
                    </div>
                </div>
            </div>

        )
    }

    render(){
       

        let categories = Object.keys(GRAPH_CONFIG).map(category => {
            GRAPH_CONFIG[category].forEach(config => {
                config['geoid'] = [this.props.geoid]
            })

            return this.renderCategory(category, GRAPH_CONFIG[category])

        })



        return (
            <div>
                <ProfileHeader geoids={[this.props.geoid]} />
                <div style={{ width: '100%', backgroundColor: '#293145', marginTop: '90vh', position: 'relative', zIndex: 4}}>
                    <div className='container'>
                        {categories}
                    </div>
                </div>
            </div>

    )
    }

    static defaultProps = {
        width:[],
        height:[],
        geoid: '36001'
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        geoid: ownProps.match.params.geoid
            ? ownProps.match.params.geoid
            : 36001
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