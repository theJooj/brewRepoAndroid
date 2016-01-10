'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var localStorage = require('react-native-simple-store');

var BeerDetail = require('./beerDetail');
var SearchPage = require('./searchPage');

var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  BackAndroid,
  Image
} = React;

var BeerRow = React.createClass({
  render: function(){
    var label = this.props.beer.hasOwnProperty('labels') ? this.props.beer.labels.medium : null;
    return (
      <TouchableHighlight onPress={this.props.onPress(this.props.beer)}>
        <View>
          <Image source={{uri: label}} style={{width: 80, height: 80}} />
          <Text>{this.props.beer.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
});

var BeerList = React.createClass({
  componentWillMount: function() {
    var beerListRef = this.state.beerListRef;
    var beerList;
    beerListRef.on('value', (snapshot)=>{
      beerList = snapshot.val();
      if(beerList){
        var beerKeys = Object.keys(beerList);
        var beerListArray = [];
        beerKeys.map((beer)=>{
          beerListArray.push(beerList[beer]);
        });

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(beerListArray),
          beerList: beerList
        })
      }
    });
  },

  componentDidMount: function() {
    var self = this;
    BackAndroid.addEventListener('hardwareBackPress', function() {
      self.props.navigator.pop();
      return true;
    });
  },

  componentWillUnmount: function(){
    var beerListRef = this.state.beerListRef;
    beerListRef.off('value');
  },

  getInitialState: function() {
    var beerListRef = new Firebase(`https://fiery-fire-7334.firebaseio.com/${this.props.uid}`);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      beerListRef: beerListRef
    };
  },

  _onPress: function(beer){
    return (
      (e) => {
        e.preventDefault;
        this.props.navigator.push({
          name: "BeerDetail",
          component: BeerDetail,
          beer: beer,
          uid: this.props.uid
        });
      }
    );
  },

  _handleLogout: function(){
    var LoginPage = require('./loginPage');
    localStorage.delete('brAuthToken');
    this.props.navigator.immediatelyResetRouteStack([{
      name: "Login Page",
      component: LoginPage
    }]);
    // this.props.navigator.push({
    //   name: "Login Page",
    //   component: LoginPage
    // });
  },

  render: function() {
    return (
      <View>
        <TouchableHighlight onPress={this._handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {this.props.navigator.push({name: 'Search Page', component: SearchPage, uid: this.props.uid})}} style={styles.button}>
          <Text style={styles.buttonText}>Add new beer</Text>
        </TouchableHighlight>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <BeerRow beer={rowData} onPress={this._onPress} />} />
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

module.exports = BeerList;
