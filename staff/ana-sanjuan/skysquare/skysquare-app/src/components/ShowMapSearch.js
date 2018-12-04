import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

require('dotenv').config()
const { REACT_APP_API_KEY } = process.env

class ShowMapSearch extends Component {
	static defaultProps = {
		center: {
			lat: 41.398623,
			lng: 2.199970
		},
		zoom: 16
	};

	state = { latitude: this.props.latitude, longitude: this.props.longitude }

	setMarker = ({ map, maps }) => {
		this.map = map
		this.mapsApi = maps
		this.map.markers = []

		function pinSymbol(color) {
			return {
				path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
				fillColor: color,
				fillOpacity: 1,
				strokeColor: '#000',
				strokeWeight: 2,
				scale: 1,
			};
		}

		this.props.places.forEach(place => {
			let marker = new this.mapsApi.Marker({
				position: { lat: place.latitude, lng: place.longitude },
				map: this.map,
				title: place.name,
				icon: pinSymbol("#D7000D")
			});

			let contentString = `<a href=${`/#/home/place/${place.id}`}> 
				<div class='info__container'>
					<div class='info__text'>	
						<h1 class='info__text__title'>${place.name}</h1> 
						<h5 class='info__text__subtitle'>${place.address}</h5>
					</div>
				</div></a>`

			marker.addListener('click', function () {
				infowindow.close()
        		infowindow.setContent(contentString)
        		infowindow.open(map, marker)

			})
			this.map.markers.push(marker)
		})

		let marker = new this.mapsApi.Marker({
			position: { lat: this.props.latitude, lng: this.props.longitude },
			map: this.map,
			icon: pinSymbol("#2E5BE3")
		});
		let contentString = `<div class='info__text'>	
				<h1 class='info__text__title'>You are here</h1> 
			</div>`

		let infowindow = new this.mapsApi.InfoWindow({
			content: contentString
		});

		marker.addListener('click', function () {
			infowindow.close()
			infowindow.setContent(contentString)
			infowindow.open(map, marker)
		});

		this.map.markers.push(marker)

	}

	render() {
		return (
			// Important! Always set the container height explicitly
			<section style={{ height: '80vh', width: '100%' }}>
				<GoogleMapReact
					defaultCenter={this.props.center}
					center={{ lat: this.props.latitude, lng: this.props.longitude }}
					defaultZoom={this.props.zoom}
					bootstrapURLKeys={{ key: REACT_APP_API_KEY, language: 'es', region: 'es' }}
					onGoogleApiLoaded={this.setMarker}>

				</GoogleMapReact>
			</section>
		);
	}
}

export default ShowMapSearch


