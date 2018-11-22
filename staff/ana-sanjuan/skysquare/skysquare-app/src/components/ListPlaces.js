import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Place from './Place'
import logic from '../logic/logic'

class ListPlaces extends Component {
    state = { places: []}

    componentDidMount() {
        logic.listPlaces(this.props.filter)
            .then(places => {
                this.setState({ places })
            })

    }
    render() {
        return (<div className='list__places'>
            <header className= 'list__places__header'>
                <Link to={'/home'}><i className="fas fa-arrow-left" onClick={this.props.OnGoBack}></i></Link>
                <input className='input_box' type='text'></input>
            </header>
            <main className='list__places__main'>
                <section >
                    {this.state.places.map(place => <Place key={place.id} name={place.name} scoring={place.scoring} />)}
                </section>
            </main>
        </div>)
    }
}

export default ListPlaces