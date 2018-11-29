import React, { Component } from 'react'
import ShowMap from './ShowMap'
import logic from '../logic/logic'

class Info extends Component {
    state = { scoring: 0, address: '', latitude: '', longitud: '', error: null, heart: '', meh:'', broken:'', visitors: null, checkIn: false, favourite: false }

    componentDidMount() {
        logic.retrievePlace(this.props.id)
            .then(place => {
                const { scoring, address, latitude, longitud, meh, heart, broken, scores, favourite, checkIn } = place

                const visitors = scores.length

                this.setState({ scoring, address, latitude, longitud, meh, heart, broken, visitors, favourite, checkIn })
            })
            .catch(error => this.setState({ error: error.message }))
    }

    handleClickScoring = scoring => {
        logic.updateScoring(this.props.id, scoring)
            .then(res => {
                const {scoring, meh, heart, broken, scores} = res

                const visitors = scores.length

                this.setState({scoring, meh, heart, broken, visitors})
            })

    }

    handleCheckIn = () => {
        logic.uploadCheckin(this.props.id)
            .then(res =>  this.setState({checkIn: !this.state.checkIn}))
    }

    handleFavourites= () => {
        logic.uploadFavourites(this.props.id)
            .then(res => this.setState({favourite: !this.state.favourite}))
    }

    render() {
        return (<main className='info'>
            <section className='info__main'>
                <section>
                    <p>{`${this.state.scoring} out of 10 based on ${this.state.visitors} visitors`}</p>
                    <div className='current__scoring'>
                    <div className='current__scoring_score'>
                            <div className='score'>{this.state.scoring}</div>
                        </div>
                        <div>
                            <div className='info__bar'>
                                <p>{this.state.heart}% I love it</p>
                                <progress value={this.state.heart}  max="100"></progress>
                            </div>
                            <div className='info__bar'>
                                <p>{this.state.meh}% it's fine </p>
                                <progress value={this.state.meh}  max="100"></progress>
                            </div>
                            <div className='info__bar'>
                                <p>{this.state.broken}% I do not like it</p>
                                <progress value={this.state.broken}  max="100"></progress>
                            </div>
                        </div>
                    </div>
                    <div className='address'>
                        <h4>Address</h4>
                        <p>{this.state.address}</p>
                    </div>
                </section>
                <aside className="map">
                    <ShowMap lat={this.state.latitude} lng={this.state.longitud} />
                </aside>
            </section>
            <div className='space'></div>
            <section className='info__options'>
                <section className='info__options__item' onClick={this.handleCheckIn}>
                    <h4>Check-In</h4>
                    <button><img src={this.state.checkIn? require('../images/icons/green-checkIn.png'): require('../images/icons/grey-checkin.png')} alt='' /></button>
                </section>
                <section className='info__options__item favourites' onClick={this.handleFavourites}>
                    <h4>Favourites</h4>
                    <button><img src={this.state.favourite? require('../images/icons/red-heart.png') : require('../images/icons/grey-heart.png') } alt='' /></button>
                </section>
                <section className='info__options__item scoring'>
                    <h4>Give a Score</h4>
                    <button type='submit' onClick={() => this.handleClickScoring('heart')}><img src={require('../images/icons/grey-heart.png')} alt='' /></button>
                    <button type='submit' onClick={() => this.handleClickScoring('meh')}><img src={require('../images/icons/grey-meh-face.png')} alt='' /></button>
                    <button type='submit' onClick={() => this.handleClickScoring('brokenHeart')}><img src={require('../images/icons/grey-broken-heart.png')} alt='' /></button>
                </section>
                {/* <button name='scoring' value='heart' className={this.state.heart ? "heart__button heart__button--true" : "heart__button"} onClick={this.handleClickHeart}><img src={require('../images/icons/grey-heart.png')} /></button>
                        <button name='scoring' value='heart' className={this.state.meh ? "heart__button heart__button--true" : "heart__button"} onClick={this.handleClickHeart}><img src={require('../images/icons/grey-meh-face.png')} /></button>
                        <button name='scoring' value='meh' className={this.state.brokenHeart ? "meh__button meh__button--true" : "meh__button"} onClick={this.handleClickMeh}><img src={require('../images/icons/grey-broken-heart.png')} /></button>
                     */}
            </section>
        </main>)
    }
}

export default Info