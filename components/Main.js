'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var SearchPage = require('./searchPage');
var BeerList = require('./beerList');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableHighlight,
  BackAndroid,
  Image
} = React;

var Main = React.createClass({
  componentDidMount: function() {
    console.log("I mounted!");
  },
  render: function(){
    return (
      <ScrollableTabView>
        <BeerList navigator={this.props.navigator} tabLabel="List" />
        <SearchPage navigator={this.props.navigator} tabLabel="Search" />
      </ScrollableTabView>
    );
  }
});

module.exports = Main;
