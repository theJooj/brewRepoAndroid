'use strict';

var React = require('react-native');
var BeerDetail = require('./beerDetail');
var BeerRow = require('./beerRow');
var BarcodeScanner = require('./barcodeScanner');
var styles = require('./styles');
var config = require('../config');

var {
  Text,
  TextInput,
  View,
  ListView,
  TouchableHighlight,
  ToolbarAndroid,
  Image
} = React;

const apiKey = config.brewerydb.apiKey;

var HeaderBar = React.createClass({
  render: function() {
    return (
      <ToolbarAndroid
        title='Search'
        titleColor='white'
        subtitleColor='white'
        style={styles.toolbar} />
    )
  }
});

var SearchInput = React.createClass({
  getInitialState: function() {
    return {
      searchTerm: '' 
    };
  },

  _handleTextChange: function(e){
    this.setState({
      searchTerm: e.nativeEvent.text
    });
  },

  render: function(){
    return (
      <View>
        <TextInput
          ref="searchInput"
          underlineColorAndroid="#BF2F13"
          onChange={this._handleTextChange}
          value={this.state.searchTerm} />
        <TouchableHighlight underlayColor='#9E2A1B' style={styles.button} onPress={
          (e)=>{e.preventDefault();
            this.refs.searchInput.blur();
            this.props.handleSearch(this.state.searchTerm);
          }
        }>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='#9E2A1B' style={styles.button} onPress={
          (e)=>{e.preventDefault();
            this.props.navigator.push({
              name: 'Barcode Scanner',
              component: BarcodeScanner,
              callback: this.props.handleUPC
            })
          }
        }>
          <Text style={styles.buttonText}>Search by Barcode</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

var SearchPage = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      hasSearched: false,
      noResults: true
    };
  },

  _beerSearch: function(searchTerm){
    var self = this;
    return fetch(`http://api.brewerydb.com/v2/search?q=${searchTerm}&type=beer&withBreweries=Y&key=${apiKey}`)
      .then(function(res){
        return res.json();
      }).then(function(json){
        if(json.totalResults){
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          self.setState({
            dataSource: ds.cloneWithRows(json.data),
            hasSearched: true,
            noResults: false
          });
        } else {
          self.setState({
            hasSearched: true,
            noResults: true
          });
        }
      }).catch(function(err){
        console.log(err);
      });
  },

  _upcSearch: function(searchTerm){
    var self = this;
    return fetch(`http://api.brewerydb.com/v2/search/upc?code=${searchTerm}&withBreweries=Y&key=${apiKey}`)
      .then(function(res){
        return res.json();
      }).then(function(json){
        if(json.totalResults){
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          self.setState({
            dataSource: ds.cloneWithRows(json.data),
            hasSearched: true,
            noResults: false
          });
        } else {
          self.setState({
            hasSearched: true,
            noResults: true
          });
        }
      }).catch(function(err){
        console.log(err);
      });
  },

  _onPress: function(beer){
    return (
      (e) => {
        e.preventDefault;
        var beerList = this.props.beerList;
        var beerKeys = Object.keys(beerList);
        var beerListArray = [];
        var beerExists = false;
        var beerId, targetBeer;
        beerKeys.map((beer)=>{
          beerListArray.push(beerList[beer]);
        });
        for(var x in beerListArray){
          if(beerListArray[x].name === beer.name){
            beerExists = true;
            targetBeer = beerListArray[x];
            beerId = beerKeys[x];
          }
        }
        if(beerExists){
          this.props.navigator.push({
            name: "BeerDetail",
            component: BeerDetail,
            beer: targetBeer,
            beerList: this.props.beerList,
            uid: this.props.uid
          });
        } else {
          this.props.navigator.push({
            name: "BeerDetail",
            component: BeerDetail,
            beer: beer,
            beerList: this.props.beerList,
            uid: this.props.uid
          });
        }
      }
    );
  },

  render: function(){
    if(this.state.hasSearched){
      var searchResults = this.state.noResults ? <View style={styles.noResults}><Text>No results found.</Text></View> : <ListView dataSource={this.state.dataSource} renderRow={(rowData) => <BeerRow beer={rowData} onPress={this._onPress} />} />
    } else {
      var searchResults = null;
    }
    return (
      <View style={styles.container}>
        <HeaderBar />
        <SearchInput handleSearch={this._beerSearch} handleUPC={this._upcSearch} navigator={this.props.navigator} />
        {searchResults}
      </View>
    );
  }
});

module.exports = SearchPage;
