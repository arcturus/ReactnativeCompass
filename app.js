import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
} from 'react-native';
import Compass from './compass';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPosition: {lat: 0, lon: 0},
      lastPosition: {
        latitude: null,
        longitude: null
      }
    };
  }

  componentWillUnmount() { 
    navigator.geolocation.clearWatch(this.watchID); 
  }

  componentDidMount() { 
    navigator.geolocation.getCurrentPosition( (position) => { 
      var initialPosition = JSON.stringify(position); 
      this.setState({initialPosition}); 
      }
      , (error) => console.log(JSON.stringify(error)), 
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    ); 
    this.watchID = navigator.geolocation.watchPosition((position) => { 
      var lastPosition = JSON.stringify(position); 
      this.setState({lastPosition: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude 
      }}); 
    }); 
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <View style={styles.row}>
            <Text style={styles.text}>To North</Text>
            <Compass/>
          </View>
        </View>
        <View style={styles.list}>
          <View style={styles.row}>
            <Text style={styles.text}>To Kings Cross</Text>
            <Compass fromLat={this.state.lastPosition.latitude}
              fromLon={this.state.lastPosition.longitude}
              toLat={51.530576}
              toLon={-0.123553}
              />
          </View>
        </View>
        <View style={styles.list}>
          <View style={styles.row}>
            <Text style={styles.text}>To Crystal Palace</Text>
            <Compass fromLat={this.state.lastPosition.latitude}
              fromLon={this.state.lastPosition.longitude}
              toLat={51.420011}
              toLon={-0.078106}
              />
          </View>
        </View>
        <View style={styles.list}>
          <View style={styles.row}>
            <Text style={styles.text}>To The Shard</Text>
            <Compass fromLat={this.state.lastPosition.latitude}
              fromLon={this.state.lastPosition.longitude}
              toLat={51.504263}
              toLon={-0.088266}
              />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  list: {
    borderRadius: 4, 
    borderWidth: 0.5, 
    borderColor: '#d6d7da',
    padding: 20,
    flexDirection: 'row',
    margin: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {

  }
});

module.exports = App;

