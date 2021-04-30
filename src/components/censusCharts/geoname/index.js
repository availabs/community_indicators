import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import get from 'lodash.get'

class GeoName extends React.Component{

    fetchFalcorDeps(){
      return this.props.falcor
        .get(['geo', this.props.geoids, 'name'])
    }

    render(){
        return(
            <>
              {
                this.props.geoids.map(geoid =>
                  String(get(this.props, `geo[${ geoid }].name`, ''))
                    .toUpperCase()).join(' ')
              }
            </>
        )

    }

    static defaultProps = {
        geoids: []
    }
}

const mapStateToProps = (state, props) => {
    return {
        geo: state.graph.geo || {}, // so componentWillReceiveProps will get called.
        geoids: [...get(props, "geoids", []), props.geoid].filter(Boolean)
    };
};
export default connect(mapStateToProps, null)(reduxFalcor(GeoName))
