import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import logic from '../logic/logic'

class Profile extends Component {
    state={user:{}}

    componentDidMount() {
        logic.retrieveUser() 
            .then(user=> {
                this.setState({user})
            })

    }

    render() {
    return <div className="profile">
        <header>
            <div>
                <button onClick={this.props.onLogOutClick}>Log Out</button>
                <h1>My profile</h1>
            </div>
            <div>
                {/* <img src='{this.state.user.picture}'></img> */}
                <p>{this.state.user.name}</p>
                <p>{this.state.user.surname}</p>
                <p>{this.state.user.email}</p>
                <p>{this.state.user.phone}</p>
                <p>{this.state.user.birthday}</p>
            </div>
        </header>
        <main>
            <button onClick={this.props.onAddPlaceClick}>Add New Place</button>
            <section>
                <p>list tips and pictures</p>
            </section>
        </main>

    </div>
}
}

export default Profile