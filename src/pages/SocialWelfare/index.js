import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout'
import subMenus from './SocialWelfare-submenu.js'
import '/home/nayanika/IdeaProjects/community_indicators/node_modules/react-grid-layout/css/styles.css'
const GRAPH_CONFIG = require('pages/Report/graphConfig.js')

const GraphLayoutContainer = styled.div`
  height: 100vh;
  overflow-y: scroll;
  margin-left: ${ props => props.sideWidth }px;
  transition: margin-left 250ms;
  padding: 15px 30px;
  
`;

class GraphLayoutSocial extends Component {
    constructor(props){
        super(props);
            this.state ={
                graphConfig: []
        }

    }

    static propTypes = {
        width: PropTypes.number,
        isOpen: PropTypes.number,
        minifiedWidth: PropTypes.number,
        onOpenOrClose: PropTypes.func
    }

    render() {
        const { sideWidth, theme, viewing, title, isOpen, graph, ...rest } = this.props;
        this.props.graph.map(function(graph){
            graph['geoid'] = ['36001']
        })
        return (
            <GraphLayoutContainer
                theme={ theme }
                sideWidth={ viewing || !isOpen ? 0 : sideWidth }>

                <div className='container'>
                     <h4>{ title }</h4>
                </div>

                <GridLayout
                    graphs= {graph}
                    viewing={ viewing }
                    {...rest}/>
            </GraphLayoutContainer>
    );
    }

    static defaultProps = {
        sideWidth: 300,
        minifiedWidth: 1,
        isOpen: 1,
        title: '',
        viewing: false,
        graph: GRAPH_CONFIG.socialWelfare,
        onOpenOrClose: function noop() {}
    };
}

export default {
    icon: 'os-icon-home',
    path: '/social',
    mainNav:true,
    exact:true,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
    name: 'GraphLayout-SocialWelfare',
    auth:false,
    subMenus: subMenus,
    component: GraphLayoutSocial
}

