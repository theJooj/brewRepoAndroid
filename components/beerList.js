'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var localStorage = require('react-native-simple-store');

var BeerDetail = require('./beerDetail');
var SearchPage = require('./searchPage');
var BeerRow = require('./beerRow');
var styles = require('./styles');

var {
  Text,
  View,
  ListView,
  TouchableHighlight,
  BackAndroid,
  Image
} = React;

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
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator.getCurrentRoutes().length === 1  ) {
         return false;
      }
      this.props.navigator.pop();
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
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerBarText}>BrewRepo</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <BeerRow beer={rowData} onPress={this._onPress} />} />
        <TouchableHighlight onPress={() => {this.props.navigator.push({name: 'Search Page', component: SearchPage, uid: this.props.uid})}} style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

module.exports = BeerList;
