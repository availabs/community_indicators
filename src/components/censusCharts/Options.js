import React from 'react';

import styled from 'styled-components'

const A = styled.a`
  &.nav-link {
    padding: 0.25rem 1rem!important;
  }
`

export default class Options extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
        showModal: false
      }
      this.toggleModal = this.toggleModal.bind(this)
    }

  renderModal(){
    return (
      <div className="onboarding-modal modal fade animated show" id="onboardingSlideModal" role="dialog" tabIndex={-1} style={{display: 'block', paddingRight: '15px'}}>
        <div className="modal-dialog modal-centered" role="document">
          <div className="modal-content text-center">
            <button aria-label="Close" className="close" data-dismiss="modal" type="button"><span className="close-label">Skip Intro</span><span className="os-icon os-icon-close" /></button>
            <div className="onboarding-slider-w slick-initialized slick-slider slick-dotted">
              <button className="slick-prev slick-arrow slick-disabled" aria-label="Previous" type="button" aria-disabled="true" style={{}}>Previous</button>
              <div className="slick-list draggable" style={{height: '599.594px'}}>
                <div className="slick-track" style={{opacity: 1, width: '1650px', transform: 'translate3d(0px, 0px, 0px)'}}>
                  <div className="onboarding-slide slick-slide slick-current slick-active" data-slick-index={0} aria-hidden="false" style={{width: '550px'}} tabIndex={0} role="tabpanel" id="slick-slide00" aria-describedby="slick-slide-control00">
                    <div className="onboarding-media"><img alt="" src="img/bigicon5.png" width="200px" /></div>
                    <div className="onboarding-content with-gradient">
                      <h4 className="onboarding-title">Example Request Information</h4>
                      <div className="onboarding-text">In this example you can see a form where you can request some additional information from the customer when they land on the app page.</div>
                      <form>
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="form-group">
                              <label htmlFor>Your Full Name</label>
                              <input className="form-control" placeholder="Enter your full name..." type="text" defaultValue tabIndex={0} />
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="form-group">
                              <label htmlFor>Your Role</label>
                              <select className="form-control" tabIndex={0}>
                                <option>Web Developer</option>
                                <option>Business Owner</option>
                                <option>Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="onboarding-slide slick-slide" data-slick-index={1} aria-hidden="true" style={{width: '550px'}} tabIndex={-1} role="tabpanel" id="slick-slide01" aria-describedby="slick-slide-control01">
                    <div className="onboarding-media"><img alt="" src="img/bigicon6.png" width="200px" /></div>
                    <div className="onboarding-content with-gradient">
                      <h4 className="onboarding-title">Showcase App Features</h4>
                      <div className="onboarding-text">In this example you can showcase some of the features of your application, it is very handy to make new users aware of your hidden features. You can use boostrap columns to split them up.</div>
                      <div className="row">
                        <div className="col-sm-6">
                          <ul className="features-list">
                            <li>Fully Responsive design</li>
                            <li>Pre-built app layouts</li>
                            <li>Incredible Flexibility</li>
                          </ul>
                        </div>
                        <div className="col-sm-6">
                          <ul className="features-list">
                            <li>Boxed &amp; Full Layouts</li>
                            <li>Based on Bootstrap 4</li>
                            <li>Developer Friendly </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="onboarding-slide slick-slide" data-slick-index={2} aria-hidden="true" style={{width: '550px'}} tabIndex={-1} role="tabpanel" id="slick-slide02" aria-describedby="slick-slide-control02">
                    <div className="onboarding-media"><img alt="" src="img/bigicon2.png" width="200px" /></div>
                    <div className="onboarding-content with-gradient">
                      <h4 className="onboarding-title">Example of onboarding screen!</h4>
                      <div className="onboarding-text">This is an example of a multistep onboarding screen, you can use it to introduce your customers to your app, or collect additional information from them before they start using your app.</div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="slick-next slick-arrow" aria-label="Next" type="button" style={{}} aria-disabled="false">Next</button>
              <ul className="slick-dots" style={{}} role="tablist">
                <li className="slick-active" role="presentation">
                  <button type="button" role="tab" id="slick-slide-control00" aria-controls="slick-slide00" aria-label="1 of 3" tabIndex={0} aria-selected="true">1</button>
                </li>
                <li role="presentation" className>
                  <button type="button" role="tab" id="slick-slide-control01" aria-controls="slick-slide01" aria-label="2 of 3" tabIndex={-1}>2</button>
                </li>
                <li role="presentation">
                  <button type="button" role="tab" id="slick-slide-control02" aria-controls="slick-slide02" aria-label="3 of 3" tabIndex={-1}>3</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  toggleModal() {
    console.log('toggle')
    this.setState({showModal: !this.state.showModal})
  }

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
            <A className="nav-link"  onClick={this.toggleModal}>View Data</A>
          </li>
          <li className="nav-item" style={ { margin: 0 } }>
            <A className="nav-link" data-toggle="tab" href="#">Save Image</A>
          </li>
          <li className="nav-item" style={ { margin: 0 } }>
            <A className="nav-link" data-toggle="tab" href="#">Share Embed</A>
          </li>
       </ul>
       {this.state.showModal ? this.renderModal() : ''}
    </div>
    );
  }
}
