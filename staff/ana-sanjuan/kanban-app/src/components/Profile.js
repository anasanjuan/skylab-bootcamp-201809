import React, {Component} from 'react'
import logic from '../logic'
import Error from './Error'

class Profile extends Component {
    state = {  error: '', name: '', surname: '', username: '', password: '', newPassword: '' , repPassword: ''  }

   
    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleNewPasswordChange = event => {
        const newPassword = event.target.value

        this.setState({ newPassword })
    }

    handleRepPasswordChange = event => {
        const repPassword = event.target.value

        this.setState({ repPassword })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, username, password, newPassword, repPassword } = this.state

        
        if(newPassword !== repPassword) {
            this.setState({ error: 'new passwords do not match' })
        } else {
            logic.updateProfile(name, surname, username, newPassword, password)

            this.setState({ error: '' })
        }  
    }

    render() {
        return <div>
            {this.state.error && <Error message={this.state.error} />}
            <img alt=''></img>
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Name" onChange={this.handleNameChange} />
                <input type="text" placeholder="Surname" onChange={this.handleSurnameChange} />
                <input type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                <input type="password" placeholder="Select a new password" onChange={this.handleNewPasswordChange} />
                <input type="password" placeholder="Repeat the new password" onChange={this.handleRepPasswordChange} />
                <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />

                <button className="basic__button" type="submit">Update</button> 
            </form>
            <button className="back__button" onClick={this.props.onGoBack}>back</button>
        </div>
    }
}

export default Profile
