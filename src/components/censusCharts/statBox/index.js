import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import TrackVisibility from 'react-on-screen';
import get from 'lodash.get'

class CensusStatBox extends React.Component{
    constructor(props) {
        super(props);
        this.calculateValues = this.calculateValues.bind(this)
    }
    fetchFalcorDeps(){
        let censusConfig ={};
        let census_subvars = [];
        let years = [this.props.year]
        if(this.props.compareYear) {
            years.push(this.props.compareYear)
        }
        let censusKeys = [this.props.censusKey]
        if(this.props.divisorKey) {
            censusKeys.push(this.props.divisorKey)
        }

        return falcorGraph
            .get(['acs',this.props.geoids,years, censusKeys])
            .then(response =>{
                return response
            })
    }

    calculateValues(){

        let value = this.props.geoids
            .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.censusKey}`, 0))
            .reduce((a,b) => a + b )



        if(this.props.sumType === 'avg') {
            value /= this.props.geoids.length
        } else if (this.props.sumType === 'pct') {
            let divisorValue = this.props.geoids
            .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.divisorKey}`, 0))
            .reduce((a,b) => a + b )

            console.log('calculateValues', value, divisorValue, value / divisorValue * 100)
            value /= divisorValue
            value *= 100
        }

        console.log('got the value', value)
        if(!value) {
            return {value: '', change: ''}  
        } 

        let change = 0
        // console.log('compareYear', this.props.compareYear)

        if(this.props.compareYear) {
            let compareValue = this.props.geoids
                .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.compareYear}.${this.props.censusKey}`, 0))
                .reduce((a,b) => a + b )

            if (this.props.sumType === 'pct') {
                let divisorValue = this.props.geoids
                .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.divisorKey}`, 0))
                .reduce((a,b) => a + b )

                console.log('calculateValues', value, divisorValue, value / divisorValue * 100)
                compareValue /= divisorValue
                compareValue *= 100
            }



            change = (((value - compareValue) / compareValue) * 100)
            // console.log('comparevalue', this.props.compareYear)

            change = isNaN(change) ? '' : change.toFixed(2)
        }

        return {
            value,
            change
        }
    }

    render(){
        let displayData = this.calculateValues()
        return(
            <div className='el-tablo' style={{padding: 10}}>
                
                <div className='title' style={{fontSize: '1.2em', textAlign: 'center'}}> 
                    {this.props.title}
                </div>
                
                <div className='value' style={{ textAlign: 'center', display: 'block'}}>
                    {this.props.valuePrefix}
                    {displayData.value.toLocaleString('en-us',{maximumFractionDigits: this.props.maximumFractionDigits})}
                    {this.props.valueSuffix}
                </div>
                {this.props.compareYear &&
                    <div className='' style={{ textAlign: 'center'}}> 
                        {Math.abs(displayData.change)}% {displayData.change >= 0 ? 'Growth' : 'Decline'} 
                    </div>
                 }
            </div>
        )

    }

    static defaultProps = {
        censusKey: 'B01003_001E', //'B19013',,
        geoids: ['36001'],
        year:'2016',
        colorRange:[],
        maximumFractionDigits: 0
    }
}

const mapDispatchToProps = { };

const mapStateToProps = (state) => {
    return {
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusStatBox))