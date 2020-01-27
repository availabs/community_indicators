import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import React from 'react'
import styled from 'styled-components'

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
 let RImg = styled.div `
    img {
      max-height:100vh;
      object-fit:cover;
    }


 `


class Carousel1 extends React.Component {
    render() {
        return (

            <div
                style={{
                    position:'relative',
                    marginTop:0,
                    zIndex:0,
                    width: '100%',
                    height: '100%',
                    backgroundPosition: 'fixed',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100vw 100vh',
                    top: 0,
                    left: 0,
                    justifyContent:'center',
                    alignItems: 'center',
                }}>
                <Carousel autoPlay={true}
                  interval={10000}
                  transitionTime={1250}
                  infiniteLoop
                  dynamicHeight={false}
                  showThumbs={false}
                  showIndicators={false}
                  style={{width: '100%', height: '100%',}}>
                    <div>
                        <RImg> <img src="/Indicators/empire-plaza.jpg" /> </RImg>

                    </div>
                    <div>
                        <RImg> <img src="/Indicators/Albany2.jpg" /> </RImg>

                    </div>
                    <div>
                        <RImg> <img src="/Indicators/Knott.jpg" /> </RImg>

                    </div>
                    <div>
                        <RImg> <img  src="/Indicators/Waterfall.jpg" /> </RImg>

                    </div>
                    <div>
                        <RImg> <img  src="/Indicators/IndianLadder.jpg" /> </RImg>

                    </div>
                </Carousel>
            </div>

        );
    }
}

export default Carousel1
