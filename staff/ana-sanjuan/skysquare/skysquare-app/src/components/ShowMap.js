
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react'

class ShowMap extends Component {
	state = {lat: this.props.lat, lng: this.props.lng}

	componentWillReceiveProps(nextProps) {
		if(nextProps !== this.props)

		this.setState({ lat: nextProps.lat, lng: nextProps.lng })
	}
	
	setMarker = ({ map, maps }) => {
		this.map = map
		this.mapsApi = maps
		this.map.markers = []

		let marker = new this.mapsApi.Marker({
			position: { lat: this.state.lat, lng: this.state.lng },
			map: this.map
		});
		this.map.markers.push(marker)
	}

	render() {
		return (
			// Important! Always set the container height explicitly
			<section className="map">
				<GoogleMapReact
					center={{ lat: this.state.lat, lng: this.state.lng }}
					defaultZoom={14}
					bootstrapURLKeys={{ key: "AIzaSyDMgVAMQ3l51fT-suy2MOTswccssoOCuJ4", language: 'es', region: 'es' }}
					onGoogleApiLoaded={this.setMarker}>
				</GoogleMapReact>
			</section>
		);
	}
}

export default ShowMap


