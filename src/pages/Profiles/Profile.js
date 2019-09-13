import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from './submenu.js'
import ProfileHeader from './components/ProfileHeader'
//import GraphLayout from 'pages/Analysis/GraphLayout'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const GRAPH_CONFIG = require('./graphConfig')


class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            graphConfig:[]
        }
        this.renderCategory = this.renderCategory.bind(this)
        this.layoutChange = this.layoutChange.bind(this)
    }

    layoutChange(a,b) {
        console.log('----layout change -------------')
        console.log(a,b)
        console.log('------------------------------')
    }

    renderCategory(name, configData) {
        console.log('testing', configData)
        return (
            <Element name={name} >
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
                                onLayoutChange={ this.layoutChange }
                                verticalCompact={false}
                            />
                        </div>
                    </div>
                </div>
            </Element>

        )
    }

    render(){

        let categories = Object.keys(GRAPH_CONFIG).map(category => {
            GRAPH_CONFIG[category].forEach(config => {
                config['geoid'] = [this.props.geoid]
                config['geoids'] = [this.props.geoid]
            })

            return this.renderCategory(category, GRAPH_CONFIG[category])
        })

        return (
            <div>
                <ProfileHeader geoids={[this.props.geoid]} />
                <div className='content-w' style={{ width: '100%', marginTop: '90vh', position: 'relative', zIndex: 4}}>
                    <div className="os-tabs-controls content-w"  style={{position: 'sticky', top: 49, justifyContent: 'center',  zIndex:9999}}>
                        <ul className="nav nav-tabs upper" style={{flexWrap: 'nowrap', flex: '1 1', display:'flex'}}>
                            {
                                Object.keys(GRAPH_CONFIG).map(category => {
                                    return (
                                        <li className="nav-item" style={{flex: '1 1'}}>
                                            <Link style={{textAlign: 'center'}} activeClass="active" spy={true} offset={-90} className="nav-link" to={category}> 
                                                {category.toUpperCase()}
                                            </Link>
                                        </li>
                            
                                    )
                                })
                            }
                        </ul>
                    </div>
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
    menuSettings: {
        image: 'none', 
        'scheme': 'color-scheme-dark', 
        style: 'color-style-default'
    },
    subMenus: subMenus,
    auth: false,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Report))
}

/*

 */