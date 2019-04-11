import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  handleInitialStateGet,
  handleSharedStateUpdate
} from './actions';

const Div = styled.div`
  width: 600px;
  height: 500px;
  box-sizing: border-box;
  border: 1px solid;
`;

const JogGroupBoxDiv = styled.div`
  width: 400px;
  height: 200px;
  padding: 5px 10px;
`

const JogGroupBoxFieldSet = styled.fieldset`
  width: 100%;
  height: 100%;
  border-style: solid;
  border-width: 1px;
  border-color: #BFBFBF;
  border-radius: 3px;
`

const JogGroupBoxLegend = styled.legend`
  font-size: 12px;
`

const InputListDiv = styled.div`
  display: inline-block;
`

const InputField = styled.div`
  font-size: 12px;
  padding: 3px;
`

const Label = styled.label`
  display: inline-block;
  width: 80px;
`

const Input = styled.input`
  width: 100px;
`


const JogGroupBox = props =>
  <JogGroupBoxDiv>
    <JogGroupBoxFieldSet>
      <JogGroupBoxLegend>
        Jog
      </JogGroupBoxLegend>
      <InputListDiv>
        <InputField>
          <Label>Velocity</Label>
          <Input
            type="text"
            id="velocity"
            placeholder="counts/sec"
          />
        </InputField>
        <InputField>
          <Label>Acceleration</Label>
          <Input
            type="text"
            id="acceleration"
            placeholder="counts/sec2"
          />
        </InputField>
        <InputField>
          <Label>Deceleration</Label>
          <Input
            type="text"
            id="deceleration"
            placeholder="counts/sec2"
          />
        </InputField>
      </InputListDiv>
    </JogGroupBoxFieldSet>
  </JogGroupBoxDiv>

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
        <JogGroupBox />
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