import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Animated,
  DeviceEventEmitter
} from 'react-native';
import ReactNativeHeading from 'react-native-heading';

export default class Compass extends Component {

  constructor(props) {
    super(props);

    this.state = {
      defaultAzimut: props.azimut || 360,
      rotation: new Animated.Value(0),
      headingIsSupported: false,
      angleFilter: props.filter || 2
    }
  }

  setFilter(filter) {
    this.state.angleFilter = parseInt(filter);
    this.stopHeadingUpdates();
    this.startHeadingUpdates();
  }

  startHeadingUpdates() {
    ReactNativeHeading.start(this.state.angleFilter)
    .then(didStart => {
        this.setState({
            headingIsSupported: didStart,
        })
    });

    DeviceEventEmitter.addListener('headingUpdated', (data) => {
        //console.log('-------------->>>> headingUpdate ', data);
        this.startAnimation(data.heading || data);
    });
  }

  stopHeadingUpdates() {
    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners('headingUpdated');
  }

  componentWillMount(){
    this.startAnimation(0);
    this.startHeadingUpdates();
  }

  componentWillUnmount() {
    this.stopHeadingUpdates();
  }

  startAnimation(z) {
    const offset = this.calculateOffset();
    if (offset != 0) {
      console.log('============>>>> offset is ', offset);
      z -= offset;
    }
    this.state.rotation.setValue(this.state.defaultAzimut - z);
  }

  toDegrees(x) {
    return x * 180 / Math.PI;
  }

  toRadians(x) {
    return Math.PI * x / 180;
  }

  calculateOffset() {
    if (!this.props.fromLat || !this.props.fromLon ||
      !this.props.toLat || !this.props.toLon) {
      return 0;
    }

    const fLat = this.toRadians(this.props.fromLat);
    const fLon = this.toRadians(this.props.fromLon);
    const toLat = this.toRadians(this.props.toLat);
    const toLon = this.toRadians(this.props.toLon);

    const dLon = toLon - fLon;

    const y = Math.sin(dLon) * Math.cos(toLat);
    const x = Math.cos(fLat) * Math.sin(toLat) - Math.sin(fLat) * Math.cos(toLat) * Math.cos(dLon);
    const radiansBearing = Math.atan2(y, x);

    return parseInt(this.toDegrees(radiansBearing));
  }

  render() {
    return (<Animated.Image style={[styles.compass, {transform: [{rotate: this.state.rotation.interpolate({
      inputRange:[0, 360],
      outputRange: ['0 deg', '360 deg']
    })}]}]}
      source={require('./assets/arrow.png')}
    />);  
  }
}

const styles = StyleSheet.create({
  compass: {
  }
});

module.exports = Compass;
