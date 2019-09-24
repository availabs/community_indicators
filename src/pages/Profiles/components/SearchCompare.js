import React from 'react';
import styled from "styled-components"
import {Tokenizer} from 'react-typeahead'

import geographies from '../submenu'
import './searchcompare.css'
let geonames = geographies[0].reduce((acc, curr) =>{
	return [...acc, curr.name, ...curr.children.map(d => d.name)]
},[])


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
   	console.log('optionSelected', opt)
   }	

   render () {
   	  console.log('geonames', geonames)
      return (
        <SearchContainer className="element-search autosuggest-search-activator menu-position-top menu-w">
          <Tokenizer 
          	placeholder="Compare to ..." 
          	customClasses={{
	          input: 'searchCompareInput',
	          results: ""
	        }}
          	options={geonames}/>
        </SearchContainer>
      )
   }
}

export default SearchCompareComponent