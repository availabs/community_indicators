import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import CensusLineChart from 'components/censusCharts/line/censusLineChart'
import subMenus from 'pages/Report/countyPage-submenu.js'

class GeoPage extends React.Component{
    render(){
        let geoid = this.props.match.params.geoid ?
            this.props.match.params.geoid
            :36001;
        return (
            <div>
                <CensusLineChart geoid={[geoid]} censusKey={['B19013']}/>
            </div>
        )
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
        name: 'County Page',
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
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeoPage))
    }