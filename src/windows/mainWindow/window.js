import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  handleInitialStateGet,
  handleSharedStateUpdate
} from './actions';

const Div = styled.div`
  width: 458px;
  height: 274px;
  /* box-sizing: border-box;
  border: 1px solid; */
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const GroupBoxDiv = styled.div`
  padding: 5px 15px;
`

const FieldSet = styled.fieldset`
  width: 400px;
  margin: 0;
  border-style: solid;
  border-width: 1px;
  border-color: #BFBFBF;
  border-radius: 3px;
`

const Legend = styled.legend`
  font-size: 12px;
`

const InputListDiv = styled.div`
  
`

const InputField = styled.div`
  font-size: 12px;
  padding: 3px;
`

const Label = styled.label`
  display: inline-block;
  width: ${props => props.width};
`

const Input = styled.input`
  width: ${props => props.width};
`

const ButtonDiv = styled.div`
  width: 200px;
  text-align: center;
  line-height: 81px;
`;

const Button = styled.button`
  margin: 0 10px;
`;

const StatusBar = styled.div`
  position: relative;
  background-color: #F0F0F0;
  padding: 0 15px 3px;
  line-height: 21px;
`;

const Status = styled.span`
  font-size: 12px;
  margin-left: 6px;
`;

const LED = styled.div`
  position: absolute;
  left: 425px;
  top: 7px;
  display: inline-block;
  background-color: ${props => props.connected ? 'green' : 'red'};
  width: 10px;
  height: 10px;
  border-radius: 5px;
`;






const JogGroupBox = props =>
  <GroupBoxDiv>
    <FieldSet>
      <Legend>
        Jog
      </Legend>
      <Row>
        <InputListDiv>
          <InputField>
            <Label width="80px">Velocity</Label>
            <Input
              type="text"
              id="velocity"
              placeholder="counts/sec"
              width="100px"
            />
          </InputField>
          <InputField>
            <Label width="80px">Acceleration</Label>
            <Input
              type="text"
              id="acceleration"
              placeholder="counts/sec2"
              width="100px"
            />
          </InputField>
          <InputField>
            <Label width="80px">Deceleration</Label>
            <Input
              type="text"
              id="deceleration"
              placeholder="counts/sec2"
              width="100px"
            />
          </InputField>
        </InputListDiv>
        <ButtonDiv>
          <Button>
            Positive
          </Button>
          <Button>
            Negative
          </Button>
        </ButtonDiv>
      </Row>
      <Row>
        <InputField>
          <Label width="150px">
            <Input
              type="checkbox"
            />Activate Jog
          </Label>
        </InputField>
      </Row>
    </FieldSet>
  </GroupBoxDiv>


const ASCIICommandGroupBox = props =>
  <GroupBoxDiv>
    <FieldSet>
      <Legend>
        ASCII Command Interface
      </Legend>
      <InputListDiv>
        <InputField>
          <Label width="80px">Command</Label>
          <Input
            type="text"
            id="ascii-command"
            width="300px"
          />
        </InputField>
        <InputField>
          <Label width="80px">Response</Label>
          <Input
            type="text"
            id="response"
            width="300px"
            readOnly
          />
        </InputField>
      </InputListDiv>
    </FieldSet>
  </GroupBoxDiv>

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
    const {
      stateReceived,
      isConnected,
      port,
      ip
    } = this.props;
    return (
      stateReceived ?
      <Div>
        <JogGroupBox />
        <ASCIICommandGroupBox />
        <StatusBar>
          <Status>
            <span>Status: </span>
            {
              isConnected ?
              `Connected to ${ip}:${port}` :
              'Disconnected'
            }
          </Status>
          <LED connected={isConnected}/>
        </StatusBar>
      </Div> :
      null
    )
  }
}

const mapStateToProps = state => {
  return {
    stateReceived: state.local.stateReceived,
    isConnected: state.shared.isConnected,
    ip: state.shared.ip,
    port: state.shared.port
  }
}

export default connect(
  mapStateToProps,
  {
    handleInitialStateGet,
    handleSharedStateUpdate
  }
)(Window);