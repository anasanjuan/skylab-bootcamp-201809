import React, { Component } from 'react'
import logic from '../logic/logic'
import Place from './Place'

class History extends Component {
    state = { error: null, checkins: [] }
    componentDidMount() {
        try {
            logic.listCheckIns()
                .then(res => this.setState({ checkins: res, error: null }))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return <div className='history'>
            <header className='blue__header'>
                <h1>My history</h1>
            </header>
            <main className='history__main'>
                {/* {this.state.checkins.map(check => <div>
                    <img src={check.picture} alt=''></img>
                    <h1>{check.name}</h1>
                    <h6>{check.address}</h6>
                    <div className='score'>{check.scoring}</div>
                </div>)} */}
                {this.state.checkins.map(check => <Place key={check.placeId} id={check.placeId} name={check.name} scoring={check.scoring} picture={check.picture} tip={check.tip} address={check.address} />)}
            </main>
        </div>
    }
}

export default History