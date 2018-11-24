import React, { Component } from 'react'
import logic from '../logic/logic'

class Pictures extends Component {
    state = { pictures: [] }

    componentDidMount() {
        logic.listPictures(this.props.id)
            .then(pictures => this.setState({ pictures }))
    }
    
    render() {
        return (<div className='pictures'>
            <main className='pictures__main'>
                {this.state.pictures.map(picture => <img src={`${picture}`} alt='#'></img>)}
            </main>
        </div>)
    }
}

export default Pictures