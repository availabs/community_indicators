import React from "react"

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
