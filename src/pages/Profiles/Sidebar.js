import React from "react"

import styled from "styled-components"

import ItemSelector from "components/common/item-selector/item-selector"
import GroupedSelector from "components/common/item-selector/grouped-selector"
import { ArrowRight } from 'components/common/icons';

import { submenu as SubMenu } from "./submenu"

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
// console.log("geoOptions", geoOptions);

const groupedItems = SubMenu[0].map(group => ({
  name: group.name,
  options: [
    { name: group.name, value: regex.exec(group.path)[1] },
    ...group.children.map(child => ({
      name: child.name,
      value: regex.exec(child.path)[1]
    }))
  ]
}))
// console.log("groupedItems", groupedItems);

const TRANSITION_TIME = 500;

const SidebarContainer = styled.div`
  background-color: ${ props => props.theme.sidePanelBg };
  color: ${ props => props.theme.textColor };
  width: ${ props => props.width }px;
  transition: width ${ TRANSITION_TIME }ms;
  left: 10px;
  top: 100px;
  position: absolute;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
`
 const ContentCollapser = styled.div`
  overflow: ${ props => props.isOpen ? "visible" : "hidden" };
 `
 const ToggleContainer = styled.div`
   position: absolute;
   top: 0px;
   bottom: 0px;
   display: flex;
   justify-content: center;
   align-items: center;
   transition: right ${ TRANSITION_TIME }ms;
   right: -${ props => props.open ? 15 : 10}px;
   z-index: 100;
 `
 const Toggle = styled.div`
  width: 20px;
  height: 80px;
  border-radius: 2px;
  background-color: ${ props => props.theme.sideBarCloseBtnBgd };
  transition: background-color 0.15s;
  color: ${ props => props.theme.sideBarCloseBtnColor };
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(${ props => props.doRotate ? 180 : 0 }deg);
  :hover {
    background-color: ${ props => props.theme.sideBarCloseBtnBgdHover };
  }
 `

 const otherRegex = /unsd|zcta/

class Sidebar extends React.Component {
  timeout = null;
  state = {
    open: window.innerWidth >= 1750,
    transitioning: false
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  toggle() {
    this.setState({ open: !this.state.open, transitioning: true });
    this.timeout = setTimeout(() => this.setState({ transitioning: false }), TRANSITION_TIME);
  }
  render() {
    const years = this.props.years.slice().reverse(),
      maxWidth = 200;
    return window.innerWidth < 600 ? null : (
      <SidebarContainer width={ this.state.open ? maxWidth : 1 }>
        <ToggleContainer open={ this.state.open }>
          <Toggle onClick={ () => this.toggle() }
            doRotate={
              (this.state.open && !this.state.transitioning) ||
              (!this.state.open && this.state.transitioning)
            }>
            <ArrowRight height="12px"/>
          </Toggle>
        </ToggleContainer>
        <ContentCollapser isOpen={ this.state.open && !this.state.transitioning }>
          <div style={ { width: `${ maxWidth }px`, padding: "10px" } }>

            { !this.props.regionToggle ? null :
              <div style={ { marginBottom: "10px" } }>
                <div>{ this.props.region }</div>
                <button onClick={ this.props.regionToggle }
                  className="btn btn-block btn-outline-dark">
                  Toggle Region
                </button>
              </div>
            }

            { otherRegex.test(this.props.geoid) ? null :
              <>
                <div>Geography</div>
                <div style={ { position: "relative" } }>
                  <GroupedSelector
                    placeholder="Select an geography..."
                    selectedItems={ geoOptions.reduce((a, c) => c.value === this.props.geoid ? c : a, null) }
                    multiSelect={ false }
                    options={ groupedItems }
                    onChange={ d => this.props.setGeoid(d.value) }
                    displayOption={ d => d.name }
                    getOptionValue={ d => d }/>
                </div>
              </>
            }

            <div style={ { marginTop: "10px" } }>Current Year</div>
            <div style={ { position: "relative" } }>
              <ItemSelector
                selectedItems={ this.props.year }
                multiSelect={ false }
                searchable={ false }
                options={ years }
                onChange={ this.props.setYear }
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
                onChange={ this.props.setCompareYear }
                displayOption={ d => d }
                getOptionValue={ d => d }/>
            </div>

            { !this.props.setCompareGeoid || otherRegex.test(this.props.geoid) ? null :
              <>
                <div style={ { marginTop: "10px" } }>Compare Geography</div>
                <div style={ { position: "relative" } }>
                  <GroupedSelector erasable={ true }
                    selectedItems={ geoOptions.reduce((a, c) => c.value === this.props.compareGeoid ? c : a, null) }
                    placeholder="Select a geography..."
                    multiSelect={ false }
                    options={
                      groupedItems.map(group =>
                        ({ ...group,
                          options: group.options.filter( o =>
                            // (o.value !== this.props.compareGeoid) &&
                            (o.value !== this.props.geoid)
                          )
                        })
                      )
                    }
                    onChange={ d => this.props.setCompareGeoid(d === null ? d : d.value) }
                    displayOption={ d => d.name }
                    getOptionValue={ d => d }/>
                </div>
              </>
            }
          </div>
        </ContentCollapser>
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
