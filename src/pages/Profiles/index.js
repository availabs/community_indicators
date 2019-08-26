import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from './submenu.js'
import Profiles from './Profile'
import ProfileHeader from './components/ProfileHeader'
const GRAPH_CONFIG = require('./graphConfig')

class ReportIndex extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            graphConfig:[]
        }
    }

    componentWillMount(){
        this.setState({
            graphConfig: GRAPH_CONFIG
        })
    }

    render(){
        return(
            <div >
                <ProfileHeader 
                    title={`Capital District\n Development Region`} 
                    geoids={['36001','36083','36093','36091','36039','36021','36115','36113']} 
                />
            </div>
        )
    }

    static defaultProps = {
        width:[],
        height:[]
    }

}

const mapStateToProps = state => {
    return {
        geoGraph: state.graph.geo,
        router: state.router
    };
};

const mapDispatchToProps = {};

export default [
    {
        icon: 'os-icon-home',
        path: '/profiles',
        mainNav:true,
        exact:true,
        menuSettings:
                {
                    image: 'none',
                    scheme: 'color-scheme-dark',
                    style: 'color-style-default',
                    
                },
        name: 'Profiles',
        auth:false,
        subMenus: subMenus,
        component: ReportIndex
    },
    Profiles
]
