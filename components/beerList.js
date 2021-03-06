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
  ToolbarAndroid,
  Image
} = React;

var HeaderBar = React.createClass({
  render: function() {
    return (
      <ToolbarAndroid
        title='BrewRepo'
        titleColor='white'
        subtitleColor='white'
        style={styles.toolbar}
        actions={[
          {title: 'Log Out', show: 'never'},
          {title: this.props.filterGuest ? 'Show All' : 'Hide Beers'}
        ]}
        onActionSelected={this.onActionSelected} />
    )
  },
  onActionSelected: function(position) {
    if (position === 0) { // index of 'Log Out'
      this.props.logout();
    } else if (position === 1) {
      this.props.changeFilter();
    }
  }
});

var BeerList = React.createClass({
  componentWillMount: function() {
    var beerListRef = new Firebase(`https://fiery-fire-7334.firebaseio.com/${this.props.uid}`);
    var beerList;
    beerListRef.on('value', (snapshot)=>{
      beerList = snapshot.val();
      if(beerList){
        var beerKeys = Object.keys(beerList);
        var beerListArray = [];
        if(this.state.filterGuest){
          beerKeys.map((beer)=>{
            if(beerList[beer].guest){
              beerListArray.push(beerList[beer]);
            }
          });
        } else {
          beerKeys.map((beer)=>{
            beerListArray.push(beerList[beer]);
          });
        }

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(beerListArray),
          beerList: beerList,
          loading: false
        });
      } else {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows([]),
          beerList: {},
          loading: false
        });
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

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      beerList: {},
      loading: true,
      filterGuest: false
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
          beerList: this.state.beerList,
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

  _handleFilterChange: function(){
    var filterGuest = !this.state.filterGuest;
    var beerList = this.state.beerList;
    var beerKeys = Object.keys(beerList);
    var beerListArray = [];
    if(filterGuest){
      beerKeys.map((beer)=>{
        if(beerList[beer].guest){
          beerListArray.push(beerList[beer]);
        }
      });
    } else {
      beerKeys.map((beer)=>{
        beerListArray.push(beerList[beer]);
      });
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(beerListArray),
      beerList: beerList,
      filterGuest: filterGuest
    });
  },

  render: function() {
    if(this.state.loading) {
      var mainList = null;
    } else {
      var mainList = Object.keys(this.state.beerList).length ? <ListView dataSource={this.state.dataSource} renderRow={(rowData) => <BeerRow beer={rowData} onPress={this._onPress} />} /> : <View style={styles.noResults}><Text>There are currently no beers in your inventory. Click the Add button at the bottom to add some now.</Text></View>
    }
    return (
      <View style={styles.container}>
        <HeaderBar logout={this._handleLogout} filterGuest={this.state.filterGuest} changeFilter={this._handleFilterChange} />
        {mainList}
        <TouchableHighlight underlayColor='#9E2A1B' onPress={() => {this.props.navigator.push({name: 'Search Page', component: SearchPage, uid: this.props.uid, beerList: this.state.beerList})}} style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

module.exports = BeerList;
