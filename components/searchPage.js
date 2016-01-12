'use strict';

var React = require('react-native');
var BeerDetail = require('./beerDetail');
var BeerRow = require('./beerRow');
var styles = require('./styles');
var config = require('../config');

var {
  Text,
  TextInput,
  View,
  ListView,
  TouchableHighlight,
  Image
} = React;

const apiKey = config.brewerydb.apiKey;
const searchUrl = 'http://api.brewerydb.com/v2/search?q=';

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
        <TouchableHighlight style={styles.button} onPress={
          (e)=>{e.preventDefault();
            this.refs.searchInput.blur();
            this.props.handleSearch(this.state.searchTerm);
          }
        }>
          <Text style={styles.buttonText}>Search</Text>
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
    };
  },

  _beerSearch: function(searchTerm){
    var self = this;
    return fetch(`http://api.brewerydb.com/v2/search?q=${searchTerm}&type=beer&withBreweries=Y&key=${apiKey}`)
      .then(function(res){
        return res.json();
      }).then(function(json){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        self.setState({
          dataSource: ds.cloneWithRows(json.data)
        })
      }).catch(function(err){
        console.log(err);
      });
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

  render: function(){
    return (
      <View style={styles.container}>
        <SearchInput handleSearch={this._beerSearch} />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <BeerRow beer={rowData} onPress={this._onPress} />} />
      </View>
    );
  }
});

module.exports = SearchPage;
