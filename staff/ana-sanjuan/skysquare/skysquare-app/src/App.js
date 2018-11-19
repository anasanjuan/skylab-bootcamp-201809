import React, { Component } from 'react';
import logic from './logic/logic'
import Landing from './components/Landing';
import Register from './components/Register';
import LogIn from './components/LogIn';
import Home from './components/Home';
import Error from './components/Error';


import { Route, withRouter, Redirect } from 'react-router-dom'

class App extends Component {
    state = { error: null }

    handleRegisterClick = () => this.props.history.push('/register')

    handleRegister = (name, surname, email, password, birthday, gender, phone) => {
        try {
            logic.register(name, surname, email, password, birthday, gender, phone)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/logIn'))
                })
                .catch(error => this.setState({ error: error.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogInClick = () => this.props.history.push('/logIn')

    handleLogIn = (email, password) => {
        try {
            logic.logIn(email, password)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/home'))
                })

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleRegisterGoBack = () => {
        this.setState({ error: null }, () => this.props.history.push('/'))
        
    }

    handleLogInGoBack = () => {
        this.setState({ error: null }, () => this.props.history.push('/register'))
    }

    handleLogoutClick = () => {
        logic.logOut()
    }

    render() {
        return (<div>
                <Route exact path='/' render={() => !logic.loggedIn? <Landing onRegisterClick={this.handleRegisterClick} onLogInClick={this.handleLogInClick} />: <Redirect to="/home"/>} />
                <Route path='/register' render={() => !logic.loggedIn? <Register onRegister={this.handleRegister} OnGoBack={this.handleRegisterGoBack} onLogInClick={this.handleLogInClick} />: <Redirect to="/home"/>} />
                <Route path='/logIn' render={() => !logic.loggedIn? <LogIn onLogIn={this.handleLogIn} OnGoBack={this.handleLogInGoBack} />: <Redirect to="/home"/>} />
                {this.state.error && <Error message={this.state.error} />}
                <Route path='/home' render={() => logic.loggedIn? <Home onLogOutClick={this.handleLogoutClick} />:<Redirect to="/"/>} />
            </div>
        );
    }
}

export default withRouter(App)
