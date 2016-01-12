'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var beerListRef = new Firebase('https://fiery-fire-7334.firebaseio.com');
var styles = require('./styles');

var {
  Text,
  View,
  TouchableHighlight,
  Image
} = React;

var BeerDetail = React.createClass({

  getInitialState: function() {
    return {
      beerCount: this.props.beer.count,
      beerList: {}
    };
  },

  componentDidMount: function() {
    beerListRef.child(this.props.uid).on('value', (snapshot) => {
      var beerListExists = snapshot.val();
      if(beerListExists){
        this.setState({beerList: snapshot.val()});
      }
    });
  },

  componentWillUnmount: function(){
    beerListRef.child(this.props.uid).off('value');
  },

  _handleAdd: function(){
    //check to see if beer is already in beer list
    //if it is, just add one to the count and update
    //if not, set the count to 1 and push to the list
    var beerList = this.state.beerList;
    var beerKeys = Object.keys(beerList);
    var beerListArray = [];
    var beerExists = false;
    var beerId, targetBeer;
    beerKeys.map((beer)=>{
      beerListArray.push(beerList[beer]);
    });
    for(var x in beerListArray){
      if(beerListArray[x].name === this.props.beer.name){
        beerExists = true;
        targetBeer = beerListArray[x];
        beerId = beerKeys[x];
      }
    }
    if(beerExists){
      console.log('you have that one');
      targetBeer.count = targetBeer.count + 1;
      beerListRef.child(this.props.uid).child(beerId).update({count: targetBeer.count});
    } else {
      console.log('new beer!');
      var newBeer = this.props.beer;
      newBeer.count = 1;
      beerListRef.child(this.props.uid).push(newBeer);
    }
    this.setState({beerCount: this.state.beerCount + 1});
    var BeerList = require('./beerList');
    this.props.navigator.popToTop();
    // this.props.navigator.push({
    //   name: 'BeerList',
    //   component: BeerList,
    //   uid: this.props.uid
    // });
  },

  _handleRemove: function(){
    var beerList = this.state.beerList;
    var beerKeys = Object.keys(beerList);
    var beerListArray = [];
    var beerExists = false;
    var beerId, targetBeer;
    beerKeys.map((beer)=>{
      beerListArray.push(beerList[beer]);
    });
    for(var x in beerListArray){
      if(beerListArray[x].name === this.props.beer.name){
        beerExists = true;
        targetBeer = beerListArray[x];
        beerId = beerKeys[x];
      }
    }
    var beerCount = targetBeer.count;
    if(beerCount - 1 > 0){
      beerCount = beerCount - 1;
      beerListRef.child(this.props.uid).child(beerId).update({count: beerCount});
      this.setState({beerCount: this.state.beerCount - 1});
    } else {
      beerListRef.child(this.props.uid).child(beerId).remove();
      this.setState({beerCount: 0});
    }
  },

  render: function(){
    let removeButton = this.state.beerCount ? <TouchableHighlight onPress={this._handleRemove} style={styles.button}><Text style={styles.buttonText}>Remove Beer</Text></TouchableHighlight> : null;
    let beerLabel = this.props.beer.hasOwnProperty('labels') ? this.props.beer.labels.large : 'http://discovermagazine.com/~/media/Images/Issues/2013/June/beer.jpg'
    return (
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerBarText}>{this.props.beer.name}</Text>
        </View>
        <Image source={{uri: beerLabel}} style={styles.heroLabel} />
        <View style={styles.textContainer}>
          <Text>{this.props.beer.style.shortName}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.description}>{this.props.beer.description}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableHighlight onPress={this._handleAdd} style={styles.button}>
            <Text style={styles.buttonText}>Add Beer</Text>
          </TouchableHighlight>
          {removeButton}
        </View>
      </View>
    );
  }
});

module.exports = BeerDetail;
