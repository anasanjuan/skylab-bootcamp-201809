import React, { Component } from 'react';
import logic from './logic/logic'
import Landing from './components/Landing';
import Register from './components/Register';
import LogIn from './components/LogIn';
import Error from './components/Error';


import { Route, withRouter, Redirect } from 'react-router-dom'

class App extends Component {
    state = { error: null }

    handleRegisterClick = () => this.props.history.push('/register')

    handleRegister = (name, surname, email, password, birthday, gender, phone) => {
        try {
            logic.register(name, surname, email, password, birthday, gender, phone)
                .then(() => {
                    debugger
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
                    
                    // this.setState({ error: null }, () => this.props.history.push('/home'))
                })

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleGoBack = () => {
        this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <Route exact path='/' render={() => <Landing onRegisterClick={this.handleRegisterClick} onLogInClick={this.handleLogInClick} />} />
                <Route path='/register' render={() => <Register onRegister={this.handleRegister} OnGoBack={this.handleGoBack} onLogInClick={this.handleLogInClick} />} />
                <Route path='/logIn' render={() => <LogIn onLogIn={this.handleLogIn} OnGoBack={this.handleGoBack} />} />
                {/* <Route path='/home' render={() => <Home onLogIn={this.handleLogIn} OnGoBack={this.handleGoBack} />} /> */}

                {this.state.error && <Error message={this.state.error} />}
            </div>
        );
    }
}

export default withRouter(App)
