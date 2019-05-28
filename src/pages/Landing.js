
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

class Home extends Component {
    render () {
        return (
            <div className='property-single'>
            <div className='property-info-w'>
            <div className="property-info-main">
            <div className="property-section">

        </div>
        </div>
        </div>
        </div>

    )
    }
}

export default {
    icon: 'icon-map',
    path: '/',
    exact: true,
    mainNav: false,
    title: 'Welcome to Community Indicators',
    name: 'Home',
    auth: false,
    component: Home
}