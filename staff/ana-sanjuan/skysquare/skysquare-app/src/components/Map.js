import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

require('dotenv').config()
const { REACT_APP_API_KEY } = process.env

class AddMap extends Component {
	state = { latitude: 0, longitude: 0 }

	componentDidMount() {
		this.getLocation()
			.then(res => {
				const { latitude, longitude } = res.coords

				this.setState({ latitude, longitude })
			})

	}

	getLocation = () => {
		const geolocation = navigator.geolocation;

		const location = new Promise((resolve, reject) => {
			if (!geolocation) {
				reject(new Error('Not Supported'));
			}

			geolocation.getCurrentPosition((position) => {
				resolve(position);
			}, () => {
				reject(new Error('Permission denied'));
			});
		});

		return location
	}

	handleMapClick = ({ x, y, lat, lng, event }) => {

		new this.mapsApi.Marker({
			position: { lat: lat, lng: lng },
			map: this.map
		});

		this.props.onMapClick(lat, lng)
	}

	setMapInstance = ({ map, maps }) => {
		this.map = map
		this.mapsApi = maps
		this.map.markers = []
	}
	
	render = () => {
		return (
			// Important! Always set the container height explicitly
			<section style={{ width: "90vw", height: "250px" }}>
				<GoogleMapReact
					center={{ lat: Number(this.state.latitude), lng: Number(this.state.longitude) }}
					defaultZoom={14}
					bootstrapURLKeys={{ key: REACT_APP_API_KEY, language: 'es', region: 'es' }}
					onClick={this.handleMapClick}
					onGoogleApiLoaded={this.setMapInstance}>
				</GoogleMapReact>
			</section>
		);
	}
}

export default AddMap;


