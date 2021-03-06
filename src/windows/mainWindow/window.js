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
  handleUsbSerialConnect,
  handleUsbSerialDisconnect,
  handleComPortSelect,
  handleMotorEnable,
  handleJogActivate,
  handleASCIICommandChange,
  handleASCIICommandSubmit,
  handleParameterValueChange,
  handleMoveButtonClick,
  handleMoveAbort,
  handleJog,
  handleAxisChange,
  handleHome,
  handleSequenceSelect,
  handleSequenceRun,
  handleSequenceStop
} from './actions';

const getAxisState = (axes, axis) => {
  const axisState = axes.find(el => el.number === axis);
  return axisState || {
    isMotorEnabled: false, isJogActivated: false, inMotion: false,
    motorType: '',
    position: 0,
    negLimit: false,
    negSWLimit: false,
    posLimit: false,
    posSWLimit: false
  }
}

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
  flex-direction: row;
  justify-content: ${props => props.justifyContent || 'space-between'};
  text-align: ${props => props.textAlign};
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
  disabled,
  port, ip,
  inMotion,
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
      <FieldSet
        isConnected={isConnected}
        disabled={disabled}
      >
        <Legend disabled={disabled}>
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
            <Row justifyContent="flex-end" padding=" 5px 0 2px 0">
              {
                !isConnected ?
                <Button type="submit">Connect</Button> :
                <Button
                  type="button"
                  onClick={handleIPDisconnect}
                  disabled={inMotion}
                >
                  Disconnect
                </Button>
              }
            </Row>
          </Form>
        </Div>
      </FieldSet>
    </Div>
  )
}

const _ComPorts = ({className, comPorts, comPort, onChange}) => {
  return(
    <div className={className}>
      <select
        size="3"
        value={comPort}
        onChange={onChange}
      >
        {
          comPorts.map(port =>
            <option
              value={port.path}
              key={port.serialNumber}
            >
              {port.path}
            </option>  
          )
        }
        <option value='' key='empty'></option>
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
  disabled,
  comPorts,
  comPort,
  inMotion,
  handleUsbSerialRefresh,
  handleComPortSelect,
  handleUsbSerialConnect,
  handleUsbSerialDisconnect
}) => {
  return(
    <Div width="200px">
      <FieldSet width="200px"
        isConnected={isConnected}
        disabled={disabled}
      >
        <Legend disabled={disabled}>
          USB-to-Serial
        </Legend>
        <Div padding="5px 15px 8px 15px">
          <ComPorts
            comPorts={comPorts}
            comPort={comPort}
            onChange={handleComPortSelect}
          />
          <Row justifyContent="space-between" padding="5px 0 2px 0">
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
              <Button
                type="submit"
                width="70px"
                margin="0 0 0 28px"
                disabled={!comPort.length}
                onClick={handleUsbSerialConnect}
              >
                Connect
              </Button> :
              <Button
                type="button"
                onClick={handleUsbSerialDisconnect}
                disabled={inMotion}
              >
                Disconnect
              </Button>
            }
          </Row>
        </Div>
      </FieldSet>
    </Div>
  )
}

const GroupBoxDiv = styled.div`
  padding: 5px 15px;
`;

const FieldSet = styled.fieldset`
  padding: 0;
  min-width: 0;
  margin: 0;
  border-style: solid;
  border-width: 1px;
  border-color: ${props => props.isConnected ? '#5f8e78' : '#BFBFBF'};
  border-radius: 3px;
`;

const Legend = styled.legend`
  font-size: 12px;
  color: ${props => props.disabled ? 'graytext' : 'inherit'};
  margin-left: 12px;
`;

const InputField = styled.div`
  font-size: 12px;
  padding: ${props => props.padding || '3px 0'};
  text-align: ${props => props.textAlign};
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

const SelectboxInput = ({disabled, value, onChange, width, options}) =>
  <select
    disabled={disabled}
    value={value}
    onChange={onChange}
    style={{width: width}}
  >
    {
      options.map((option, index) =>
        <option value={option} key={index}>{option}</option>
      )
    }
  </select>

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.justifyContent || 'left'};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
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
  background-color: ${props => props.active ? 'green' : 'red'};
  width: 10px;
  height: 10px;
  border-radius: 5px;
`;

const InputLED = styled.div`
  display: inline-block;
  background-color: ${props => props.active ? 'red' : 'green'};
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin: ${props => props.margin};
`;

const required = value => value.length ? undefined : 'Required';

const shouldBeInteger = value => {
  const val = Math.floor(Number(value));
  return val !== Infinity && String(val) === value ?
    undefined : 'Should be integer';
}

const shouldBePositive = value => +value >= 0 ? undefined : 'Should not be negative';

const GroupBoxContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'space-between'};
  padding: 0;
`;

const HomeGroupBox = ({
  disabled,
  inMotion,
  handleHome, handleMoveAbort
}) =>
  <GroupBoxDiv>
    <FieldSet disabled={disabled}>
      <Legend>
        Home
      </Legend>
      <Row padding="24px 15px 26px 15px">
        <Button
          width="70px"
          margin="0"
          onClick={handleHome}
          disabled={inMotion}
        >
          Home
        </Button>
        <Button
          width="70px"
          margin="0"
          onClick={handleMoveAbort}
        >
          Abort
        </Button>
      </Row>
    </FieldSet>
  </GroupBoxDiv>

const JogGroupBox = ({
  isConnected,
  axes,
  axis,
  disabled,
  jogVelocity,
  jogVelocityError,
  handleParameterValueChange,
  handleJogActivate,
  handleJog,
  handleMoveAbort
}) =>
  <GroupBoxDiv width="200px">
    <FieldSet disabled={disabled}>
      <Legend>
          <CheckboxInput
            type="checkbox"
            id="activate-jog"
            marginLeft="0"
            disabled={!isConnected || !getAxisState(axes, axis).isMotorEnabled || getAxisState(axes, axis).inMotion}
            checked={getAxisState(axes, axis).isJogActivated}
            onChange={handleJogActivate}
          />
          Jog
      </Legend>
      <Row padding="3px 15px 0px 15px">
        <InputField>
          <Label width="65px">Jog velocity</Label>
          <TextInput
            type="text"
            id="jogVelocity"
            placeholder="counts/sec"
            width="100px"
            value={jogVelocity}
            validationError={jogVelocityError}
            onChange={e => handleParameterValueChange(
              e,
              'jogVelocity',
              [required, shouldBeInteger, shouldBePositive]
              )
            }
          />
        </InputField>
      </Row>
      <Row padding="10px 15px 10px 15px">
        <Button
          width="70px"
          margin="0"
          onMouseDown={e => handleJog('positive')}
          onMouseLeave={handleMoveAbort}
          onMouseUp={handleMoveAbort}
          disabled={!jogVelocity.length || jogVelocityError}
        >
          Positive
        </Button>
        <Button
          width="70px"
          margin="0"
          onMouseDown={e => handleJog('negative')}
          onMouseLeave={handleMoveAbort}
          onMouseUp={handleMoveAbort}
          disabled={!jogVelocity.length || jogVelocityError}
        >
          Negative
        </Button>
      </Row>
    </FieldSet>
  </GroupBoxDiv>

const MoveGroupBox = ({
  disabled, inMotion,
  distance, distanceError,
  velocity, velocityError,
  acceleration, accelerationError,
  deceleration, decelerationError,
  handleParameterValueChange,
  handleMoveButtonClick,
  handleMoveAbort
}) =>
  <GroupBoxDiv>
    <FieldSet disabled={disabled}>
      <Legend>
        Move
      </Legend>
      <Row padding="3px 15px 0px 15px">
        <InputField>
          <Label width="65px">Distance</Label>
          <TextInput
            type="text"
            id="distance"
            placeholder="counts"
            width="100px"
            value={distance}
            validationError={distanceError}
            onChange={e => handleParameterValueChange(
              e,
              'distance',
              [required, shouldBeInteger]
              )
            }
          />
        </InputField>
      </Row>
      <Row padding="3px 15px 0px 15px">
        <InputField>
          <Label width="65px">Velocity</Label>
          <TextInput
            type="text"
            id="velocity"
            placeholder="counts/sec"
            width="100px"
            value={velocity}
            validationError={velocityError}
            onChange={e => handleParameterValueChange(
              e,
              'velocity',
              [required, shouldBeInteger, shouldBePositive]
              )
            }
          />
        </InputField>
      </Row>
      <Row padding="3px 15px 0px 15px">
        <InputField>
          <Label width="65px">Accel</Label>
          <TextInput
            type="text"
            id="accel"
            placeholder="counts/sec²"
            width="100px"
            value={acceleration}
            validationError={accelerationError}
            onChange={e => handleParameterValueChange(
              e,
              'acceleration',
              [required, shouldBeInteger, shouldBePositive]
              )
            }
          />
        </InputField>
      </Row>
      <Row padding="3px 15px 0px 15px">
        <InputField>
          <Label width="65px">Decel</Label>
          <TextInput
            type="text"
            id="decel"
            placeholder="counts/sec²"
            width="100px"
            value={deceleration}
            validationError={decelerationError}
            onChange={e => handleParameterValueChange(
              e,
              'deceleration',
              [required, shouldBeInteger, shouldBePositive]
              )
            }
          />
        </InputField>
      </Row>
      <Row padding="10px 15px 10px 15px">
        <Button
          width="70px"
          margin="0"
          onClick={handleMoveButtonClick}
          disabled={
            inMotion ||
            !distance.length ||
            distanceError ||
            !velocity.length ||
            velocityError ||
            !acceleration.length ||
            accelerationError ||
            !deceleration.length ||
            decelerationError
          }
        >
          Move
        </Button>
        <Button
          width="70px"
          margin="0"
          onClick={handleMoveAbort}
        >
          Abort
        </Button>
      </Row>
    </FieldSet>
  </GroupBoxDiv>

const LimitSensorsGroupBox = ({
  negLimit, posLimit, negSWLimit, posSWLimit
}) =>
  <GroupBoxDiv>
    <FieldSet>
      <Legend>
        Limit sensors
      </Legend>
      <Row padding="5px 15px">
        <Div>
          <InputField textAlign="left">
            <InputLED active={negLimit} margin="0 4px 0 0" />
            <Label>Neg. limit</Label>
          </InputField>
          <InputField textAlign="left">
            <InputLED active={negSWLimit} margin="0 4px 0 0" />
            <Label>Neg. SW limit</Label>
          </InputField>
        </Div>
        <Div>
          <InputField textAlign="right">
            <Label>Pos. limit</Label>
            <InputLED active={posLimit} margin="0 0 0 4px" />
          </InputField>
          <InputField textAlign="right">
            <Label>Pos. SW limit</Label>
            <InputLED active={posSWLimit} margin="0 0 0 4px" />
          </InputField>
        </Div>
      </Row>
    </FieldSet>
  </GroupBoxDiv>

const ASCIICommandGroupBox = ({
  disabled, inMotion,
  ASCIICommand, motorResponse,
  handleASCIICommandChange,
  handleASCIICommandSubmit
}) =>
  <GroupBoxDiv>
    <FieldSet disabled={disabled || inMotion}>
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
            value={ASCIICommand}
            onChange={handleASCIICommandChange}
            onKeyDown={handleASCIICommandSubmit}
          />
        </InputField>
        <InputField>
          <Label width="80px">Response</Label>
          <TextInput
            type="text"
            id="response"
            width="311px"
            value={motorResponse}
            readOnly
          />
        </InputField>
      </Div>
    </FieldSet>
  </GroupBoxDiv>

const SequenceRunSelector = ({
  disabled,
  inSequenceExecution,
  sequenceNumber,
  onSelect,
  onRun,
  onStop
}) =>
  <GroupBoxDiv>
    <FieldSet disabled={disabled}>
      <Legend>
        Sequences
      </Legend>
      <Row padding="5px 15px 7px 15px">
        <InputField>
          <Label width="80px">Sequence</Label>
          <SelectboxInput
            width="102px"
            options={[1, 2, 3, 4, 5]}
            disabled={false}
            value={sequenceNumber}
            onChange={onSelect}
          />
        </InputField>
        <ButtonDiv>
          <Button
            width="70px"
            margin="0 28px 0 0"
            onClick={onRun}
            disabled={inSequenceExecution}
          >
            Run
          </Button>
          <Button
            width="70px"
            margin="0"
            onClick={onStop}
            disabled={!inSequenceExecution}
          >
            Stop
          </Button>
        </ButtonDiv>
      </Row>
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
      connectionType,
      connectionError,
      comPorts,
      comPort,
      port, ip,
      axes,
      axis,
      ASCIICommand,
      motorResponse,
      distance,
      distanceError,
      velocity,
      velocityError,
      jogVelocity,
      jogVelocityError,
      acceleration,
      accelerationError,
      deceleration,
      decelerationError,
      status,
      sequenceNumber,
      inSequenceExecution,
      handleIPChange,
      handleIPPortChange,
      handleIPConnect,
      handleIPDisconnect,
      handleUsbSerialRefresh,
      handleUsbSerialConnect,
      handleUsbSerialDisconnect,
      handleComPortSelect,
      handleMotorEnable,
      handleJogActivate,
      handleASCIICommandChange,
      handleASCIICommandSubmit,
      handleParameterValueChange,
      handleMoveButtonClick,
      handleMoveAbort,
      handleJog,
      handleAxisChange,
      handleHome,
      handleSequenceSelect,
      handleSequenceRun,
      handleSequenceStop
    } = this.props;
    return (
      stateReceived ?
      <Div width="458px">
        <ConnectionMethods>
          <EthernetGroupBox
            isConnected={isConnected && connectionType === 'ethernet'}
            disabled={connectionType !== 'ethernet' && connectionType.length}
            connectionError={connectionError}
            port={port}
            ip={ip}
            inMotion={getAxisState(axes, axis).inMotion}
            handleIPChange={handleIPChange}
            handleIPPortChange={handleIPPortChange}
            handleIPConnect={handleIPConnect}
            handleIPDisconnect={handleIPDisconnect}
          />
          <COMGroupBox
            isConnected={isConnected && connectionType === 'usbserial'}
            disabled={connectionType !== 'usbserial' && connectionType.length}
            connectionError={connectionError}
            comPorts={comPorts}
            comPort={comPort}
            inMotion={getAxisState(axes, axis).inMotion}
            handleUsbSerialRefresh={handleUsbSerialRefresh}
            handleComPortSelect={handleComPortSelect}
            handleUsbSerialConnect={handleUsbSerialConnect}
            handleUsbSerialDisconnect={handleUsbSerialDisconnect}
          />
        </ConnectionMethods>
        <Row padding="7px 30px 0px 20px">
          <Div>
            <InputField>
              <Label
                width="100px"
                onClick={e => e.preventDefault()}
              >
                <CheckboxInput
                  type="checkbox"
                  id="enable"
                  marginLeft="10px"
                  disabled={!isConnected || getAxisState(axes, axis).inMotion || inSequenceExecution}
                  checked={getAxisState(axes, axis).isMotorEnabled}
                  onChange={handleMotorEnable}
                />Enable motor
              </Label>
            </InputField>
          </Div>
          <Div>
            <InputField>
              <Label
                width="70px"
              >
                Motor type:
              </Label>
              <TextInput
                type="text"
                id="motor-type"
                width="80px"
                value={getAxisState(axes, axis).motorType}
                disabled
              />
            </InputField>
          </Div>
          <Div>
            <InputField>
              <Label
                width="30px"
              >
                Axis:
              </Label>
              <SelectboxInput
                width="70px"
                options={axes.map(axis => axis.number)}
                disabled={!isConnected || getAxisState(axes, axis).inMotion || inSequenceExecution}
                value={axis}
                onChange={handleAxisChange}
              />
            </InputField>
          </Div>
        </Row>
        <GroupBoxContainer>
          <MoveGroupBox
            disabled={!isConnected || !getAxisState(axes, axis).isMotorEnabled || getAxisState(axes, axis).isJogActivated || inSequenceExecution}
            inMotion={getAxisState(axes, axis).inMotion}
            distance={distance}
            distanceError={distanceError}
            velocity={velocity}
            velocityError={velocityError}
            acceleration={acceleration}
            accelerationError={accelerationError}
            deceleration={deceleration}
            decelerationError={decelerationError}
            handleParameterValueChange={handleParameterValueChange}
            handleMoveButtonClick={handleMoveButtonClick}
            handleMoveAbort={handleMoveAbort}
          />
          <GroupBoxContainer flexDirection="column">
            <JogGroupBox
              isConnected={isConnected}
              axes={axes}
              axis={axis}
              disabled={!isConnected || !getAxisState(axes, axis).isMotorEnabled || !getAxisState(axes, axis).isJogActivated || inSequenceExecution}
              jogVelocity={jogVelocity}
              jogVelocityError={jogVelocityError}
              handleParameterValueChange={handleParameterValueChange}
              handleJogActivate={handleJogActivate}
              handleJog={handleJog}
              handleMoveAbort={handleMoveAbort}
            />
            <Row padding="0px 15px 0px 30px">
              <InputField>
                <Label width="65px">Position</Label>
                <TextInput
                  type="text"
                  id="position"
                  placeholder="counts"
                  width="100px"
                  value={getAxisState(axes, axis).position}
                  disabled
                />
              </InputField>
            </Row>
            <HomeGroupBox
              disabled={!isConnected || !getAxisState(axes, axis).isMotorEnabled || getAxisState(axes, axis).isJogActivated || inSequenceExecution}
              inMotion={getAxisState(axes, axis).inMotion}
              handleHome={handleHome}
              handleMoveAbort={handleMoveAbort}
            />
          </GroupBoxContainer>
        </GroupBoxContainer>
        <LimitSensorsGroupBox
          negLimit={getAxisState(axes, axis).negLimit}
          negSWLimit={getAxisState(axes, axis).negSWLimit}
          posLimit={getAxisState(axes, axis).posLimit}
          posSWLimit={getAxisState(axes, axis).posSWLimit}
        />
        <ASCIICommandGroupBox
          disabled={!isConnected || getAxisState(axes, axis).isJogActivated}
          inMotion={getAxisState(axes, axis).inMotion || inSequenceExecution}
          ASCIICommand={ASCIICommand}
          motorResponse={motorResponse}
          handleASCIICommandChange={handleASCIICommandChange}
          handleASCIICommandSubmit={handleASCIICommandSubmit}
        />
        <SequenceRunSelector
          disabled={getAxisState(axes, axis).isJogActivated || !getAxisState(axes, axis).isMotorEnabled || getAxisState(axes, axis).inMotion}
          inSequenceExecution={inSequenceExecution}
          sequenceNumber={sequenceNumber}
          onSelect={handleSequenceSelect}
          onRun={handleSequenceRun}
          onStop={handleSequenceStop}
        />
        <StatusBar>
          <Status>
            <span>Status: </span>
            {status}
          </Status>
          <LED active={isConnected}/>
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
    connectionType: state.shared.connectionType,
    connectionError: state.shared.connectionError,
    comPorts: state.shared.comPorts,
    comPort: state.shared.comPort,
    ip: state.shared.ip,
    port: state.shared.port,
    ASCIICommand: state.local.ASCIICommand,
    motorResponse: state.shared.motorResponse,
    distance: state.local.distance,
    distanceError: state.local.distanceError,
    velocity: state.local.velocity,
    velocityError: state.local.velocityError,
    jogVelocity: state.local.jogVelocity,
    jogVelocityError: state.local.jogVelocityError,
    acceleration: state.local.acceleration,
    accelerationError: state.local.accelerationError,
    deceleration: state.local.deceleration,
    decelerationError: state.local.decelerationError,
    status: state.shared.status,
    axis: state.shared.axis,
    axes: state.shared.axes,
    sequenceNumber: state.local.sequenceNumber,
    inSequenceExecution: state.shared.inSequenceExecution
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
    handleUsbSerialConnect,
    handleUsbSerialDisconnect,
    handleComPortSelect,
    handleMotorEnable,
    handleJogActivate,
    handleASCIICommandChange,
    handleASCIICommandSubmit,
    handleParameterValueChange,
    handleMoveButtonClick,
    handleMoveAbort,
    handleJog,
    handleAxisChange,
    handleHome,
    handleSequenceSelect,
    handleSequenceRun,
    handleSequenceStop
  }
)(Window);