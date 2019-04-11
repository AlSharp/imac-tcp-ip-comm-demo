import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  handleInitialStateGet,
  handleSharedStateUpdate,
  handleConnectButtonClick,
  handleDisconnectButtonClick,
  handleIPChange,
  handlePortChange
} from './actions';

const Div = styled.div`
  width: 226px;
  height: 124px;
`;

const Form = styled.form`

`;

const Field = styled.div`
  font-size: 12px;
  padding: 6px 6px;
`;

const Label = styled.label`
  display: inline-block;
  width: 90px;
`;

const Input = styled.input`
  width: 120px;
`;

const ButtonDiv = styled.div`
  text-align: center;
  padding: 6px 0px;
`;

const Button = styled.button`
  margin: 0px 4px;
`;

const StatusBar = styled.div`
  position: relative;
  background-color: #F0F0F0;
  line-height: 21px;
`;

const Status = styled.span`
  font-size: 12px;
  margin-left: 6px;
`;

const LED = styled.div`
  position: absolute;
  left: 210px;
  top: 7px;
  display: inline-block;
  background-color: ${props => props.connected ? 'green' : 'red'};
  width: 10px;
  height: 10px;
  border-radius: 5px;
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

  handleSubmit(e) {
    e.preventDefault();
    const port = document.getElementById('port').value;
    const ip = document.getElementById('ip').value;
    this.props.handleConnectButtonClick({port, ip});
  }

  getErrorStatus = errorCode =>
    errorCode === 'ETIMEDOUT' ? 'Timeout' :
    errorCode === 'ECONNREFUSED' ? 'Refused by remote host' :
    errorCode === 'ECONNABORTED' ? 'Was aborted' :
    'Unexpected error'

  handleCloseButtonClick() {
    window.require('electron').remote
      .getCurrentWindow()
      .close();
  }

  render() {
    const {
      stateReceived,
      isConnected,
      connectionError,
      port,
      ip,
      handleIPChange,
      handlePortChange,
      handleDisconnectButtonClick
    } = this.props;
    return (
      stateReceived ?
      <Div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Field>
            <Label htmlFor="port">Port</Label>
            <Input
              type="text"
              id="port"
              placeholder="8888"
              value={port}
              onChange={handlePortChange}
            />
          </Field>
          <Field>
            <Label htmlFor="ip">IP address</Label>
            <Input
              type="text"
              id="ip"
              placeholder="192.168.0.254"
              value={ip}
              onChange={handleIPChange}
            />
          </Field>
          <ButtonDiv>
            {
              !isConnected ?
              <Button type="submit">Connect</Button> :
              <Button
                type="button"
                onClick={handleDisconnectButtonClick}
              >
                Disconnect
              </Button>
            }
            <Button
              type="button"
              onClick={this.handleCloseButtonClick.bind(this)}
            >
              Close
            </Button>
          </ButtonDiv>
          <StatusBar>
            <Status>
              {
                isConnected ?
                `Connected to ${ip}:${port}` :
                connectionError.length > 0 ?
                this.getErrorStatus(connectionError) :
                'Disconnected'
              }
            </Status>
            <LED connected={isConnected}/>
          </StatusBar>
        </Form>
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
    port: state.shared.port,
    ip: state.shared.ip
  }
}

export default connect(
  mapStateToProps,
  {
    handleInitialStateGet,
    handleSharedStateUpdate,
    handleConnectButtonClick,
    handleDisconnectButtonClick,
    handleIPChange,
    handlePortChange
  }
)(Window);