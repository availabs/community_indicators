import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import GeoName from 'components/censusCharts/geoname'

import styled from "styled-components"
import get from "lodash.get"

const ChildUL = styled.ul`
  ${ props => props.theme.panelDropdownScrollBar };
  max-height: 75vh;
  overflow: auto;
`

class TopSearch extends Component {
  render () {
    return (
      <div className="element-search autosuggest-search-activator">
        <input placeholder="Start typing to search..." type="text" />
      </div>
    )
  }
}

const StyledSubMenuLi = styled.li`
  background-color: #fff;
  > ul {
    display: none;
    > li:last-child {
      padding-bottom: 10px;
    }
  }
  :hover > ul {
    display: block;
  }
`


class MainMenu extends Component {

  constructor(props) {
    super(props);
    this.menuMouseOut = this.menuMouseOut.bind(this)
    this.renderMenus = this.renderMenus.bind(this)
  }

  renderMenus (menus) {
    return menus
      .filter(menu => {
          //console.log('- ',menu);
          return menu.mainNav;
      })
      .filter(menu => {
          return (!menu.auth || this.props.authed);
      })
      .map((menu, index) => {
// console.log('<MainMenu>',menu)
        let topMenu = menu.path ? menu.path.split('/')[1] : 'no-menu-path';

        let path = Array.isArray(this.props.path) ? this.props.path[0] : this.props.path,
          currentTop = path ? path.split('/')[1] : 'no-path',
          isActive = topMenu === currentTop ? 'active' : '';

        if (!menu.subMenus) {
            return (
              <li
                key = {'menuItem_' +index}
                id = {'menuItem_' +index}
                className = {`top-menu-tab ${isActive}`}
                name = {menu.path}
                onMouseOver = {this.menuMouseOver}
                onMouseOut = {this.menuMouseOut}
              >
                <Link to = {menu.path} >
                    <div className = "icon-w" >
                      <i className = { (menu.class ? menu.class : 'os-icon') + ' ' + menu.icon}/>
                    </div>
                    <span > {menu.name} {menu.name === 'Community Profiles' && this.props.activeGeoid ? <GeoName geoid={this.props.activeGeoid} /> : ''}</span>
                </Link>
              </li>
            )

        }
      if(menu.subMenus){
          return (
              <li
                key={'menuItem_' + index}
                className={`top-menu-tab has-sub-menu ${isActive}`}
                id={'menuItem_' + index}
                onMouseOver={this.menuMouseOver}
                onMouseOut={this.menuMouseOut}
              >
                <Link to={menu.path}>
                  <div className="icon-w">
                    <div className="os-icon os-icon-layers"></div>
                  </div>
                  <span>
                    {menu.name}
                    {menu.name === 'Community Profiles' && this.props.activeGeoid ? (': ') : ''}
                    {menu.name === 'Community Profiles' && this.props.activeGeoid ? (<GeoName style={{display:'inline'}} geoids={[this.props.activeGeoid]} />) : ''}
                  </span>
                </Link>
                <div className="sub-menu-w" style={ { backgroundColor: "transparent", boxShadow: "none" } }>
                  <div className="sub-menu-header">{menu.name}</div>
                    <div className="sub-menu-icon">
                      <i className="os-icon os-icon-window-content"/>
                    </div>
                  <div className="sub-menu-i"
                    onMouseOver={this.menuMouseOver}
                    onMouseOut={this.menuMouseOut}>
              {menu.subMenus.map((subMenu, sindex) => {
                      return (
                          <ul
                      className="sub-menu"
                      style={{alignItems:'flex-start', width: "100%"}}
                      key={'subMenu_' + sindex}
                      id={'subMenu_' + index}
                          >
                          {subMenu.map((item, ssindex) => {
                                  return (
                                      <StyledSubMenuLi key={ssindex}
                                        style={ { width: `${ 100 / menu.subMenus.length }%` } }>
                                          <Link to={item.path}>{item.name}</Link>
                                          <ChildUL
                                            className ="sub-sub-menu"
                                            key={'subItem_'+ ssindex}
                                            id= {'subItem_'+ ssindex}
                                            >
                                            {item.children.map((subItem,cindex) =>{
                                                return (
                                                    <li key={cindex}>
                                                    <Link style={ { padding: "2px 10px" } }
                                                      to={subItem.path}>{subItem.name}</Link>
                                                    </li>
                                            );
                                            })
                                            }
                                          </ChildUL>
                                      </StyledSubMenuLi>
                                  );
                              })
                          }
                          </ul>
                  );
                  })}
              </div>
              </div>
              </li>
          )
      }
    })
  }

  menuMouseOver (event) {
    event.target.closest('.top-menu-tab').classList.add('active');
  }

  menuMouseOut (event) {
    if (
      (!event.relatedTarget
      || !event.relatedTarget.closest('ul')
      || event.relatedTarget.closest('ul').id.indexOf('subMenu') === -1|| event.relatedTarget.closest('ul').id.indexOf('subItem') === -1)
      && event.target.closest('.top-menu-tab').getAttribute('name') !== this.props.path
    ) {
      event.target.closest('.top-menu-tab').classList.remove('active');
    }
  }

  render () {
    return (
      <ul className="main-menu" style={ { flexWrap: "wrap" } }>
        {this.renderMenus(this.props.menus)}
        {/*
        <li
          key = {'menuItem_search'}
          id = {'menuItem_search'}
          className = {`top-menu-tab`}
        >
          <a href='#' style={{display: 'inline'}}>
            <span style={{display: 'inline'}} >Compare</span>
          </a>

        </li>
        <li
          key = {'menuItem_search'}
          id = {'menuItem_search'}
          className = {`top-menu-tab`}
        >
          <TopSearch />

        </li>
         */}
      </ul>
    )
  }
}

export default MainMenu
