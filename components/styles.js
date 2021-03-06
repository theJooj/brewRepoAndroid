'use strict';

var React = require('react-native');

var {
  StyleSheet
} = React;

let styles = StyleSheet.create({
  headerBar: {
    height: 70,
    backgroundColor: '#9E2A1B',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  headerBarText: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center'
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
  textLinkContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textLink: {
    color: '#BF2F13',
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1D7'
  },
  separator: {
    height: 10,
    backgroundColor: '#9E2A1B'
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
    elevation: 6
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    alignSelf: 'center'
  },
  heroLabelContainer: {
    marginBottom: 35,
    marginTop: -10
  },
  heroLabel: {
    flex: 1,
    height: 200
  },
  beerTitle: {
    fontSize: 20,
    color: '#521300'
  },
  textContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    elevation: 1,
    flex: 1
  },
  beerCount: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9E2A1B',
    position: 'absolute',
    bottom: -20,
    right: 10,
    justifyContent: 'center',
    elevation: 4
  },
  beerCountText: {
    color: 'white'
  },
  textLabel: {
    fontWeight: 'bold'
  },
  toolbar: {
    height: 60,
    padding: 10,
    backgroundColor: '#9E2A1B',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 10
  },
  switchContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    elevation: 1,
    flex: 1,
    flexDirection: 'row'
  },
  switch: {
    marginTop: -3,
    marginLeft: 10,
    width: 50
  },
  noResults: {
    padding: 10
  }
});

module.exports = styles;