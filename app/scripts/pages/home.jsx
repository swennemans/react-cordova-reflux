import React from 'react';
import ItemList from '../components/itemList.jsx';

var Home = React.createClass({

  render() {
    return (
      <div className="home">
        <h1>Home</h1>
        <ItemList />
      </div>
    );
  }

});

module.exports = Home;
