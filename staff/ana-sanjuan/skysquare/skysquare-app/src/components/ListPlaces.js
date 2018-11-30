import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Place from './Place'
import logic from '../logic/logic'

class ListPlaces extends Component {
    state = { error: null, places: [], name: '' }

    componentDidMount() {
        if (this.props.type === 'filter') {
            try {
                logic.listPlacesByFilter(this.props.filter)
                    .then(places => this.setState({ places, error: null }))
                    .catch(err => this.setState({ error: err.message }))
            } catch (err) {
                this.setState({ error: err.message })
            }
        } else if (this.props.type === 'name') {
            try {
                logic.listPlacesByName(this.props.name)
                    .then(places => this.setState({ places, error: null }))
                    .catch(err => this.setState({ error: err.message }))
            } catch (err) {
                this.setState({ error: err.message })
            }
        }
    }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSearchSubmit = event => {
        event.preventDefault()

        this.props.onSearchSubmit(this.state.name)
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

    render() {
        return (<div className='list__places'>
            <header className='list__places__header'>
                <Link to={'/home'}><i className="fas fa-arrow-left" onClick={this.props.OnGoBack}></i></Link>
                <div className='search__input'>
                    <form onSubmit={this.handleSearchSubmit}>
                        <input className="input_box" type='text' placeholder="¿Qué estás buscando?" onChange={this.handleNameChange}></input>
                        <button type='submit'></button>
                    </form>
                </div>
            </header>
            <main className='list__places__main'>
                <section >
                    {this.state.places.map(place => <Place key={place.id} id={place.id} name={place.name} scoring={place.scoring} picture={place.picture} tip={place.tip} address={place.address} />)}
                </section>
            </main>
        </div>)
    }
}

export default ListPlaces