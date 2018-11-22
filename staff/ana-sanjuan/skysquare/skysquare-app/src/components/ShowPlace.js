import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Place from './Place'
import logic from '../logic/logic'

class showPlace extends Component {
    state = { place: []}

    componentDidMount() {
        logic.retrievePlace(this.props.id)
            .then(place => {
                this.setState({ place })
            })

    }
    render() {
        return (<div className='show__place'>
            <header className= 'show__place__header'>
                <Link to={'/home'}><i className="fas fa-arrow-left" onClick={this.props.OnGoBack}></i></Link>
                <input className='input_box' type='text' placeholder={this.props.filter}></input>
            </header>
            <main className='show__place__main'>
                
            </main>
        </div>)
    }
}

export default showPlace