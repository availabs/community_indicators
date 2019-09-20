import React from 'react';

import styled from 'styled-components'

const A = styled.a`
  &.nav-link {
    padding: 0.25rem 1rem!important;
  }
`

export default class Options extends React.Component {
  render () {
    return (

     <div className="os-tabs-controls"
      style={ {
        position: 'absolute',
        top: "3px", right: "10px",
        zIndex: 999, margin: 0
      } }>
       <ul className="nav nav-tabs smaller">
          <li className="nav-item" style={ { margin: 0 } }>
            <A className="nav-link" data-toggle="tab" href="#">View Data</A>
          </li>
          <li className="nav-item" style={ { margin: 0 } }>
            <A className="nav-link" data-toggle="tab" href="#">Save Image</A>
          </li>
          <li className="nav-item" style={ { margin: 0 } }>
            <A className="nav-link" data-toggle="tab" href="#">Share Embed</A>
          </li>
       </ul>
    </div>
    );
  }
}
