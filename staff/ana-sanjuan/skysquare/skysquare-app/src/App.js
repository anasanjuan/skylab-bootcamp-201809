import React, { Component } from 'react'
import logic from './logic/logic'
import Landing from './components/Landing'
import Register from './components/Register'
import LogIn from './components/LogIn'
import Search from './components/Search'
import Favourites from './components/Favourites'
import History from './components/History'
import ListPlaces from './components/ListPlaces'
import Info from './components/Info'
import AddPlace from './components/AddPlace'
import Pictures from './components/Pictures'
import Tips from './components/Tips'
import Error from './components/Error'
import Footer from './components/Footer'
import Profile from './components/Profile'
import PlaceHeader from './components/PlaceHeader'
import { Route, withRouter, Redirect } from 'react-router-dom'

// logic.url = 'http://192.168.0.37:5000/api'
logic.url = 'http://localhost:5000/api'

class App extends Component {
    state = { error: null, placesByName: []}

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
                .catch(error => this.setState({ error: error.message }))

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
        
        this.setState({ error: null }, () => this.props.history.push('/'))
        
    }

    handleAddPlaceClick = () => {
        this.setState({ error: null }, () => this.props.history.push('/home/add-place'))

    }

    handleOnAddPlaceSubmit = (name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife,thingsToDo) => {
        try {
            logic.AddPlace(name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife,thingsToDo)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/home/profile'))
                })
                .catch(error => this.setState({ error: error.message }))

        } catch(err) {
            this.setState({error: err.message})
        }
    }

    handleSearchSubmit = name => {
        this.setState({ error: null }, () => this.props.history.push(`/home/name/${name}`))
    }

    renderPlace(placeId) {
        return (<div>
            <PlaceHeader id={placeId} />
            <Route exact path='/home/place/:id' render={props => logic.loggedIn ? <Info id={props.match.params.id} /> : <Redirect to="/logIn" />} />
            <Route path='/home/place/:id/pictures' render={props => logic.loggedIn ? <Pictures key={props.match.params.id} id={props.match.params.id} /> : <Redirect to="/logIn" />} />
            <Route path='/home/place/:id/tips' render={props => logic.loggedIn ? <Tips id={props.match.params.id} /> : <Redirect to="/logIn" />} />
        </div>)

    }
    renderHome() {
        return (<div className='home'>
            <div className='main'>
                {this.state.error && <Error message={this.state.error} />}
                <Route exact path='/home' render={() => logic.loggedIn ? <Search onSearchSubmit={this.handleSearchSubmit}/> : <Redirect to="/logIn" />} />
                <Route exact path='/home/filter/:filter' render={props => logic.loggedIn ? <ListPlaces type={'filter'} filter={props.match.params.filter} /> : <Redirect to="/logIn" />} />
                <Route exact path='/home/name/:name' render={props => logic.loggedIn ? <ListPlaces type={'name'} name={props.match.params.name} /> : <Redirect to="/logIn" />} />                
                <Route path='/home/place/:id' render={props => logic.loggedIn ? this.renderPlace(props.match.params.id) : <Redirect to="/logIn" />} />
                <Route path='/home/favourites' render={() => logic.loggedIn ? <Favourites /> : <Redirect to="/logIn" />} />
                <Route path='/home/history' render={() => logic.loggedIn ? <History /> : <Redirect to="/logIn" />} />
                <Route path='/home/profile' render={() => logic.loggedIn ? <Profile onAddPlaceClick= {this.handleAddPlaceClick} onLogOutClick={this.handleLogoutClick} /> :<Redirect to="/logIn" />} />
                <Route path='/home/add-place' render={() => logic.loggedIn ? <AddPlace onAddPlace= {this.handleOnAddPlaceSubmit}/> :<Redirect to="/logIn" />} />
            </div>
            <Footer />
        </div>)
    }
    render() {
        return (<div>
            {this.state.error && <Error message={this.state.error} />}
            <Route exact path='/' render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLogInClick={this.handleLogInClick} /> : <Redirect to="/home" />} />
            <Route path='/register' render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} OnGoBack={this.handleRegisterGoBack} onLogInClick={this.handleLogInClick} /> : <Redirect to="/home" />} />
            <Route path='/logIn' render={() => !logic.loggedIn ? <LogIn onLogIn={this.handleLogIn} OnGoBack={this.handleLogInGoBack} /> : <Redirect to="/home" />} />
            <Route path='/home' render={() => logic.loggedIn ? this.renderHome() : <Redirect to="/logIn" />} />

        </div>
        );
    }
}

export default withRouter(App)
