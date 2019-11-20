import React from 'react'
import CensusCharts from 'components/censusCharts/'
import TrackVisibility from 'react-on-screen';

export default ({ graph, ...rest }) => {
    const graphType = graph.type.split(' ').join(''),
        Graph = CensusCharts[graphType] || CensusCharts['NA']
    return (
        <TrackVisibility partialVisibility style={ { height: '100%' } }>
        	<GraphHider Graph={ Graph } { ...rest } graph={ graph }/>
        </TrackVisibility>
	)
}



class GraphHider extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            show: Boolean(props.isVisible)
        }
    }

    componentDidUpdate(prevProps, prevState) {
    	if(this.props.isVisible && !this.state.show) {
    		this.setState({show:true})
    	}
    }

    render () {
    	const { isVisible, Graph, graph, ...rest } = this.props;
    	return (rest.type === "CensusMap" ? this.state.show : isVisible) ?
		    <Graph { ...rest } { ...graph } /> :
		    <div>Loading...</div>
    }
}
