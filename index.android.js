/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var LoginPage = require('./components/loginPage');
var styles = require('./components/styles');

var {
  AppRegistry,
  View,
  Text,
  Navigator
} = React;

var BrewRepoAndroid = React.createClass({
  render: function() {
    return (
      <Navigator
        initialRoute={{name:'Login Page', component: LoginPage}}
        configureScene={() => {
          return Navigator.SceneConfigs.HorizontalSwipeJump;
        }}
        renderScene={(route, navigator) => {
          if(route.component){
            return React.createElement(route.component, { navigator, beer: route.beer, beerList: route.beerList, uid: route.uid })
          }
        }} />
    );
  }
});

AppRegistry.registerComponent('BrewRepoAndroid', () => BrewRepoAndroid);
