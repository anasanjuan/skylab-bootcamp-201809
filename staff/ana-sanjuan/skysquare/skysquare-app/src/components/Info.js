import React, { Component } from 'react'
import ShowMap from './ShowMap'
import logic from '../logic'

class Info extends Component {
    state = { error: null, scoring: 0, address: '', latitude: '', longitud: '', heart: '', meh: '', broken: '', visitors: null, checkIn: false, favourite: false }

    componentDidMount() {
        try {
            logic.retrievePlace(this.props.id)
                .then(place => {
                    const { scoring, address, location: { coordinates: [longitude, latitude] }, meh, heart, broken, scores, favourite, checkIn } = place

                    const visitors = scores.length

                    this.setState({ scoring, address, latitude, longitude, meh, heart, broken, visitors, favourite, checkIn, error: null })
                })
                .catch(error => this.setState({ error: error.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleClickScoring = scoring => {
        try {
            logic.updateScoring(this.props.id, scoring)
                .then(res => {
                    const { scoring, meh, heart, broken, scores } = res

                    const visitors = scores.length

                    this.setState({ scoring, meh, heart, broken, visitors, error: null })
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }

    }

    handleCheckIn = () => {
        try {
            logic.uploadCheckin(this.props.id)
                .then(res => this.setState({ checkIn: !this.state.checkIn, error: null }))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleFavourites = () => {
        try {
            logic.uploadFavourites(this.props.id)
                .then(res => this.setState({ favourite: !this.state.favourite, error: null }))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return (<main className='info'>
            <section className='info__main'>
                <section className='place__score'>
                    <h4 className='info__text upper'>Scoring</h4>
                    <p>{`${this.state.scoring} out of 10 based on ${this.state.visitors} visitors`}</p>
                    <div className='place__score__num'>
                        <div className='place__score__num__box'>
                            <div className='score'>{this.state.scoring}</div>
                        </div>
                        <div className='place__score__bars'>
                            <div className='info__bar'>
                                <p>{this.state.heart}% I love it</p>
                                <progress value={this.state.heart} max="100"></progress>
                            </div>
                            <div className='info__bar'>
                                <p>{this.state.meh}% it's fine </p>
                                <progress value={this.state.meh} max="100"></progress>
                            </div>
                            <div className='info__bar'>
                                <p>{this.state.broken}% I do not like it</p>
                                <progress value={this.state.broken} max="100"></progress>
                            </div>
                        </div>
                    </div>
                    <div className='address'>
                        <h4 className='info__text upper' >Address</h4>
                        <p>{this.state.address}</p>
                    </div>
                </section>
                <aside className="info__map">
                    <ShowMap lat={this.state.latitude} lng={this.state.longitude} />
                </aside>
            </section>
            <div className='space'></div>
            <section className='info__options'>
                <section className='info__options__item' onClick={this.handleCheckIn}>
                    <h4 className='info__text' >Check-In</h4>
                    <button>{this.state.checkIn ? <i className="fas fa-check-circle icon__green"></i> : <i className="fas fa-check-circle icon"></i>}</button>
                </section>
                <section className='info__options__item favourites' onClick={this.handleFavourites}>
                    <h4 className='info__text' >Favourites</h4>
                    <button>{this.state.favourite ? <i className="fas fa-star icon__yellow"></i> :  <i className="fas fa-star icon"></i>}</button>
                </section>
                <section className='info__options__item scoring'>
                    <h4 className='info__text'>Give a Score</h4>
                    <button type='submit' onClick={() => this.handleClickScoring('heart')}><img src={require('../images/icons/grey-heart.png')} alt='' /></button>
                    <button type='submit' onClick={() => this.handleClickScoring('meh')}><img src={require('../images/icons/grey-meh-face.png')} alt='' /></button>
                    <button type='submit' onClick={() => this.handleClickScoring('brokenHeart')}><img src={require('../images/icons/grey-broken-heart.png')} alt='' /></button>
                </section>
            </section>
        </main>)
    }
}

export default Info