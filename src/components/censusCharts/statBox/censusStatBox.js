import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import TrackVisibility from 'react-on-screen';

class CensusStatBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            graphData9: []
        }
    }
    fetchFalcorDeps(){
        let censusConfig ={};
        let census_subvars = [];
        return falcorGraph.get(['acs','config'])
            .then(res =>{
                censusConfig = res.json.acs.config[this.props.censusKey].variables
                Object.values(censusConfig).forEach(function(config,i){
                    census_subvars.push(config.value)
                })
                return falcorGraph.get(['acs',[...this.props.geoid],this.props.year,[...census_subvars]],['acs','config'])
                    .then(response =>{
                        return response
                    })
            })
    }

    componentWillMount(){
        this.statBoxData().then(res =>{
            this.setState({
                graphData9 : res
            })
        })

    }

    componentDidUpdate(oldProps)
    {
        if(oldProps.geoid !== this.props.geoid){
            this.statBoxData().then(res =>{
                this.setState({
                    graphData9 : res
                })
            })
        }

    }

    statBoxData(){
        return new Promise((resolve,reject) => {
            this.fetchFalcorDeps().then(response =>{
                let census_config = response.json.acs.config[this.props.censusKey].variables;
                let response_data = response.json.acs[this.props.geoid];
                let statData = [];
                let year = Object.keys(response_data).filter(d => d !== '$__path')
                if(this.props.poverty){
                    Object.keys(response_data).filter(d => d !== '$__path').forEach(function(item,i){
                        let data = response_data[item];
                        let value= Object.keys(data).filter(d => d!== '$__path');
                        census_config.forEach(function(config,j){
                            if (j === 0){
                                statData.push({
                                    "title": 'Poverty',
                                    "titleColor":'#000001',
                                    "subTitleColor":'#000001',
                                    "yearColor":'#504F4F',
                                    "valueColor":'#0099ff',
                                    "censusVarName": config.name,
                                    "year": year,
                                    "value": (data[value[0]] / data[value[1]] * 100).toFixed(2) + '%'
                                })
                            }
                        })
                    });
                    resolve(statData)
                }
                else if(this.props.housing){
                    Object.keys(response_data).filter(d => d !== '$__path').forEach(function(item,i){
                        let data = response_data[item];
                        let value= Object.keys(data).filter(d => d!== '$__path');
                        census_config.forEach(function(config,j){
                            if (j === 2){
                                statData.push({
                                    "title":"Housing",
                                    "titleColor":'#000001',
                                    "subTitleColor":'#000001',
                                    "yearColor":'#504F4F',
                                    "valueColor":'#0099ff',
                                    "censusVarName": config.name,
                                    "year": year,
                                    "value": (data[value[2]] / data[value[0]] * 100).toFixed(2) + '%'
                                })
                            }
                        })
                    });
                    resolve(statData)
                }
                else if(this.props.amount){
                    Object.keys(response_data).filter(d => d !== '$__path').forEach(function(item){
                        let data = response_data[item];
                        census_config.forEach(function(config,j){
                            if (j===0){
                                statData.push({
                                    "title": "Economy",
                                    "titleColor":'#000001',
                                    "subTitleColor":'#000001',
                                    "yearColor":'#504F4F',
                                    "valueColor":'#0099ff',
                                    "censusVarName": config.name,
                                    "year": year,
                                    "value": '$' + data[config.value].toLocaleString()
                                })
                            }
                        })
                    });
                    resolve(statData)
                }
                else if(this.props.education){
                    Object.keys(response_data).filter(d => d !== '$__path').forEach(function(item){
                        let data = response_data[item];
                        let value= Object.keys(data).filter(d => d!== '$__path');
                            statData.push({
                                "title":"Education",
                                "titleColor":'#000001',
                                "subTitleColor":'#000001',
                                "yearColor":'#504F4F',
                                "valueColor":'#0099ff',
                                "censusVarName": 'HS ED. & Above',
                                "year": year,
                                "value": ((data[value[1]] + data[value[2]] + data[value[3]] + data[[value[4]]] + data[value[5]] + data[value[6]] + data[value[7]] + data[value[8]] + data[value[9]])/ data[value[0]] * 100).toFixed(2) + '%'
                            })
                    })
                    resolve(statData)
                }
                else{
                    Object.keys(response_data).filter(d => d !== '$__path').forEach(function(item,i){
                        let data = response_data[item]
                        census_config.forEach(function(config,j){
                            if (j===0){
                                statData.push({
                                    "title":"Demographics",
                                    "titleColor":'#000001',
                                    "subTitleColor":'#000001',
                                    "yearColor":'#504F4F',
                                    "valueColor":'#0099ff',
                                    "censusVarName": config.name,
                                    "year": year,
                                    "value": data[config.value].toLocaleString()
                                })
                            }

                        })
                    });
                    resolve(statData)
                }
            })
        })
    }

    render(){
        let colors = [];
        if (this.props.colorRange !== undefined && this.props.colorRange.length >0){
            colors = this.props.colorRange;
        }else{
            this.state.graphData9.map(d => colors.push(d.titleColor,d.subTitleColor,d.yearColor,d.valueColor));
        }
        return(
            <div>
            <h4 style={{color:colors[0],fontWeight: '700'}}>
            {this.state.graphData9.map(d => d.title)}</h4>
            <div className="stats" style={{display:'block',letterSpacing: '1px',margin: '0 0 16px'}}>
            <div className='pop-container'>
            <div className='demo-col'>
            <h5 style={{color:colors[1],display: 'block',fontSize: '12px',fontWeight: '400',letterSpacing: '1px',margin:'0 0 16px',textTransform: 'uppercase',width: '100%'}}> {this.state.graphData9.map(d => d.censusVarName)}
            <span style={{color:colors[2],marginLeft: '6px',textDecoration:'underline',textDecorationStyle:'dashed'}}> {this.state.graphData9.map(d => d.year)} </span>
            </h5>
            <span className='stat' style={{clear: 'both',color:colors[3],display:'block',fontSize: '32px',fontWeight:'700',marginBottom: '0'}}>{this.state.graphData9.map(d => d.value)}</span>
            </div>
            </div>
            </div>
            </div>
        )

    }
    static defaultProps = {
        censusKey: ['B01003'], //'B19013',,
        geoid: ['36001'],
        compareGeoid: ['36'],
        year:['2016'],
        isvisible:false,
        amount: false,
        poverty: false,
        housing: false,
        education: false,
        demographics: false,
        colorRange:[]
    }
}

const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        geoid:ownProps.geoid,
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusStatBox))