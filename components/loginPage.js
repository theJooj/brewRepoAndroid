'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var beerListRef = new Firebase('https://fiery-fire-7334.firebaseio.com');
var localStorage = require('react-native-simple-store');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight
} = React;

var BeerList = require('./beerList');

var LoginPage = React.createClass({

  getInitialState: function() {
    return {
      email: '',
      password: ''
    };
  },

  componentDidMount: function() {
    var self = this;
    //check for uid in local storage
    localStorage.get('brAuthToken').then((token) => {
      //if token exists, use it to log in and return the uid
      if(token){
        beerListRef.authWithCustomToken(token, function(error, authData){
          self.props.navigator.replace({
            name: 'Beer List',
            component: BeerList,
            uid: authData.uid
          });
        });
      }
    });
  },

  _handleEmailChange: function(e){
    this.setState({
      email: e.nativeEvent.text
    });
  },

  _handlePasswordChange: function(e){
    this.setState({
      password: e.nativeEvent.text
    });
  },

  _handleCreateAccount: function(){
    var self = this;
    //create new user
    beerListRef.createUser({
      email: this.state.email,
      password: this.state.password
    }, function(error, userData){
      if(error){
        console.log("Error creating user: ", error);
      } else {
        console.log("Successfully created user account with uid: ", userData.uid);

        //then log the user in
        beerListRef.authWithPassword({
          email: self.state.email,
          password: self.state.password
        }, function(error, authData){
          if(error){
            console.log("Login failed: ", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);

            //save uid to local storage
            localStorage.save('brAuthToken', authData.token);

            //once they are logged in, send them to the beer list page with the uid as a prop
            self.props.navigator.replace({
              name: 'Beer List',
              component: BeerList,
              uid: authData.uid
            });
          }
        });
      }
    });
  },

  _handleLogin: function(){
    var self = this;
    //attempt login using provided credentials
    beerListRef.authWithPassword({
      email: self.state.email,
      password: self.state.password
    }, function(error, authData){
      if(error){
        console.log("Login failed: ", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);

        //save uid to local storage
        localStorage.save('brAuthToken', authData.token);

        //once they are logged in, send them to the beer list page with the uid as a prop
        self.props.navigator.replace({
          name: 'Beer List',
          component: BeerList,
          uid: authData.uid
        });
      }
    });
  },

  render: function(){
    return (
      <View>
        <Text>Email Address</Text>
        <TextInput
          ref="emailAddress"
          onChange={this._handleEmailChange}
          value={this.state.email} />
        <Text>Password</Text>
        <TextInput
          ref="password"
          onChange={this._handlePasswordChange}
          value={this.state.password} />
        <TouchableHighlight style={styles.button} onPress={this._handleCreateAccount}>
          <Text style={styles.buttonText}>Create a New Account</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this._handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

module.exports = LoginPage;