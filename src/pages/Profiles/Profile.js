import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from './submenu.js'
import ProfileHeader from './components/ProfileHeader'
//import GraphLayout from 'pages/Analysis/GraphLayout'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import GRAPH_CONFIG from './graphConfig'

import styled from "styled-components"

const Footer = styled.div`
  position: relative;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2),
              -1px -1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 4px;
`
const Header = styled.div`
  font-size: 1.5rem;
`
const SubHeader = styled.div`
  font-size: 0.75rem;
`
const Body = styled.div`
  font-size: 1rem;
`
const Href = styled.a`
  font-size: 1rem;
  position: absolute;
  top: 10px;
  right: 20px;
`

const GetFooter = ({ type, value }) =>
  type === "header" ? <Header>{ value }</Header> :
  type === "subheader" ? <SubHeader>{ value }</SubHeader> :
  type === "body" ? <Body>{ value }</Body> :
  type === "link" ? <Href className="btn btn-sm btn-success" href={ value }>Link</Href> :
  null

const ProfileFooter = ({ data }) =>
  <div>
    {
      data.map(d =>
        <Footer>
          { d.map((d, i) => <GetFooter key={ i } { ...d }/>) }
        </Footer>
      )
    }
  </div>

class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            graphConfig:[]
        }
        this.renderCategory = this.renderCategory.bind(this)
        this.layoutChange = this.layoutChange.bind(this)
    }

    layoutChange(a,b) {
        console.log('----layout change -------------')
        console.log(a,b)
        console.log('------------------------------')
    }

    renderCategory(name, configData) {
        // console.log('testing', configData)
        const profileFooter = configData.find(({ type }) => type === "ProfileFooter");
        return (
            <Element name={name} >
                <div className='content-box'>
                    <div className='element-wrapper'>
                        <h4 className='element-header'> {name.toUpperCase()} </h4>
                        <div classname='element-content'>
                            <GridLayout
                                sideWidth={800}
                                minifiedWidth={1}
                                isOpen={1}
                                title={''}
                                viewing={false}
                                graphs={configData.filter(d => d.type !== "ProfileFooter")}
                                onOpenOrClose={function noop() {}}
                                onLayoutChange={ this.layoutChange }
                                verticalCompact={false}
                            />
                        </div>
                    </div>
                    {
                      !profileFooter ? null :
                      <>
                        <div className='element-wrapper'>
                          <div classname='element-content'>
                            <div className="container" style={ { marginTop: "-2rem" } }>
                              <ProfileFooter { ...profileFooter }/>
                            </div>
                          </div>
                        </div>
                      </>
                    }
                </div>
            </Element>

        )
    }

    render(){

        let currentYear = this.props.years.latest
        let compareYear = this.props.years.latest -1
        let categories = Object.keys(GRAPH_CONFIG).map((category,i) => {
            GRAPH_CONFIG[category].forEach(config => {
                config['geoid'] = [this.props.geoid]
                config['geoids'] = [this.props.geoid]
                //config['year'] = currentYear
                config['compareYear'] = compareYear
                //config.id = (i+1).toString()
            })

            return this.renderCategory(category, GRAPH_CONFIG[category])
        })

        return (
            <div>
                <ProfileHeader geoids={[this.props.geoid]} />
                <div className='content-w' style={{ width: '100%', marginTop: '90vh', position: 'relative', zIndex: 4}}>
                    <div className="os-tabs-controls content-w"  style={{position: 'sticky', top: 49, justifyContent: 'center',  zIndex:9999}}>
                        <ul className="nav nav-tabs upper" style={{flexWrap: 'nowrap', flex: '1 1', display:'flex'}}>
                            {
                                Object.keys(GRAPH_CONFIG).map(category => {
                                    return (
                                        <li className="nav-item" style={{flex: '1 1'}}>
                                            <Link style={{textAlign: 'center'}} activeClass="active" spy={true} offset={-90} className="nav-link" to={category}>
                                                {category.toUpperCase()}
                                            </Link>
                                        </li>

                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className='container'>
                        {categories}
                    </div>
                </div>
            </div>

        )
    }

    static defaultProps = {
        width:[],
        height:[],
        geoid: '36001'
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        years: state.user.years,
        geoid: ownProps.match.params.geoid
            ? ownProps.match.params.geoid
            : 36001
    };
};

const mapDispatchToProps = {};

export default
{
    path: '/profile/:geoid',
    name: 'Report',
    mainNav: false,
    menuSettings: {
        image: 'none',
        'scheme': 'color-scheme-dark',
        style: 'color-style-default'
    },
    subMenus: subMenus,
    auth: false,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Report))
}

/*

 */
