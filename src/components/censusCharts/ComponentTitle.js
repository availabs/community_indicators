import React from "react"

export default ({ title }) =>
  Boolean(title) ? <h6 style={ { padding: '8px 12px' } }>{ title }</h6> : null
