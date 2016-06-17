'use strict';

var React = require('react-native');

var BarcodeScanner = require('react-native-barcodescanner');
 
var BarcodeScannerExampleApp = React.createClass({
  getInitialState() {
    return ({
      torchMode: 'off',
      cameraType: 'back',
    });
  },
 
  barcodeReceived(e) {
    // console.log('Barcode: ' + e.data);
    // console.log('Type: ' + e.type);
    this.props.callback(e.data);
    this.props.navigator.pop();
  },
 
  render() {
    return (
      <BarcodeScanner
        onBarCodeRead={this.barcodeReceived}
        style={{ flex: 1 }}
        torchMode={this.state.torchMode}
        cameraType={this.state.cameraType} />
    );
  }
});

module.exports = BarcodeScannerExampleApp;
