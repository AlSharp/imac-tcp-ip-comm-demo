import React, {Component} from 'react';
import {Provider} from 'react-redux';
import createStore from './store';
import styled from 'styled-components';

const {ipcRenderer} = window.require('electron');

const store = createStore(ipcRenderer);

const Content = styled.div`
  width: 100%;
  height: 100%;
  margin-top: -21px;
`;

class MainWindow extends Component {
  render() {
    return (
      <Provider store={store}>
        <Content>
          <h1>IMAC TCP Client main window</h1>
        </Content>
      </Provider>
    )
  }
}

export default MainWindow;