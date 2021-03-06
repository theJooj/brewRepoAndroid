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
  Switch,
  ToolbarAndroid,
  Image
} = React;

var HeaderBar = React.createClass({
  render: function() {
    return (
      <ToolbarAndroid
        title={this.props.beer.name}
        titleColor='white'
        subtitleColor='white'
        style={styles.toolbar} />
    )
  }
});

var BeerDetail = React.createClass({

  getInitialState: function() {
    return {
      beerCount: this.props.beer.count,
      beerList: this.props.beerList,
      guest: this.props.beer.guest
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
      newBeer.guest = true;
      beerListRef.child(this.props.uid).push(newBeer);
      this.props.navigator.popToTop();
    }
    this.setState({beerCount: this.state.beerCount + 1});
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
      this.props.navigator.popToTop();
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

  _handleGuestToggle: function(){
    var toggle = !this.state.guest;
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
    beerListRef.child(this.props.uid).child(beerId).update({guest: toggle});
    this.setState({guest: toggle});
  },

  render: function(){
    let removeButton = this.state.beerCount ? <TouchableHighlight underlayColor='#9E2A1B' onPress={this._handleRemove} style={styles.button}><Text style={styles.buttonText}>Remove Beer</Text></TouchableHighlight> : null;
    let beerLabel = this.props.beer.hasOwnProperty('labels') ? this.props.beer.labels.large : 'http://discovermagazine.com/~/media/Images/Issues/2013/June/beer.jpg';
    let count = this.state.beerCount ? <View style={styles.beerCount}><Text style={styles.fabText}>{this.state.beerCount}</Text></View> : null;
    let abv = this.props.beer.hasOwnProperty('abv') ? <Text><Text style={styles.textLabel}>ABV:</Text> {this.props.beer.abv}%</Text> : null;
    let glassware = this.props.beer.hasOwnProperty('glass') ? <Text><Text style={styles.textLabel}>Glassware:</Text> {this.props.beer.glass.name}</Text> : null;
    let dateAdded = this.props.beer.hasOwnProperty('dateAdded') ? <View style={styles.textContainer}><Text><Text style={styles.textLabel}>Added On:</Text> {this.props.beer.dateAdded}</Text></View> : null;
    let toggleGuest = this.props.beer.hasOwnProperty('guest') ? <View style={styles.switchContainer}><Text style={styles.textLabel}>Guest:</Text><Switch style={styles.switch} onValueChange={this._handleGuestToggle} value={this.state.guest} /></View> : null;
    return (
      <ScrollView style={styles.container}>
        <HeaderBar beer={this.props.beer} />
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
        {toggleGuest}
        <View style={styles.textContainer}>
          <Text style={styles.description}>{this.props.beer.description}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableHighlight underlayColor='#9E2A1B' onPress={this._handleAdd} style={styles.button}>
            <Text style={styles.buttonText}>Add Beer</Text>
          </TouchableHighlight>
          {removeButton}
        </View>
      </ScrollView>
    );
  }
});

module.exports = BeerDetail;
