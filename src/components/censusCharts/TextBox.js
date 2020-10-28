import React from "react"

import styled from "styled-components"

const Div = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  height: calc(100%);
`

const Header = styled.div`
  font-size: 1.5rem;
  flex-grow: 0;
  margin-right: ${ props => props.hasLink ? 55 : 0 }px;
`
const SubHeader = styled.div`
  font-size: 0.75rem;
  margin-top: -7px;
  margin-bottom: 5px;
  flex-grow: 0;
`
const Body = styled.div`
  ${ props => props.theme.scrollBar };
  font-size: 1rem;
  overflow: auto;
  flex-grow: 1;
`
const Link = styled.a`
  font-size: 1rem;
  position: absolute;
  top: 10px;
  right: 10px;
`
export default ({ header, subheader, body, link }) =>
  <Div>
    { header && <Header hasLink={ Boolean(link )}>{ header }</Header> }
    { subheader && <SubHeader>{ subheader }</SubHeader> }
    { body && <Body>{ body }</Body> }
    { link && <Link className="btn btn-sm btn-success" href={ link } target="_blank">Link</Link> }
  </Div>
