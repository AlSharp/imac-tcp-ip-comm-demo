import React from 'react';
import {Provider} from 'react-redux';
import createStore from './store';
import styled from 'styled-components';

const {ipcRenderer} = window.require('electron'); 

const store = createStore(ipcRenderer);

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const Form = styled.form`

`;

const Field = styled.div`
  font-size: 14px;
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
  background-color: #F5F5F5;
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
  background-color: green;
  width: 10px;
  height: 10px;
  border-radius: 5px;
`;


const ConnectionWindow = () => (
  <Provider store={store}>
    <Content>
      <Form>
        <Field>
          <Label htmlFor="port">Port</Label>
          <Input type="text" id="port" placeholder="8888" />
        </Field>
        <Field>
          <Label htmlFor="ip">IP address</Label>
          <Input type="text" id="port" placeholder="192.168.0.254" />
        </Field>
        <ButtonDiv>
          <Button type="submit">Connect</Button>
          <Button>Close</Button>
        </ButtonDiv>
        <StatusBar>
          <Status>
            Disconnected
          </Status>
          <LED />
        </StatusBar>
      </Form>
    </Content>
  </Provider>
)

export default ConnectionWindow
