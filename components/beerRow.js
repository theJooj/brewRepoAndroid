'use strict';

var React = require('react-native');
var styles = require('./styles');

var {
  Text,
  View,
  TouchableHighlight,
  Image
} = React;

var BeerRow = React.createClass({
  render: function(){
    var label = this.props.beer.hasOwnProperty('labels') ? this.props.beer.labels.medium : 'http://www.iconsplace.com/icons/preview/orange/beer-glass-256.png';
    var breweryName = this.props.beer.hasOwnProperty('breweries') ? <Text style={styles.rowText}>{this.props.beer.breweries[0].name}</Text> : null;
    var beerName = this.props.beer.hasOwnProperty('style') ? <Text style={styles.rowText}>{this.props.beer.style.shortName}</Text> : null;
    return (
      <TouchableHighlight underlayColor='#BF2F13' style={styles.listItem} onPress={this.props.onPress(this.props.beer)}>
        <View>
          <View style={styles.rowContainer}>
            <Image source={{uri: label}} style={styles.thumb} />
            <View>
              <Text style={styles.title}>{this.props.beer.name}</Text>
              {breweryName}
              {beerName}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

module.exports = BeerRow;
