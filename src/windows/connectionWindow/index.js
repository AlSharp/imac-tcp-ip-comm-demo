import React from 'react';
import {Provider} from 'react-redux';
import createStore from './store';
import styled from 'styled-components';

const {ipcRenderer} = window.require('electron'); 

const store = createStore(ipcRenderer);

const Content = styled.div`
  width: 100%
  height: 100%
`;

const Field = props =>
  <div>
    <label htmlFor={props.label}>{props.label.toLowerCase()}</label>
    <input type="text" id={props.label.toLowerCase()} placeholder={props.placeholder}/>
  </div>

const ConnectionWindow = () => (
  <Provider store={store}>
    <Content>
      <form>
        <Field label="IP" placeholder="192.168.0.254" />
        <Field label="Port" placeholder="8888" />
        <button type="submit" className="">Connect</button>
        <button type="submit" className="">Cancel</button>
      </form>
    </Content>
  </Provider>
)

export default ConnectionWindow
