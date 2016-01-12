'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var beerListRef = new Firebase('https://fiery-fire-7334.firebaseio.com');
var styles = require('./styles');

var {
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image
} = React;

var BeerDetail = React.createClass({

  getInitialState: function() {
    return {
      beerCount: this.props.beer.count,
      beerList: this.props.beerList
    };
  },

  // componentDidMount: function() {
  //   beerListRef.child(this.props.uid).on('value', (snapshot) => {
  //     var beerListExists = snapshot.val();
  //     if(beerListExists){
  //       this.setState({beerList: snapshot.val()});
  //     }
  //   });
  // },

  // componentWillUnmount: function(){
  //   beerListRef.child(this.props.uid).off('value');
  // },

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
      targetBeer.count = targetBeer.count + 1;
      beerListRef.child(this.props.uid).child(beerId).update({count: targetBeer.count});
    } else {
      var newBeer = this.props.beer;
      newBeer.count = 1;
      var dateAdded = new Date();
      var day = dateAdded.getDate();
      var month = dateAdded.getMonth() + 1;
      var year = dateAdded.getFullYear();
      newBeer.dateAdded = `${month}/${day}/${year}`;
      beerListRef.child(this.props.uid).push(newBeer);
    }
    this.setState({beerCount: this.state.beerCount + 1});
    this.props.navigator.popToTop();
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
        // beerExists = true;
        // targetBeer = beerListArray[x];
        beerId = beerKeys[x];
      }
    }
    var beerCount = this.state.beerCount;
    if(beerCount - 1 > 0){
      beerCount = beerCount - 1;
      beerListRef.child(this.props.uid).child(beerId).update({count: beerCount});
      this.setState({beerCount: this.state.beerCount - 1});
    } else {
      beerListRef.child(this.props.uid).child(beerId).remove();
      this.setState({beerCount: 0});
    }
    // var beerCount = targetBeer.count;
    // if(beerCount - 1 > 0){
    //   beerCount = beerCount - 1;
    //   beerListRef.child(this.props.uid).child(beerId).update({count: beerCount});
    //   this.setState({beerCount: this.state.beerCount - 1});
    // } else {
    //   beerListRef.child(this.props.uid).child(beerId).remove();
    //   this.setState({beerCount: 0});
    // }
  },

  render: function(){
    let removeButton = this.state.beerCount ? <TouchableHighlight onPress={this._handleRemove} style={styles.button}><Text style={styles.buttonText}>Remove Beer</Text></TouchableHighlight> : null;
    let beerLabel = this.props.beer.hasOwnProperty('labels') ? this.props.beer.labels.large : 'http://discovermagazine.com/~/media/Images/Issues/2013/June/beer.jpg';
    let count = this.state.beerCount ? <View style={styles.beerCount}><Text style={styles.fabText}>{this.state.beerCount}</Text></View> : null;
    let dateAdded = this.props.beer.hasOwnProperty('dateAdded') ? <View style={styles.textContainer}><Text>Added On: {this.props.beer.dateAdded}</Text></View> : null;
    let abv = this.props.beer.hasOwnProperty('abv') ? <Text><Text style={styles.textLabel}>ABV:</Text> {this.props.beer.abv}%</Text> : null;
    let glassware = this.props.beer.hasOwnProperty('glass') ? <Text><Text style={styles.textLabel}>Glassware:</Text> {this.props.beer.glass.name}</Text> : null;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerBarText}>{this.props.beer.name}</Text>
        </View>
        <View style={styles.heroLabelContainer}>
          <Image source={{uri: beerLabel}} style={styles.heroLabel} />
          <View style={styles.separator} />
          {count}
        </View>
        <View style={styles.textContainer}>
          <Text><Text style={styles.textLabel}>Style:</Text> {this.props.beer.style.shortName}</Text>
          {abv}
          {glassware}
        </View>
        {dateAdded}
        <View style={styles.textContainer}>
          <Text style={styles.description}>{this.props.beer.description}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableHighlight onPress={this._handleAdd} style={styles.button}>
            <Text style={styles.buttonText}>Add Beer</Text>
          </TouchableHighlight>
          {removeButton}
        </View>
      </ScrollView>
    );
  }
});

module.exports = BeerDetail;
