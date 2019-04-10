import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  handleInitialStateGet,
  handleSharedStateUpdate
} from './actions';

const Div = styled.div`
  width: 100%;
  height: 100%;
  margin-top: -21px;
`;

class Window extends Component {
  
  componentDidMount() {
    // get initial state on window open
    this.props.handleInitialStateGet();
    
    // get updated shared state
    this.props.ipcRenderer.on('shared::update', (e, sharedState) => {
      this.props.handleSharedStateUpdate(sharedState);
    })
  }

  render() {
    return (
      this.props.stateReceived ?
      <Div>
        <h1>IMAC TCP Client</h1>
      </Div> :
      null
    )
  }
}

const mapStateToProps = state => {
  return {
    stateReceived: state.local.stateReceived
  }
}

export default connect(
  mapStateToProps,
  {
    handleInitialStateGet,
    handleSharedStateUpdate
  }
)(Window);