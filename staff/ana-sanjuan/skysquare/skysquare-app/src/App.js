import React, { Component } from 'react'
import logic from './logic/logic'
import Landing from './components/Landing'
import Register from './components/Register'
import LogIn from './components/LogIn'
import Search from './components/Search'
import Mylists from './components/Mylists'
import History from './components/History'
import ListPlaces from './components/ListPlaces'
import ShowPlace from './components/ShowPlace'
import Error from './components/Error'
import Footer from './components/Footer'
import Profile from './components/Profile'



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
    
    // renderPlace() {

    // }
    renderHome() {
        return(<div className='home'>
                <div className='main'>
                <Route exact path='/home' render={() => logic.loggedIn? <Search />:<Redirect to="/logIn"/>} />
                <Route path='/home/:filter' render={props => logic.loggedIn? <ListPlaces filter={props.match.params.filter}/>:<Redirect to="/logIn"/>} />
                <Route path='/home/place/:placeId' render={(props) => logic.loggedIn? <ShowPlace/>:<Redirect to="/logIn"/>} />
                {/* <Route path='/home/showRestaurant' render={() => logic.loggedIn? <ShowRestarurant />:<Redirect to="/logIn"/>} /> */}
                {/* <Route path='/home/breakfast' render={() => logic.loggedIn? <ListRestaurants filter={'breakfast'}  />:<Redirect to="/logIn"/>} /> */}
                <Route path='/home/myLists' render={() => logic.loggedIn? <Mylists  />:<Redirect to="/logIn"/>} />
                <Route path='/home/history' render={() => logic.loggedIn? <History />:<Redirect to="/logIn"/>} />
                <Route path='/home/profile' render={() => logic.loggedIn? <Profile onLogOutClick={this.handleLogoutClick} />:<Redirect to="/logIn"/>} />
                </div>
                <Footer />
        </div>)
    }
    render() {
        return (<div>
                <Route exact path='/' render={() => !logic.loggedIn? <Landing onRegisterClick={this.handleRegisterClick} onLogInClick={this.handleLogInClick} />: <Redirect to="/home"/>} />
                <Route path='/register' render={() => !logic.loggedIn? <Register onRegister={this.handleRegister} OnGoBack={this.handleRegisterGoBack} onLogInClick={this.handleLogInClick} />: <Redirect to="/home"/>} />
                <Route path='/logIn' render={() => !logic.loggedIn? <LogIn onLogIn={this.handleLogIn} OnGoBack={this.handleLogInGoBack} />: <Redirect to="/home"/>} />
                {this.state.error && <Error message={this.state.error} />}
                <Route path='/home' render={() => logic.loggedIn? this.renderHome():<Redirect to="/logIn"/>} />

            </div>
        );
    }
}

export default withRouter(App)
