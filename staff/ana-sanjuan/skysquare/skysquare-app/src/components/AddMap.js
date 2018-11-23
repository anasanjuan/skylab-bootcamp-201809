
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react'

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  handleMapClick = ({ x, y, lat, lng, event }) => {

    this.map.markers.forEach(marker => {
      marker.setMap(null)
    })
    // this.state.form_data.latitude = lat;
    // this.state.form_data.longitude = lng;
    // this.setState({ form_data: this.state.form_data })
    let marker = new this.mapsApi.Marker({
      position: { lat: lat, lng: lng },
      map: this.map
      // icon: require('../../assets/img/hive.ico')
    });
    this.map.markers.push(marker)
  }
  setMapInstance = ({ map, maps }) => {
    debugger
    this.map = map
    this.mapsApi = maps
    this.map.markers = []

    // let marker = new this.mapsApi.Marker({
    //   position: { lat: props.lat, lng: props.lng },
    //   map: this.map
    //   // icon: require('../../assets/img/hive.ico')
    // });
    // this.map.markers.push(marker)
  }



  render = () => {
    return (
      // Important! Always set the container height explicitly
      <section style={{width:"200px", height:"200px"}} className="register-hive-main__map">
        <GoogleMapReact
          defaultCenter={{ lat: 28.4, lng: -16.3 }}
          defaultZoom={8}
          bootstrapURLKeys={{ key: "AIzaSyDMgVAMQ3l51fT-suy2MOTswccssoOCuJ4", language: 'es', region: 'es' }}
          onClick={this.handleMapClick}
          onGoogleApiLoaded={this.setMapInstance}>

        </GoogleMapReact>
      </section>
    );
  }
}

export default SimpleMap;


