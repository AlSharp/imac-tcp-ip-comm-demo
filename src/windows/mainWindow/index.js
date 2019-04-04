import React from 'react';
import {Provider} from 'react-redux';
import createStore from './store';
import Window from './window';

const {ipcRenderer} = window.require('electron');

const store = createStore(ipcRenderer);

const MainWindow = () =>
  <Provider store={store}>
    <Window ipcRenderer={ipcRenderer}/>
  </Provider>

export default MainWindow;