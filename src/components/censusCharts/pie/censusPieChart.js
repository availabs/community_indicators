import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import { PieCanvas } from '@nivo/pie'
import ColorRanges from 'constants/color-ranges'


class CensusPieChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height : [],
            width: []
        }
    }


    fetchFalcorDeps() {
        let censusConfig ={};
        let census_subvars = [];
        let censusKey = this.props.censusKey;
        return this.props.falcor.get(['acs','config']).then(res => {

            Object.values(res.json.acs).forEach( (config, i) =>{
                censusConfig = config
            });

            Object.keys(censusConfig).forEach(function (censvar, i) {
                if (censusKey.includes(censvar)) {
                    Object.values(censusConfig[censvar].variables).forEach(function (subvar, i) {
                        census_subvars.push(subvar.value)
                    })
                }
            })

            // console.log('census subvars', s)
            return this.props.falcor.get(['acs',[...this.props.geoid],[...this.props.year],[...census_subvars]])
                .then(response=>{
                    //console.log('FETCH SERVER PIE', this.props.geoid, this.props.year, census_subvars, response)
                    return response
            })

        })
    }

    function

    componentDidMount() {

        let width = document.getElementById('root').clientHeight * 0.25
        let height = document.getElementById('root').clientHeight * 0.25

        this.setState({
            height: height,
            width: width
        })

    }

    pieData(){
            //console.log('geoid',geoid)
            let response = this.props.graph
            //console.log('response',this.props.graph)
            if(!response.acs || !response.acs.config) {
                return []
            }
            let census_config = {};
            let responseData_race = {};
            let pieData = [];


            census_config = response.acs.config.value;
            let config = census_config[this.props.censusKey].variables;
            responseData_race = response.acs[this.props.geoid][this.props.year];
            let colors = ColorRanges[Object.keys(responseData_race).shift().length+1].filter(d => d.name === 'Set3')[0].colors
            Object.keys(responseData_race).forEach(function(race_key,i){
                if (i !== 0){
                    pieData.push({
                        'id':config[i].name,
                        'label':config[i].name,
                        'value':responseData_race[race_key],
                        'color': colors[i]
                    })
                }
            });

            return pieData


    }

    render () {
        return(
        <div>
        <PieCanvas
        data={this.pieData()}
        width={this.state.width}
        height={this.state.height}
        margin={{
            "top": 0,
                "right": 10,
                "bottom": 0,
                "left": 10
        }}
        pixelRatio={1.2999999523162842}
        sortByValue={false}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={this.pieData().map(d => d.color)}
        borderColor="inherit:darker(0.6)"
        radialLabel="value"
        enableRadialLabels ={false}
        radialLabelsSkipAngle={0}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={-14}
        radialLabelsLinkDiagonalLength={36}
        radialLabelsLinkHorizontalLength={30}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor="inherit"
        slicesLabelsSkipAngle={10}
        enableSlicesLabels={false}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        defs={[
                {
                    "id": "dots",
                    "type": "patternDots",
                    "background": "inherit",
                    "color": "rgba(255, 255, 255, 0.3)",
                    "size": 4,
                    "padding": 1,
                    "stagger": true
                },
        {
            "id": "lines",
            "type": "patternLines",
            "background": "inherit",
            "color": "rgba(255, 255, 255, 0.3)",
            "rotation": -45,
            "lineWidth": 6,
            "spacing": 10
        }
    ]}
        />
        </div>
        )



    }


    static defaultProps = {
        censusKey: [],
        geoids: [],
        year: ['2016'],
        pieWidth: [],
        pieHeight:[]
    }

}


const mapDispatchToProps = {

};


const mapStateToProps = (state,ownProps) => {
    return {
        geoid : ownProps.geoid,
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};


export default  connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CensusPieChart))



/*
         legends={[
                {
                    "anchor": "right",
                    "direction": "column",
                    "translateX": -10,
                    "itemWidth": 80,
                    "itemHeight": 20,
                    "itemsSpacing": 2,
                    "symbolSize": 14,
                    "symbolShape": "circle"
                }
                ]}
         */
