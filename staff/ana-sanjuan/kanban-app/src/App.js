import React, { Component } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import Postits from './components/Postits'
import Error from './components/Error'
import Landing from './components/Landing'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'

logic.url = 'http://localhost:5000/api'

class App extends Component {
    state = { error: null }

    handleRegisterClick = () => this.setState({ error: null }, () => this.props.history.push('/register'))

    handleLoginClick = () => this.setState({ error: null }, () => this.props.history.push('/login'))

    handleRegister = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/login'))
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogin = (username, password) => {
        try {
            logic.login(username, password)
                .then(() => this.setState({ error: null }, () => this.props.history.push('/postits')))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogoutClick = () => {
        logic.logout()

        this.setState({ error: null }, () => this.props.history.push('/'))
    }

    handleRegisterClick = () => this.setState({ error: null }, () => this.props.history.push('/register'))

    handleGoBack = () => this.setState({ error: null }, () => this.props.history.push('/'))

    handleBackToPostits  = () => this.setState({ error: null }, () => this.props.history.push('/postits'))

    handleProfile = () => this.setState({ error: null }, () => this.props.history.push('/profile'))

    render() {
        const { error } = this.state

        return <div>
            <Route exact path="/" render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} /> : <Redirect to="/postits" />} />
            <Route path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            <Route path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.handleLogin} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            {error && <Error message={error} />}

            <Route path="/postits" render={() => logic.loggedIn ? <div>
                <section><button className="basic__button" onClick={this.handleLogoutClick}>Logout</button></section>
                <button onClick={this.handleProfile} className="basic__button">Profile</button>
                <Postits />
            </div> : <Redirect to="/" />} />

            <Route path="/profile" render={() => logic.loggedIn ? <div>
                <Profile onGoBack={this.handleBackToPostits}/>
            </div> : <Redirect to="/" />} />

        </div>
    }
}

export default withRouter(App)
