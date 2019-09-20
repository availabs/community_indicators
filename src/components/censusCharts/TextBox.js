import React from "react"

import styled from "styled-components"

const Header = styled.div`
  font-size: 1.5rem;
`
const SubHeader = styled.div`
  font-size: 0.75rem;
  margin-top: -7px;
  margin-bottom: 5px;
`
const Body = styled.div`
  font-size: 1rem;
`
const Link = styled.a`
  font-size: 1rem;
  position: absolute;
  top: 10px;
  right: 20px;
`
export default ({ header, subheader, body, link }) =>
  <div style={ { padding: "10px 20px" } }>
    { header && <Header>{ header }</Header> }
    { subheader && <SubHeader>{ subheader }</SubHeader> }
    { body && <Body>{ body }</Body> }
    { link && <Link className="btn btn-sm btn-success" href={ link } target="_blank">Link</Link> }
  </div>
