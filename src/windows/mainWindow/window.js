import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  handleInitialStateGet,
  handleSharedStateUpdate,
  handleIPConnect,
  handleIPDisconnect,
  handleIPChange,
  handleIPPortChange,
  handleUsbSerialRefresh,
  handleMotorEnable,
  handleJogActivate,
  handleASCIICommandChange,
  handleASCIICommandSubmit,
  handleParameterValueChange,
  handleMoveButtonClick,
  handleMoveAbort,
  handleJog,
  handleAxisChange
} from './actions';

const Div = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  /* box-sizing: border-box;
  border: 1px solid; */
`;

const Form = styled.form`

`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${props => props.height};
  padding: ${props => props.padding};
`;

const ConnectionMethods = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
`;

const EthernetGroupBox = ({
  isConnected,
  port, ip,
  handleIPChange,
  handleIPPortChange,
  handleIPConnect,
  handleIPDisconnect
}) => {
  const handleSubmit = event => {
    event.preventDefault();
    const port = document.getElementById('port').value;
    const ip = document.getElementById('ip').value;
    handleIPConnect({port, ip});
  }
  return(
    <Div width="200px">
      <FieldSet width="200px">
        <Legend>
          Ethernet
        </Legend>
        <Div padding="5px 15px 8px 15px">
          <Form onSubmit={handleSubmit}>
            <InputField>
              <Label htmlFor="port" width="65px">Port</Label>
              <TextInput
                type="text"
                id="port"
                placeholder="8888"
                width="99px"
                value={port}
                onChange={handleIPPortChange}
              />
            </InputField>
            <InputField>
              <Label htmlFor="ip" width="65px">IP address</Label>
              <TextInput
                type="text"
                id="ip"
                placeholder="192.168.0.254"
                width="99px"
                value={ip}
                onChange={handleIPChange}
              />
            </InputField>
            <ButtonDiv align="right">
              {
                !isConnected ?
                <Button type="submit">Connect</Button> :
                <Button
                  type="button"
                  onClick={handleIPDisconnect}
                >
                  Disconnect
                </Button>
              }
            </ButtonDiv>
          </Form>
        </Div>
      </FieldSet>
    </Div>
  )
}

const _ComPorts = ({className, comPorts}) => {
  return(
    <div className={className}>
      <select size="3">
        {
          comPorts.map(port =>
            <option
              key={port.serialNumber}
            >
              {port.path}
            </option>  
          )
        }
      </select>
    </div>
  )
}

const ComPorts = styled(_ComPorts)`
  & > select {
    font-size: 12px;
    width: 100%;
    height: 48px;
    margin: 3px 0;
  }
`;

const COMGroupBox = ({
  isConnected,
  comPorts,
  handleUsbSerialRefresh
}) => {
  return(
    <Div width="200px">
      <FieldSet width="200px">
        <Legend>
          COM port
        </Legend>
        <Div padding="5px 15px 8px 15px">
          <ComPorts
            comPorts={comPorts}
          />
          <ButtonDiv align="right">
            {
              !isConnected ?
              <Button
                margin="0"
                width="70px"
                onClick={handleUsbSerialRefresh}
              >
                Refresh
              </Button> :
              null
            }
            {
              !isConnected ?
              <Button type="submit" width="70px">Connect</Button> :
              <Button
                type="button"
                onClick={handleIPDisconnect}
              >
                Disconnect
              </Button>
            }
          </ButtonDiv>
        </Div>
      </FieldSet>
    </Div>
  )
}

const ActivateJogDiv = styled.div`
  display: inline-block;
  position: absolute;
  top: 175px;
  left: 28px;
  width: 150px;
`;

const GroupBoxDiv = styled.div`
  padding: 5px 15px;
`;

const FieldSet = styled.fieldset`
  padding: 0;
  min-width: 0;
  margin: 0;
  border-style: solid;
  border-width: 1px;
  border-color: #BFBFBF;
  border-radius: 3px;
`;

const Legend = styled.legend`
  font-size: 12px;
  margin-left: 12px;
`;

const InputField = styled.div`
  font-size: 12px;
  padding: 3px 0;
`;

const Label = styled.label`
  display: inline-block;
  width: ${props => props.width};
`;

const TextInput = styled.input`
  width: ${props => props.width};
  border-color: ${props => props.validationError && 
    props.validationError !== 'Required' ?
    'red' :
    'initial'
  };
`

const CheckboxInput = styled.input`
  margin: 0 5px 0 10px;
  vertical-align: bottom;
  position: relative;
  top: -1px;
  margin-left: ${props => props.marginLeft};
`

const SelectboxInput = props =>
  <select
    disabled={props.disabled}
    value={props.value}
    onChange={props.handleChange}
    style={{width: props.width}}
  >
    {
      props.options.map((option, index) =>
        <option value={option} key={index}>{option}</option>
      )
    }
  </select>

const ButtonDiv = styled.div`
  text-align: ${props => props.align || 'center'};
  margin: ${props => props.margin};
`;

const Button = styled.button`
  width: ${props => props.width};
  height: ${props => props.height};
  margin: ${props => props.margin || '0 0 0 20px'};
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

const JogGroupBox = props =>
  <GroupBoxDiv>
    <FieldSet disabled={props.disabled}>
      <Legend>
        Jog
      </Legend>
      <Row padding="5px 15px">
        <ButtonDiv margin="0 0 4px 215px">
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
    </FieldSet>
  </GroupBoxDiv>

const MoveGroupBox = props =>
  <GroupBoxDiv>
    <FieldSet disabled={props.disabled}>
      <Legend>
        Move
      </Legend>
      <Row padding="5px 15px">
        <Div>
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
        </Div>
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
      <Div padding="5px 15px">
        <InputField>
          <Label width="80px">Command</Label>
          <TextInput
            type="text"
            id="ascii-command"
            width="311px"
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
            width="311px"
            value={props.motorResponse}
            readOnly
          />
        </InputField>
      </Div>
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
      connectionError,
      comPorts,
      port, ip,
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
      status,
      axis,
      handleIPChange,
      handleIPPortChange,
      handleIPConnect,
      handleIPDisconnect,
      handleUsbSerialRefresh,
      handleMotorEnable,
      handleJogActivate,
      handleASCIICommandChange,
      handleASCIICommandSubmit,
      handleParameterValueChange,
      handleMoveButtonClick,
      handleMoveAbort,
      handleJog,
      handleAxisChange
    } = this.props;
    return (
      stateReceived ?
      <Div width="458px">
        <ConnectionMethods>
          <EthernetGroupBox
            isConnected={isConnected}
            connectionError={connectionError}
            port={port}
            ip={ip}
            handleIPChange={handleIPChange}
            handleIPPortChange={handleIPPortChange}
            handleIPConnect={handleIPConnect}
            handleIPDisconnect={handleIPDisconnect}
          />
          <COMGroupBox
            isConnected={isConnected}
            connectionError={connectionError}
            comPorts={comPorts}
            handleUsbSerialRefresh={handleUsbSerialRefresh}
          />
        </ConnectionMethods>
        <Row padding="7px 122px 0px 20px">
          <Div>
            <InputField>
            <Label
              width="165px"
              onClick={e => e.preventDefault()}
            >
              <CheckboxInput
                type="checkbox"
                id="enable"
                marginLeft="10px"
                disabled={!isConnected}
                checked={isMotorEnabled.includes(axis)}
                onChange={handleMotorEnable}
              />Enable motor
            </Label>
            </InputField>
          </Div>
          <Div>
            <InputField>
              <Label
                width="60px"
              >
                Axis
              </Label>
              <SelectboxInput
                width="70px"
                options={
                  Array.from({length: 16}, (value, key) => key.toString())
                }
                disabled={!isConnected}
                value={axis}
                handleChange={handleAxisChange}
              />
            </InputField>
          </Div>
        </Row>
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
                disabled={!isConnected || !isMotorEnabled.includes(axis)}
                checked={isJogActivated.includes(axis)}
                onChange={handleJogActivate}
              />Activate Jog
            </Label>
          </InputField>
        </ActivateJogDiv>
        <JogGroupBox
          disabled={!isConnected || !isMotorEnabled.includes(axis) || !isJogActivated.includes(axis)}
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
          disabled={!isConnected || !isMotorEnabled.includes(axis) || isJogActivated.includes(axis)}
          distance={distance}
          distanceError={distanceError}
          handleParameterValueChange={handleParameterValueChange}
          handleMoveButtonClick={handleMoveButtonClick}
          handleMoveAbort={handleMoveAbort}
        />
        <ASCIICommandGroupBox
          disabled={!isConnected || isJogActivated.includes(axis)}
          ASCIICommand={ASCIICommand}
          motorResponse={motorResponse}
          handleASCIICommandChange={handleASCIICommandChange}
          handleASCIICommandSubmit={handleASCIICommandSubmit}
        />
        <StatusBar>
          <Status>
            <span>Status: </span>
            {status}
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
    connectionError: state.shared.connectionError,
    comPorts: state.shared.comPorts,
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
    distanceError: state.local.distanceError,
    baudRate: state.shared.baudRate,
    status: state.shared.status,
    axis: state.shared.axis
  }
}

export default connect(
  mapStateToProps,
  {
    handleInitialStateGet,
    handleSharedStateUpdate,
    handleIPConnect,
    handleIPDisconnect,
    handleIPChange,
    handleIPPortChange,
    handleUsbSerialRefresh,
    handleMotorEnable,
    handleJogActivate,
    handleASCIICommandChange,
    handleASCIICommandSubmit,
    handleParameterValueChange,
    handleMoveButtonClick,
    handleMoveAbort,
    handleJog,
    handleAxisChange
  }
)(Window);