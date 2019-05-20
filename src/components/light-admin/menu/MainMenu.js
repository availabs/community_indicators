import React, { Component } from 'react';
import { Link } from 'react-router-dom'

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
          //console.log('menu',menu)
        let topMenu = menu.path ? menu.path.split('/')[1] : ''
        let currentTop = this.props.path ? this.props.path.split('/')[1] : ' ' 
        let isActive = topMenu === currentTop
          ? 'active selected'
          : ''
        if (!menu.subMenus) {
            return (
                < li
            key = {'menuItem_' +index}
            id = {'menuItem_' +index}
            className = {`top-menu-tab ${isActive}`
            }
            name = {menu.path}
            onMouseOver = {this.menuMouseOver}
            onMouseOut = {this.menuMouseOut}
                >
                < Link
            to = {menu.path} >
                < div
            className = "icon-w" >
                < i
            className = {
            (menu.class ? menu.class : 'os-icon') + ' ' + menu.icon
        }
            />
            < /div>
            < span > {menu.name} < /span>
            < /Link>
            < /li>
        )
            ;
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
              <span>{menu.name}</span>
              </Link>
              <div className="sub-menu-w">
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
                      key={'subMenu_' + sindex}
                      id={'subMenu_' + index}
                          >
                          {subMenu.map((item, ssindex) => {
                                  return (
                                      <li key={ssindex}>
                                          <Link to={item.path}
                                          >{item.name}</Link>
                                      <ul
                                  className ="sub-sub-menu"
                                  key={'subItem_'+ ssindex}
                                  id= {'subItem_'+ ssindex}
                                  >
                                  {item.children.map((subItem,cindex) =>{
                                      return (
                                          <li key={cindex}>
                                          <Link to={subItem.path}>{subItem.name}</Link>
                                          </li>
                                  );
                                  })
                                  }
                                      </ul>
                                      </li>
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
      <ul className="main-menu">
        {this.renderMenus(this.props.menus)}      
      </ul>
    )
  }
}

export default MainMenu
