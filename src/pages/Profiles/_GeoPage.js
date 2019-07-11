import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import CensusLineChart from 'components/censusCharts/line/censusLineChart'
import CensusStackedLineChart from 'components/censusCharts/line/censusStackedLineChart'
import CensusMultiStackedLineChart from 'components/censusCharts/line/censusMultiStackedLineChart'
import CensusPieChart from 'components/censusCharts/pie/censusPieChart'
import CensusStatBox from 'components/censusCharts/statBox/censusStatBox.js'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from 'pages/Report/GeoPage-submenu.js'

const GRAPH_CONFIG = require('pages/Report/graphConfig.js')

class GeoPage extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            graphConfig : []
        })
    }

    componentWillMount(){
        this.setState({

        })
    }
    render(){
        let geoid = this.props.match.params.geoid ?
            this.props.match.params.geoid
            :36001;
        const style ={
            height: 1000
        }
        return (
            <div>
            <div class="Demographics" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',padding:'5px'}}>
    <CensusStatBox geoid={[geoid]} censusKey={['B01003']} year={['2017']} demographics={true}/>
        <CensusStatBox geoid={[geoid]} censusKey={['B01002']} year={['2017']} demographics={true}/>
        </div>
        <h1> Racial Population for the year: 2017 </h1>
        <CensusPieChart geoid={[geoid]} censusKey={['B02001']} year={['2017']} single={true}/>
        <div class="Economy" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
    <GridLayout
        sideWidth={300}
        minifiedWidth={1}
        isOpen={1}
        title={''}
        viewing={false}
        graphs={[{
                id :'1',
                type:'CensusLineChart',
                geoid:['36001'],
                censusKey:['B19013'],
                layout:{
                    static:false,
                    h: 14,
                    w: 6,
                    x:0,
                    y:0
                }
            },
        {
            id :'2',
                type:'CensusStatBox',
            geoid:['36001'],
            censusKey:['B19013'],
            amount:true,
            layout:{
            static:false,
                h: 5,
                w: 2,
                x:0,
                y:0
        }
        }

    ]}
        onOpenOrClose={function noop() {}}
        onLayoutChange={ this.props.onLayoutChange }
        />
        </div>
        <div class="Poverty" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
    <CensusLineChart geoid={[geoid]} censusKey={['B17001']}/>
        <CensusStatBox geoid={[geoid]} censusKey={['B17001']} poverty={true}/>
        </div>
        <div class="Housing" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
    <CensusStackedLineChart geoid={[geoid]} censusKey={['B25002']}/>
        <CensusStatBox geoid={[geoid]} censusKey={['B25002']} housing={true}/>
        </div>
        <div class="Education" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
    <CensusMultiStackedLineChart geoid={[geoid]} censusKey={['B15003']}/>
        <CensusStatBox geoid={[geoid]} censusKey={['B15003']} education={true}/>
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
        name: 'Geo Page',
        mainNav: false,
        breadcrumbs: [
            {param: 'geoid', path: '/report/'}
        ],
        
        menuSettings:
            {
                image: 'none',
                scheme: 'color-scheme-dark',
                layout: 'menu-layout-mini',
                style: 'color-style-default',
                subemenustyle: 'sub-menu-style-over'
            },
        subMenus: subMenus,
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeoPage))
    }

/*

 */