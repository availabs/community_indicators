import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import CensusLineChart from 'components/censusCharts/line/censusLineChart'
import CensusStackedLineChart from 'components/censusCharts/line/censusStackedLineChart'
import CensusMultiStackedLineChart from 'components/censusCharts/line/censusMultiStackedLineChart'
import CensusPieChart from 'components/censusCharts/pie/censusPieChart'
import subMenus from 'pages/Report/countyPage-submenu.js'

class GeoPage extends React.Component{
    render(){
        let geoid = this.props.match.params.geoid ?
            this.props.match.params.geoid
            :36001;
        return (
            <div>
                <h1> Racial Population for the year: 2017 </h1>
                <CensusPieChart geoid={[geoid]} censusKey={['B02001']} year={['2017']}/>
                <CensusLineChart geoid={[geoid]} censusKey={['B19013']}/>
                <CensusStackedLineChart geoid={[geoid]} censusKey={['B25002']}/>
                <CensusLineChart geoid={[geoid]} censusKey={['B17001']}/>
                <CensusMultiStackedLineChart geoid={[geoid]} censusKey={['B15003']}/>
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