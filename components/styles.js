'use strict';

var React = require('react-native');

var {
  StyleSheet
} = React;

let styles = StyleSheet.create({
  headerBar: {
    height: 60,
    padding: 10,
    backgroundColor: '#9E2A1B',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 10
  },
  headerBarText: {
    color: 'white',
    fontSize: 20
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    flex: 2,
    height: 36,
    backgroundColor: '#BF2F13',
    borderColor: '#BF2F13',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1D7'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  listItem: {
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    backgroundColor: 'white',
    elevation: 1
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  title: {
    fontSize: 20,
    color: '#521300'
  },
  rowText: {
    color: '#9E2A1B'
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#BF2F13',
    position: 'absolute',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    elevation: 4
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    alignSelf: 'center'
  },
  heroLabel: {
    flex: 1
  },
  beerTitle: {
    fontSize: 20,
    color: '#521300'
  },
  textContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    elevation: 1
  }
});

module.exports = styles;