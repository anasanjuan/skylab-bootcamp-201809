import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import logic from '../logic/logic'

class PlaceHeader extends Component {
    state = { place: [] }

    componentDidMount() {
        logic.retrievePlace(this.props.id)
            .then(place => {

                this.setState({ place })
            })

    }

    render() {
        return <header className='placeHeader'>
        <Link to={'/home'}><i className="fas fa-arrow-left" onClick={this.props.OnGoBack}></i></Link>
        <h1>{this.state.place.name}</h1>
        <img src={this.state.place.picture} alt="#"></img>
        <nav className="placeHeader__nav">
            <ul>
            <Link to={`/home/place/${this.state.place.id}`}><li>Info</li></Link>
            <Link to={`/home/place/${this.state.place.id}/pictures`}><li>Pictures</li></Link>    
            <Link to={`/home/place/${this.state.place.id}/tips`}><li>Tips</li></Link>  
            </ul>
        </nav>
    </header>
    }
}

export default PlaceHeader

