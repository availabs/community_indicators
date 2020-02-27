
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import AvlMap from 'AvlMap'
import styled from 'styled-components'
import StatBox from 'components/censusCharts/statBox'
import { Element } from 'react-scroll'
import Carousel1 from './Carousel'




let flexStyle = {width: '100vw',
 height: '100vh',
 position: 'fixed',
 top: 0,
 left: 0,
 zIndex: 998,
 display: 'flex',
 justifyContent:'center',
 alignItems: 'center'
}

let LandingHeader = styled.h1`
    color: #efefef;
    font-size: 5em;
    font-weight: 500;
    font-family: "Proxima Nova W01";
    line-height: 0.9;
    text-shadow:-1px -1px 0 #446,
        1px -1px 0 #446,
       -1px 1px 0 #446,
       1px 1px 0 #446;
    text-align:center;
`

let HeaderContainer = styled.div`
 width: 100vw;
 height: 100vh;
 background-position: fixed;
 background-attachment: fixed;
 background-repeat: no-repeat;
  background-size: 100vw 100vh;
 top: 0;
 left: 0;
 display: flex;
 justify-content:center;
 align-items: center;
 position: absolute;
 z-index:2
 `

let StatContainer = styled.div`
    max-width: 520px;
    margin: 0 auto;
    color: #efefef;
    background: rgba(0,0,0,0.3);
    borderRadius: 4;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    > * {
      width: 50%;
    }
`
let OverlayEffect = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    background-position: fixed;
 background-attachment: fixed;
 background-repeat: no-repeat;
  background-size: 100vw 100vh;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
 justify-content:center;
 align-items: center;

`

 let PageContainer = styled.div`
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: 75px;
    color: #293145;
    padding-bottom: 50px;
    position:relative;
    z-index:1
    margin-top:100vh
`
 let PageHeader = styled.h4`
    padding-top: 50px;
    text-transform: uppercase;
    color: #293145;
`

 let SectionHeader = styled.h2`
    padding-top: 50px;
    color: #293145;
    text-transform: uppercase;
`
 let ContentContainer = styled.div`
    margin: 0 auto;
    max-width: 1100px;
`

 let HeaderContainer2 = styled.div`
    margin: 0 auto;
    max-width: 1340px;
`

 let ContentHeader = styled.h3`
    padding-top: 50px;
    color: #293145;
`
 let SectionBoxMain = styled.div`
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    min-width: 0;
 `
 let SectionBox = styled.div`
    font-size: 1.2em;
    line-height: 1.5;
    font-weight: 8;
    font-family: roboto;
    display: flex

 `
 let RImg = styled.img`
    display:block;

    height:100px;
 `

  let RImg2 = styled.img`
    display:block;

    height:70px;
`
  let IA = styled.a`
    color: #5e8dbf;
`

class Home extends Component {
    render () {
        return (

            <div>
                <div style={{display:'flex', top: 0, position:'fixed' , minHeight: '100vh', justifyContent: 'center',  }}>
                    <Carousel1/>
                    <HeaderContainer>
                        <OverlayEffect>
                             <LandingHeader>
                                <p>Using Data to Inform Action</p>
                                <p>In the Greater Capital Region</p>
                             </LandingHeader>
                        </OverlayEffect>
                    </HeaderContainer>

                </div>
                <PageContainer>
                     <ContentContainer>
                         <div className="row">
                            <div className="col-12">
                              <div className="element-wrapper">

                                 <ContentHeader>
                                     We Want Your Feedback
                                 </ContentHeader>
                                 <SectionBoxMain>
                                 This website is a work in progress and we are interested in your feedback, and questions. Please email <IA href="mailto:indicators@cdrpc.org">indicators@cdrpc.org</IA> to share your thoughts or ask questions.
                                 </SectionBoxMain>
                                 <ContentHeader>
                                     Using a Smartphone?
                                 </ContentHeader>
                                 <SectionBoxMain>
                                     The site is not currently optimized for smartphone however you can view the menu navigation if your smartphone is rotated to landscape mode. 
                                 </SectionBoxMain>
                                 <ContentHeader>
                                     Suggested Web-Browser
                                 </ContentHeader>
                                 <SectionBoxMain>
                                 Having problems viewing the data?  The site is optimized for Google Chrome and does not work well in Internet Explorer or Edge. If using those platforms, please switch to Chrome or Firefox.
                                 </SectionBoxMain>

                                 <ContentHeader>
                                     Mission and Purpose
                                 </ContentHeader>
                                 <SectionBoxMain>
                                    <p>Capital Region Indicators is a joint initiative of the&nbsp;
                                    <IA href="https://cdrpc.org/" target="blank">Capital District Regional Planning Commission (CDRPC)</IA>,&nbsp;
                                    <IA href="https://capitalregionchamber.com/" target="blank">Capital Region Chamber</IA>,&nbsp;
                                    <IA href="https://www.cfgcr.org/" target="blank"> The Community Foundation for the Greater Capital Region </IA> and&nbsp;
                                    <IA href="https://www.cdtcmpo.org/index.php" target="blank"> the Capital District Transportation Committee </IA>.&nbsp;
                                    This initiative seeks to help a wide variety of public and private organizations better understand the communities of New York’s Capital Region.  Using the best available information, the website serves as a common source for data and interactive visualizations that will inform community members on critical topics related to the economic and social health, as well as progress of our region.
                                    </p>
                                    <p>The purpose of NY’s Capital Region Indicators is to:
                                      <ul>
                                        <li>Provide high quality, reliable, objective and up-to-date data</li>
                                        <li>Spur discussion about and build consensus around our region’s key indicators</li>
                                        <li>Help better understand changes in our communities’ well-being over time to better target investments to address chronic and emerging challenges and community needs</li>
                                        <li>Provide information relevant to community and regional planning</li>
                                        <li>Serve as a key resource for data needed for grant applications and reports developed by public and private organizations</li>
                                      </ul>
                                    </p>
                                    <p>
                                        The site was custom-designed by
                                        <IA href="https://availabs.org/" target="blank">the Albany Visualization and Informatics Lab (AVAIL)</IA> located in the Geography and Planning Department at the University at Albany, State University of New York, and is maintained by
                                        &nbsp;<IA href="https://cdrpc.org/" target="blank">CDRPC</IA>.
                                    </p>
                                </SectionBoxMain>

                                <ContentHeader>
                                    Project Partners
                                </ContentHeader>
                                <SectionBoxMain>
                                    <div className='container' style={{paddingBottom: '20px' , paddingTop: '20px'}}>
                                      <div className='row' >
                                        <div className='col-sm'>
                                          <a href="https://cdrpc.org/" target="blank"> 
                                          <RImg src="/Indicators/CDRPCLogoMaster.jpg" alt="Logo for the Capital District Regional Planning Commission" className='imageStyle'/>
                                          </a>
                                        </div>
                                        <div className='col-sm'>
                                          <a href="https://capitalregionchamber.com/" target="blank">
                                                <RImg src="/Indicators/CapitalRegionChamber.png" alt="Logo for the Capital Region Chamber"className='imageStyle'/>
                                          </a>
                                        </div>
                                        <div className='col-sm'>
                                            <a href="https://www.cfgcr.org/" target="blank" >
                                                <RImg src="/Indicators/communityFoundation.gif" alt="Logo for the Community Foundation for the Greater Capital Region" className='imageStyle'/>
                                            </a>
                                        </div>
                                    </div>
                                   </div>
                                   <div className='container' style={{paddingBottom: '20px' }}>
                                     <div className='row' >
                                        <div className='col-sm'>
                                            <a href="https://www.cdtcmpo.org/index.php" target="blank">
                                                <RImg src="/Indicators/cdtcLogo.png" alt="Logo for the Capital District Transportation Committee" className='imageStyle'/>
                                            </a>
                                        </div>
                                        <div className='col-sm'>
                                            <a href="https://availabs.org" target="blank" >
                                                <RImg2 src="/Indicators/AVAIL.png" alt="Logo for the Albany Visualization and Informatics Laboratory" className='imageStyle'/>
                                            </a>                                        
                                        </div>
                                        <div className='col-sm'>
                                            <a href="https://www.albany.edu" target="blank">
                                                <RImg2 href="https://www.albany.edu" target="blank" src="/Indicators/UAlogo.gif" alt="Logo for the University at Albany, State University of New York" sclassName='imageStyle'/>
                                            </a>
                                        </div>
                                    </div>
                                  </div>

                                </SectionBoxMain>

                                <ContentHeader>
                                    How You Can Use Capital Region Indicators:
                                </ContentHeader>
                                <SectionBoxMain>
                                    The information available on Capital Region Indicators can be used for a wide range of purposes, be it to drive conversation, encourage collaboration around an issue, assist with research projects, inspire charitable efforts or inform the general public.
                                </SectionBoxMain>

                                <ContentHeader>
                                    Data Sources
                                </ContentHeader>
                                <SectionBoxMain>
                                    All information currently displayed herein is from the U.S. Census, American Communities Survey, 5-Year Estimates. The Default is set to 2018 and the comparison year is set to 2013.
                                </SectionBoxMain>

                                <ContentHeader>
                                    Visitors to Capital Region Indicators can:
                                </ContentHeader>
                                <SectionBoxMain>
                                    <ul>
                                        <li>Interact with data visualizations and regional maps to see trends over time and compare indicators at different geographies</li>
                                        <li>Drill down to view statistics at the county, town or city, or census tract level. </li>
                                        <li>Download graphs as image files.</li>
                                        <li>Embed data visualizations for sharing on a website or social media platforms.</li>
                                        <li>Download the raw data for each indicator in a variety of formats.</li>
                                        <li>Connect with important data other providers have produced.</li>
                                    </ul>
                                </SectionBoxMain>

                                <ContentHeader>
                                   Contact
                                 </ContentHeader>
                                 <SectionBoxMain>
                                    This website is maintained by the Capital District Regional Planning Commission. For questions, please contact <IA href="mailto:indicators@cdrpc.org">indicators@cdrpc.org</IA> or 518-453-0850.
                                 </SectionBoxMain>
                                <ContentHeader>
                                    Terms of Use:
                                </ContentHeader>
                                <SectionBoxMain>
                                    <p>Information on this site is provided on an "as is" and "as available" basis. Capital Region Indicators makes every effort to ensure, but does not guarantee, the accuracy or completeness of the information on the Capital Region Indicators website. Our goal is to keep this information timely and accurate. If errors are brought to our attention, we will try to verify such errors and if found to be incorrect to endeavor to correct them. Capital Region Indicators may add, change, improve, or update the information of the website in its sole discretion without notice.</p>
                                    <p>Capital Region Indicators reserves its exclusive right in its sole discretion to alter, limit or discontinue part of this site. Under no circumstances shall Capital Region Indicators be liable for any loss, damage, liability or expense suffered which is claimed to result from use of this site, including without limitation, any fault, error, omission, interruption or delay. Use of this site is at User's sole risk. We make every effort to minimize disruption caused by technical errors. However, some data or information on the Capital Region Indicators website may have been created or structured in files or formats which are not error-free and we cannot guarantee that our service will not be interrupted or otherwise affected by such problems. Capital Region Indicators accepts no responsibility with regards to such problems, including but not limited to failure of performance, computer virus, communication line failure, alteration of content, etc. incurred as a result of using the Capital Region Indicators website or any link to external sites.</p>
                                    <p>The User specifically acknowledges and agrees that Capital Region Indicators is not liable for any conduct of any other User, including, but not limited to, the types of conduct listed above. Capital Region Indicators reserves the right to deny at its sole discretion any User access to the Capital Region Indicators website or any portion thereof without notice.</p>
                                    <p>For site security purpose and to ensure that the Capital Region Indicators website remains available to all users, it employs software programs to monitor network traffic to identify unauthorized attempts to upload or change information, or otherwise cause damage and to detect other possible security breaches.</p>
                                </SectionBoxMain>


                               </div>
                            </div>
                        </div>
                    </ContentContainer>
                </PageContainer>
            </div>



        )
    }
}

const mapStateToProps = state => ({
  year: state.user.year
})

export default {
    icon: 'icon-map',
    path: '/',
    exact: true,
    mainNav: true,
    title: 'Welcome to Community Indicators',
    menuSettings:{
            image: 'none',
            scheme: 'color-scheme-dark',
            style: 'color-style-default'
        },
    name: 'About',
    auth: false,
    component: connect(mapStateToProps)(Home)
}
