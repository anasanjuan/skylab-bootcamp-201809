import React, {Component} from 'react'

class Login extends Component {
    state = { username: '', password: '' }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { username, password } = this.state

        this.props.onLogin(username, password)
    }

    render() {
        return <div className="form__container">
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                <button className="basic__button" type="submit">Login</button> 
            </form>
            <button className="back__button" onClick={this.props.onGoBack}>back</button>
        </div>
    }
}

export default Login