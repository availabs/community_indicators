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
      content: "\\e92c";
      color: rgba(0,0,0,0.3);
    }
`


class SearchCompareComponent extends React.Component {

   selectOption (opt) {
   	console.log('optionSelected', opt, geocodes[opt])
   }

   render () {
   	  // console.log('geonames', geonames)
      return (
        <SearchContainer className="">
          <Tokenizer
          	placeholder="Compare to ..."
          	customClasses={{
	          input: 'searchCompareInput',
	          typeahead: 'typeContainer',
	          results: 'resultsContainer'
	        }}
          	options={geonames}
          	onTokenAdd={this.selectOption}
          	onTokenRemove={this.selectOption}
          	/>
        </SearchContainer>
      )
   }
}

export default SearchCompareComponent
