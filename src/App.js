import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MainWindow from './windows/mainWindow';
import ConnectionWindow from './windows/connectionWindow';

class App extends Component {

  static Views() {
    return {
      main: <MainWindow />,
      connectionWindow: <ConnectionWindow />
    }
  }

  static View(props) {
    let name = props.location.search.substr(1);
    let view = App.Views()[name];
    if (view == null) {
      throw new Error(`View ${name} is undefined`);
    }
    return view;
  }

  render() {
    return(
      <Router>
        <Route path='/' component={App.View} />
      </Router>
    )
  }

}

export default App;
