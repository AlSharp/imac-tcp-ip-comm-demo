import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  handleInitialStateGet,
  handleSharedStateUpdate,
  handleMotorEnable,
  handleJogActivate,
  handleASCIICommandChange,
  handleASCIICommandSubmit,
  handleParameterValueChange,
  handleMoveButtonClick,
  handleMoveAbort,
  handleJog
} from './actions';

const Div = styled.div`
  width: 458px;
  /* box-sizing: border-box;
  border: 1px solid; */
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${props => props.height};
`

const EnableDiv = styled.div`
  padding: 5px 15px;
`

const ActivateJogDiv =styled.div`
  display: inline-block;
  position: absolute;
  top: 140px;
  left: 28px;
  width: 150px;
`;

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

const TextInput = styled.input`
  width: ${props => props.width};
  border-color: ${props => props.validationError && 
    props.validationError !== 'Required' ?
    'red' :
    'initial'
  }
`

const CheckboxInput = styled.input`
  margin: 0 5px 0 10px;
  vertical-align: bottom;
  position: relative;
  top: -1px;
  margin-left: ${props => props.marginLeft};
`

const ButtonDiv = styled.div`
  // width: 200px;
  text-align: center;
  line-height: ${props => props.lineHeight};
`;

const Button = styled.button`
  width: ${props => props.width};
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

const required = value => value ? undefined : 'Required';

const shouldBeInteger = value => {
  const val = Math.floor(Number(value));
  return val !== Infinity && String(val) === value ?
    undefined : 'Should be integer';
}

const shouldBePositiveInteger = value => {
  const val = Math.floor(Number(value));
  return val !== Infinity && String(val) === value && val >= 0 ?
    undefined : 'Should be positive integer';
}



const JogGroupBox = props =>
  <GroupBoxDiv>
    <FieldSet disabled={props.disabled}>
      <Legend>
        Jog
      </Legend>
      <Row>
        <InputListDiv>
          <InputField>
            <Label width="80px">Velocity</Label>
            <TextInput
              type="text"
              id="velocity"
              placeholder="counts/sec"
              width="100px"
              value={props.velocity}
              validationError={props.velocityError}
              onChange={e => props.handleParameterValueChange(
                e,
                'velocity',
                [required, shouldBePositiveInteger]
                )
              }
            />
          </InputField>
          <InputField>
            <Label width="80px">Acceleration</Label>
            <TextInput
              type="text"
              id="acceleration"
              placeholder="counts/sec2"
              width="100px"
              value={props.acceleration}
              validationError={props.accelerationError}
              onChange={e => props.handleParameterValueChange(
                e,
                'acceleration',
                [required, shouldBePositiveInteger]
                )
              }
            />
          </InputField>
          <InputField>
            <Label width="80px">Deceleration</Label>
            <TextInput
              type="text"
              id="deceleration"
              placeholder="counts/sec2"
              width="100px"
              value={props.deceleration}
              validationError={props.decelerationError}
              onChange={e => props.handleParameterValueChange(
                e,
                'deceleration',
                [required, shouldBePositiveInteger]
                )
              }
            />
          </InputField>
        </InputListDiv>
        <ButtonDiv lineHeight="81px">
          <Button
            width="70px"
            onMouseDown={e => props.handleJog('positive')}
            onMouseUp={props.handleMoveAbort}
          >
            Positive
          </Button>
          <Button
            width="70px"
            onMouseDown={e => props.handleJog('negative')}
            onMouseUp={props.handleMoveAbort}
          >
            Negative
          </Button>
        </ButtonDiv>
      </Row>
      {/* Make a room for Activate check box */}
      <Row height="22px" /> 
    </FieldSet>
  </GroupBoxDiv>

const MoveGroupBox = props =>
  <GroupBoxDiv>
    <FieldSet disabled={props.disabled}>
      <Legend>
        Move
      </Legend>
      <Row>
        <InputListDiv>
          <InputField>
            <Label width="80px">Distance</Label>
            <TextInput
              type="text"
              id="distance"
              placeholder="counts"
              width="100px"
              value={props.distance}
              validationError={props.distanceError}
              onChange={e => props.handleParameterValueChange(
                e,
                'distance',
                [required, shouldBeInteger]
                )
              }
            />
          </InputField>
        </InputListDiv>
        <ButtonDiv>
          <Button
            width="70px"
            onClick={props.handleMoveButtonClick}
          >
            Move
          </Button>
          <Button
            width="70px"
            onClick={props.handleMoveAbort}
          >
            Abort
          </Button>
        </ButtonDiv>
      </Row>
    </FieldSet>
  </GroupBoxDiv>


const ASCIICommandGroupBox = props =>
  <GroupBoxDiv>
    <FieldSet disabled={props.disabled}>
      <Legend>
        ASCII Command Interface
      </Legend>
      <InputListDiv>
        <InputField>
          <Label width="80px">Command</Label>
          <TextInput
            type="text"
            id="ascii-command"
            width="300px"
            value={props.ASCIICommand}
            onChange={props.handleASCIICommandChange}
            onKeyDown={props.handleASCIICommandSubmit}
          />
        </InputField>
        <InputField>
          <Label width="80px">Response</Label>
          <TextInput
            type="text"
            id="response"
            width="300px"
            value={props.motorResponse}
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
      ip,
      isMotorEnabled,
      isJogActivated,
      ASCIICommand,
      motorResponse,
      velocity,
      velocityError,
      acceleration,
      accelerationError,
      deceleration,
      decelerationError,
      distance,
      distanceError,
      handleMotorEnable,
      handleJogActivate,
      handleASCIICommandChange,
      handleASCIICommandSubmit,
      handleParameterValueChange,
      handleMoveButtonClick,
      handleMoveAbort,
      handleJog
    } = this.props;
    return (
      stateReceived ?
      <Div>
        <EnableDiv>
          <InputField>
          <Label
            width="150px"
            onClick={e => e.preventDefault()}
          >
            <CheckboxInput
              type="checkbox"
              id="enable"
              marginLeft="10px"
              disabled={!isConnected}
              checked={isMotorEnabled}
              onChange={handleMotorEnable}
            />Enable motor
          </Label>
          </InputField>
        </EnableDiv>
        <ActivateJogDiv>
          <InputField>
            <Label
              width="150px"
              onClick={e => e.preventDefault()}
            >
              <CheckboxInput
                type="checkbox"
                id="activate-jog"
                marginLeft="0"
                disabled={!isConnected || !isMotorEnabled}
                checked={isJogActivated}
                onChange={handleJogActivate}
              />Activate Jog
            </Label>
          </InputField>
        </ActivateJogDiv>
        <JogGroupBox
          disabled={!isConnected || !isMotorEnabled || !isJogActivated}
          velocity={velocity}
          velocityError={velocityError}
          acceleration={acceleration}
          accelerationError={accelerationError}
          deceleration={deceleration}
          decelerationError={decelerationError}
          handleParameterValueChange={handleParameterValueChange}
          handleJog={handleJog}
          handleMoveAbort={handleMoveAbort}
        />
        <MoveGroupBox
          disabled={!isConnected || !isMotorEnabled || isJogActivated}
          distance={distance}
          distanceError={distanceError}
          handleParameterValueChange={handleParameterValueChange}
          handleMoveButtonClick={handleMoveButtonClick}
          handleMoveAbort={handleMoveAbort}
        />
        <ASCIICommandGroupBox
          disabled={!isConnected || isJogActivated}
          ASCIICommand={ASCIICommand}
          motorResponse={motorResponse}
          handleASCIICommandChange={handleASCIICommandChange}
          handleASCIICommandSubmit={handleASCIICommandSubmit}
        />
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
    port: state.shared.port,
    isMotorEnabled: state.shared.isMotorEnabled,
    isJogActivated: state.shared.isJogActivated,
    ASCIICommand: state.local.ASCIICommand,
    motorResponse: state.shared.motorResponse,
    velocity: state.local.velocity,
    velocityError: state.local.velocityError,
    acceleration: state.local.acceleration,
    accelerationError: state.local.accelerationError,
    deceleration: state.local.deceleration,
    decelerationError: state.local.decelerationError,
    distance: state.local.distance,
    distanceError: state.local.distanceError
  }
}

export default connect(
  mapStateToProps,
  {
    handleInitialStateGet,
    handleSharedStateUpdate,
    handleMotorEnable,
    handleJogActivate,
    handleASCIICommandChange,
    handleASCIICommandSubmit,
    handleParameterValueChange,
    handleMoveButtonClick,
    handleMoveAbort,
    handleJog
  }
)(Window);