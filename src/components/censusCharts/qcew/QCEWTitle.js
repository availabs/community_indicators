import React from "react"

import styled from "styled-components"

const MyTooltip = styled.div`
  display: none;
  position: absolute;
  z-index: 1000;
  top: ${ props => props.center ? `calc(-10px - 0.5rem)` : "-0.5rem" };
  background-color: white;
  padding: ${ props => props.center ? `calc(0.5rem + 10px)` : "0.5rem" } 0.5rem 0.5rem 0.5rem;
  width: calc(100% + 1rem + ${ props => props.center ? "20px" : "0px" });
  border-top-left-radius: 4px;
  border-top-right-radius: ${ props => props.center ? "4px" : "0px" };
`

const TooltipContainer = styled.div`
  position: relative;

  &:hover > ${ MyTooltip } {
    display: inline-block;
  }
`

const QCEWTitle = ({ title, source = [], center = false }) => {
  return (
    <div style={ {
      padding: center ? "8px 10px" : '8px 0px 0px 10px',
      fontSize: "1.2rem",
      textAlign: center ? "center" : null,
      width: "100%"
    } }>
      <TooltipContainer>
        { title }

        <MyTooltip center={ center }
          style={ {
            left: center ? "50%" : "-0.5rem",
            transform: center ? "translate(-50%)" : null,
            color: "#3E4B5B"
          } }>

          { title }

          <div style={ {
            fontSize: "1rem",
            lineHeight: "1rem"
          } }>
            { source.map((s, i) => (
                <div key={ i }>
                  { s }
                </div>
              ))
            }
          </div>

        </MyTooltip>

      </TooltipContainer>
    </div>
  )
}
export default QCEWTitle
