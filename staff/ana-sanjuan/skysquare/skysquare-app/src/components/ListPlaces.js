import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Place from './Place'
import logic from '../logic'
import LoadingSpinner from './LoadingSpinner'
import ShowMapSearch from './ShowMapSearch'
import { userInfo } from 'os';


class ListPlaces extends Component {
    state = { error: null, places: [], name: '', longitude: 0, latitude: 0, loading: true, mapOn: false }

    componentDidMount() {
        this.getLocation()
            .then(res => {
                const { latitude, longitude } = res.coords

                this.setState({ loading: false, longitude, latitude })
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.longitude !== this.state.longitude || prevState.latitude !== this.state.latitude) {

            if (this.props.type === 'filter') {
                try {
                    logic.listPlacesByFilter(this.props.filter, this.state.longitude, this.state.latitude)
                        .then(places => this.setState({ places, error: null }))
                        .catch(err => this.setState({ error: err.message }))
                } catch (err) {
                    this.setState({ error: err.message })
                }
            } else if (this.props.type === 'name') {
                try {
                    logic.listPlacesByName(this.props.name, this.state.longitude, this.state.latitude)
                        .then(places => this.setState({ places, error: null }))
                        .catch(err => this.setState({ error: err.message }))
                } catch (err) {
                    this.setState({ error: err.message })
                }
            }

        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name !== this.props.name) {
            try {
                logic.listPlacesByName(this.state.name)
                    .then(places => this.setState({ places, error: null }))
                    .catch(err => this.setState({ error: err.message }))
            } catch (err) {
                this.setState({ error: err.message })
            }
        }

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

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSearchSubmit = event => {
        event.preventDefault()

        this.props.onSearchSubmit(this.state.name)
    }

    

    onMapClick = event => {
        this.setState({ mapOn: true })
    }

    onListClick = event => {

        this.setState({ mapOn: false })

    }

    render() {
        return (<div className='list__places'>
            <header className='list__places__header'>
                <Link to={'/home'}><i className="fas fa-arrow-left" onClick={this.props.onGoBack}></i></Link>
                <div className='search__input'>
                    <form onSubmit={this.handleSearchSubmit}>
                        <input className="input_box" type='text' placeholder="What are you looking for?" onChange={this.handleNameChange}></input>
                        <button type='submit'></button>
                    </form>
                </div>
                {this.state.mapOn ? <i className="fas fa-list-ul list__icon" onClick={this.onListClick}></i> : <i className="fas fa-globe-africa list__icon" onClick={this.onMapClick}> </i>}
            </header>
            <main className='list__places__main'>
                {this.state.loading ? <LoadingSpinner /> :
                    (this.state.mapOn ?
                        <ShowMapSearch places={this.state.places} latitude={this.state.latitude} longitude={this.state.longitude} /> :
                        <section >
                            {this.state.places.map(place => <Place key={place.id} id={place.id} name={place.name} scoring={place.scoring} picture={place.picture} tip={place.tip} address={place.address} distance={place.distance} />)}
                        </section>
                    )}
            </main>
        </div>)
    }
}

export default ListPlaces