import React from 'react';
import { RouteHandler } from 'react-router';
import Header from '../components/header.jsx';
import '../../stylus/main.styl'


var App = React.createClass({
  
  render() {
    return (
      <div>
        <Header />
        <div className="content">
          <RouteHandler/>
        </div>
      </div>
    );
  }
  
});

module.exports = App;