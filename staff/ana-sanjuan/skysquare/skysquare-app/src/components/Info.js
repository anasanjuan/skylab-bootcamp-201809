import React, { Component } from 'react'
import ShowMap from './ShowMap'
import logic from '../logic/logic'

class Info extends Component {
    state = { place: {} }

    componentDidMount() {
        logic.retrievePlace(this.props.id)
            .then(place => this.setState({ place }))
    }

    render() {
        return (<div className='info'>
            <main className='info__main'>
                <div>
                    <div className='score'>{this.state.place.scoring}</div>
                    <p>{this.state.place.address}</p>
                </div>
                <aside className="register-hive-main__map">
                    <ShowMap lat={this.state.place.latitude} lng={this.state.place.longitud}/>
                </aside>
            </main>

            <nav className='navbar__info'>
                <ul>
                    <li>Check-In</li>
                    <li>Favourites</li>
                    <li>Scoring</li>
                </ul>
            </nav>
        </div>)
    }
}

export default Info