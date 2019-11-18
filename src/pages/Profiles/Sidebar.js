import React from "react"

import styled from "styled-components"

import ItemSelector from "components/common/item-selector/item-selector"

import SubMenu from "./submenu"

const regex = /\/profile\/(\d+)/;

const geoOptions = SubMenu[0].reduce((a, c) => {
  const name = c.name,
    match = regex.exec(c.path),
    value = match[1];
  a.push({ name, value });
  c.children.forEach(cc => {
    const name = cc.name,
      match = regex.exec(cc.path),
      value = match[1];
    a.push({ name, value });
  })
  return a;
}, [])

const SidebarContainer = styled.div`
  background-color: ${ props => props.theme.sidePanelBg };
  color: ${ props => props.theme.textColor };
  width: 250px;
  /*height: 75vh;*/
  left: 20px;
  top: 100px;
  position: absolute;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
  padding: 15px;
`

class Sidebar extends React.Component {
  render() {
    const years = this.props.years.slice().reverse();
    return (
      <SidebarContainer>
        <div>Current Year</div>
        <div style={ { position: "relative" } }>
          <ItemSelector
            selectedItems={ this.props.year }
            multiSelect={ false }
            searchable={ false }
            options={ years }
            onChange={ year => this.props.setYear(year) }
            displayOption={ d => d }
            getOptionValue={ d => d }/>
        </div>

        <div style={ { marginTop: "10px" } }>Compare Year</div>
        <div style={ { position: "relative" } }>
          <ItemSelector
            selectedItems={ this.props.compareYear }
            multiSelect={ false }
            searchable={ false }
            options={ years }
            onChange={ year => this.props.setCompareYear(year) }
            displayOption={ d => d }
            getOptionValue={ d => d }/>
        </div>

        { !this.props.setCompareGeoid ? null :
          <>
            <div style={ { marginTop: "10px" } }>Compare Geography</div>
            <div style={ { position: "relative" } }>
              <ItemSelector erasable={ true }
                selectedItems={ geoOptions.reduce((a, c) => c.value === this.props.compareGeoid ? c : a, null) }
                placeholder="Select a geography..."
                multiSelect={ false }
                searchable={ true }
                options={ geoOptions.filter(d => d.value !== this.props.geoid) }
                onChange={ d => this.props.setCompareGeoid(d === null ? d : d.value) }
                displayOption={ d => d.name }
                getOptionValue={ d => d }/>
            </div>
          </>
        }
      </SidebarContainer>
    )
  }
}

export default Sidebar;


// <ItemSelector
//   selectedItems={filter.value}
//   placeholder="Select a Value"
//   options={filter.domain}
//   multiSelect={false}
//   searchable={false}
//   displayOption={d => d.name ? d.name : filter.domain.reduce((a, c) => c.value === d ? c.name : a, d) }
//   getOptionValue={d => d.value ? d.value : d}
//   onChange={setFilter}
//   inputTheme="secondary"
// />
