import React from 'react';
import styled from "styled-components"
import {Tokenizer} from 'react-typeahead'

import geographies from '../submenu'
import './searchcompare.css'
let geonames = geographies[0].reduce((acc, curr) =>{
	return [...acc, curr.name, ...curr.children.map(d => d.name)]
},[])

let geocodes = geographies[0].reduce((acc, curr) =>{
	acc[curr.name] = curr.path.split('/')[2]
	curr.children.forEach(d => { acc[d.name] = d.path.split('/')[2] })
	return acc
},{})

let lookup = geographies[0].reduce((acc, curr) =>{
	acc[curr.path.split('/')[2]] = curr.name
	curr.children.forEach(d => { acc[d.path.split('/')[2]] = d.name  })
	return acc
},{})

const SearchContainer = styled.div`
	position: relative;
	margin: 0px 1rem;
	&::before {
      font-family: 'osfont' !important;
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      position: absolute;
      left: 6px;
      top: 48%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      font-size: 16px;
      content: ${props => props.compare ? "\\e92c" : ''};
      color: rgba(0,0,0,0.3);
    }
`


class SearchCompareComponent extends React.Component {

   
	constructor(props) {
        super(props);
    	this.selectOption = this.selectOption.bind(this);
    	this.removeOption = this.removeOption.bind(this);
    }

   selectOption (opt) {
   	this.props.onChange('add',  geocodes[opt])
   }

   removeOption (opt) {
   	this.props.onChange('remove',  geocodes[opt])
   }

   render () {
   	  console.log('geonames', this.props.compare)
      return (
        <SearchContainer className="" compare={this.props.compare}>
        	{this.props.compare ? <span style={{fontSize:'0.5em', lineHeight:'0.5em', color: '#047bf8'}}>COMPARISON</span> : ''}
          	<Tokenizer 
	          	placeholder="Compare to ..." 
	          	customClasses={{
		          input: this.props.compare ? 'hideSearch ' : 'searchCompareInput',
		          typeahead: 'typeContainer',
		          results: 'resultsContainer'
		        }}
		        defaultSelected={this.props.compare ? [lookup[this.props.compare]] : []}
	          	options={geonames}
	          	onTokenAdd={this.selectOption}
	          	onTokenRemove={this.removeOption}
          	/>
        </SearchContainer>
      )
   }

   static defaultProps = {
   	onChange: () => {} 
   }
}

export default SearchCompareComponent
