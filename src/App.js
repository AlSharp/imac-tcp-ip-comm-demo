import React from 'react';
import {Switch, Route} from 'react-router-dom';
import MainWindow from './MainWindow';
import ConnectionWindow from './ConnectionWindow';

const App = () => (
  <Switch>
    <Route exact path='/' component={MainWindow} />
    <Route path='/connectionWindow' component={ConnectionWindow} />
  </Switch>
)

export default App;
