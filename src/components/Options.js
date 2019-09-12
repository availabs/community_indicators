import React from 'react';

export default class Options extends React.Component {
  render () {
    return (

     <div className="os-tabs-controls" style={{position: 'absolute', top: 0, right: 0, zIndex: 999}}>
       <ul className="nav nav-tabs smaller">
          <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tab_overview">View Data</a></li>
          <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tab_sales">Save Image</a></li>
          <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tab_sales">Share Embed</a></li>
       </ul>
    </div>
    );
  }
}