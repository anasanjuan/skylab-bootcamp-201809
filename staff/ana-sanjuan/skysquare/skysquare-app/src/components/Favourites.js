import React, { Component } from 'react'
import logic from '../logic/logic'
import Place from './Place'

class Favourites extends Component {
    state = { error: null, favourites: [] }

    componentDidMount() {
        try {
            logic.listFavourites()
                .then(res => this.setState({ favourites: res, error: null }))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return <div className='favourites'>
            <header className='blue__header'>
                <h1>My favourite places</h1>
            </header>
            <main className='favourites__main'>
                {this.state.favourites.map(fav => <Place key={fav.placeId} id={fav.placeId} name={fav.name} scoring={fav.scoring} picture={fav.picture} tip={fav.tip} address={fav.address} />)}
            </main>
        </div>
    }
}

export default Favourites