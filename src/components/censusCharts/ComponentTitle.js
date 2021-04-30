import React from "react"

import styled from "styled-components"

import { Tooltip } from "components/common/styled-components"

import { makeCensusFormula } from "./makeCensusFormula"

let id = -1;
const getId = () => `tool-tip-${ ++id }`;

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

export default ({ title, className = null, style = {}, center = false, ...props }) => {
  const id = React.useRef(getId());

  const ref = React.useRef();

  return !Boolean(title) ? null : (
    <div ref={ ref } className={ className }
      style={ {
        padding: center ? "8px 10px" : '8px 0px 0px 10px',
        fontSize: "1.2rem",
        textAlign: center ? "center" : null,
        width: "100%",
        ...style
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
          <div style={ { fontSize: "1rem" } }>
            { `US Census ACS 5-Year Estimates` }
          </div>
          <CensusKeys { ...props } center={ center }/>
        </MyTooltip>

      </TooltipContainer>
    </div>
  )
}

const Comma = () => <span style={ { paddingRight: "0.25rem" } }>,</span>;
const Plus = () => <span style={ { padding: "0px 0.25rem" } }>+</span>;
const Minus = () => <span style={ { padding: "0px 0.25rem" } }>-</span>;
const Divide = () => <span style={ { padding: "0px 0.25rem" } }>/</span>;

const getKeys = (keys, multi = false) => {
  return keys.reduce((a, c, i) => {
    a.push(<div key={ c }>{ c }</div>);
    if ((i + 1) < keys.length) {
      if (multi) {
        a.push(<Comma key={ i }/>);
      }
      else {
        a.push(<Plus key={ i }/>);
      }
    }
    return a;
  }, []);
}

const CensusKeys = ({ censusKeys = [], subtractKeys = [], divisorKeys = [], center, multi = false }) => {

  const CensusKeys = React.useMemo(() => {
    return getKeys(censusKeys, multi);
  }, [censusKeys, multi]);

  const SubtractKeys = React.useMemo(() => {
    return getKeys(subtractKeys);
  }, [subtractKeys]);

  const DivisorKeys = React.useMemo(() => {
    return getKeys(divisorKeys);
  }, [divisorKeys]);

  const total = censusKeys.length + subtractKeys.length + divisorKeys.length;

  return (
    <div style={ {
      display: "flex",
      flexWrap: "wrap",
      fontSize: ((total > 10) && center) ? "0.75rem" : "1rem",
      justifyContent: center ? "center" : "flex-start"
    } }>
      { SubtractKeys.length && DivisorKeys.length ? "(" : "" }
      ({ CensusKeys })
      { !SubtractKeys.length ? null :
        <><Minus />({ SubtractKeys })</>
      }
      { SubtractKeys.length && DivisorKeys.length ? ")" : "" }
      { !DivisorKeys.length ? null :
        <><Divide />({ DivisorKeys })</>
      }
    </div>
  )
}
