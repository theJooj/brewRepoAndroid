'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var beerListRef = new Firebase('https://fiery-fire-7334.firebaseio.com');

var {
  StyleSheet,
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
      <View>
        <Image source={{uri: beerLabel}} style={{width: 100, height: 100}} />
        <Text>{this.props.beer.name}</Text>
        <Text>{this.props.beer.description}</Text>
        <TouchableHighlight onPress={this._handleAdd} style={styles.button}>
          <Text style={styles.buttonText}>Add Beer</Text>
        </TouchableHighlight>
        {removeButton}
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

module.exports = BeerDetail;
