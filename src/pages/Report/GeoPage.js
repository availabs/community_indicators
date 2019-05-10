import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import CensusLineChart from 'components/censusCharts/line/censusLineChart'
import CensusStackedLineChart from 'components/censusCharts/line/censusStackedLineChart'
import CensusMultiStackedLineChart from 'components/censusCharts/line/censusMultiStackedLineChart'
import CensusPieChart from 'components/censusCharts/pie/censusPieChart'
import CensusStatBox from 'components/censusCharts/statBox/censusStatBox.js'

import subMenus from 'pages/Report/countyPage-submenu.js'

class GeoPage extends React.Component{
    render(){
        let geoid = this.props.match.params.geoid ?
            this.props.match.params.geoid
            :36001;
        return (
            <div>
            <h4>Demographics</h4>
            <div class="Demographics" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',padding:'5px'}}>
            <CensusStatBox geoid={[geoid]} censusKey={['B01003']} year={['2017']}/>
            <CensusStatBox geoid={[geoid]} censusKey={['B01002']} year={['2017']}/>
            </div>
            <h1> Racial Population for the year: 2017 </h1>
            <CensusPieChart geoid={[geoid]} censusKey={['B02001']} year={['2017']}/>
            <div class="Economy" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusLineChart geoid={[geoid]} censusKey={['B19013']}/>
            <h4>Economy
            <CensusStatBox geoid={[geoid]} censusKey={['B19013']} amount={true}/>
            </h4>
            </div>
            <div class="Poverty" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusLineChart geoid={[geoid]} censusKey={['B17001']}/>
            <h4>Poverty
            <CensusStatBox geoid={[geoid]} censusKey={['B17001']} poverty={true}/>
            </h4>
            </div>
            <div class="Housing" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusStackedLineChart geoid={[geoid]} censusKey={['B25002']}/>
            <h4>Housing
            <CensusStatBox geoid={[geoid]} censusKey={['B25002']} housing={true}/>
            </h4>
            </div>
            <div class="Education" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusMultiStackedLineChart geoid={[geoid]} censusKey={['B15003']}/>
            <h4>Education
            <CensusStatBox geoid={[geoid]} censusKey={['B15003']} education={true}/>
            </h4>
            </div>
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