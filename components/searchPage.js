'use strict';

var React = require('react-native');
var BeerDetail = require('./beerDetail');
var config = require('../config');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  ListView,
  TouchableHighlight,
  Image
} = React;

const apiKey = config.brewerydb.apiKey;
const searchUrl = 'http://api.brewerydb.com/v2/search?q='

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
    return fetch(`http://api.brewerydb.com/v2/search?q=${searchTerm}&type=beer&key=${apiKey}`)
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
  },
  container: {
    flex: 1
  }
});

module.exports = SearchPage;
