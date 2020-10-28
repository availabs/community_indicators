import React from 'react'
import CensusCharts from 'components/censusCharts/'
import TrackVisibility from 'react-on-screen';

export default props => {
  const Graph = CensusCharts[props.type] || CensusCharts['NA'],
    useCompact = window.innerWidth < 992;
  return (
    <TrackVisibility partialVisibility style={ { height: '100%' } }>
    	<Hider keepVisible={ props.type === "CensusMap" }>
        <Graph key={ props.graphId } useCompact={ useCompact } { ...props }/>
      </Hider>
    </TrackVisibility>
	)
}

const Hider = ({ isVisible, keepVisible, children }) => {
  const [show, setShow] = React.useState(isVisible);
  React.useEffect(() => {
    if (isVisible) {
      setShow(true);
    }
  }, [isVisible])
  return (keepVisible ? show : isVisible) ?
    <>{ children }</> :
    <div>Loading...</div>
}
