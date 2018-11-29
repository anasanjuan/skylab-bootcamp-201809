import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../logic/logic'

class PlaceHeader extends Component {
    state = { place: [] }

    componentDidMount() {
        logic.retrievePlace(this.props.id)
            .then(place => this.setState({ place }))
    }

    render() {
        // return <header className='place-header'>
        return <header className='place-header' style={{backgroundImage: `url(${this.state.place.picture})`  }}>
            <section className='place-header__main'>
                <Link to={'/home'}><i className="fas fa-arrow-left arrow" onClick={this.props.OnGoBack}></i></Link>
                <h1>{this.state.place.name}</h1>
                <nav className="place-header__nav">
                    <ul>
                        <Link to={`/home/place/${this.state.place.id}`}><li>Info</li></Link>
                        <Link to={`/home/place/${this.state.place.id}/pictures`}><li>Pictures</li></Link>
                        <Link to={`/home/place/${this.state.place.id}/tips`}><li>Tips</li></Link>
                    </ul>
                </nav>
            </section>
        </header>
    }
}

export default PlaceHeader

