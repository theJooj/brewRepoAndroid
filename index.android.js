/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var LoginPage = require('./components/loginPage');

var {
  AppRegistry,
  StyleSheet,
  Navigator
} = React;

var BrewRepoAndroid = React.createClass({
  render: function() {
    return (
      <Navigator
        initialRoute={{name:'Login Page', component: LoginPage}}
        renderScene={(route, navigator) => {
          if(route.component){
            return React.createElement(route.component, { navigator, beer: route.beer, uid: route.uid })
          }
        }} />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('BrewRepoAndroid', () => BrewRepoAndroid);
