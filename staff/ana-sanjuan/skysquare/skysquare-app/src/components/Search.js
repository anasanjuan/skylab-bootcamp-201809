import React, { Component } from 'react'
import {Link} from 'react-router-dom'

class Search extends Component {
    state = {name:''}

    handleNameChange = event => {
        const name = event.target.value

        this.setState({name})
    }

    handleSearchSubmit = event => {
        event.preventDefault()

        this.props.onSearchSubmit(this.state.name)
    }

    render() {
        return <div className= "search">
            <header className="search__header">
                <section className="title">
                    <h1>SkySquare</h1>
                    <h2>City Guide</h2>
                </section>
            </header>
            <main className = "search__main" >
                <form onSubmit={this.handleSearchSubmit}>
                    <input className="search__box" type='text' placeholder="¿Qué estás buscando?" onChange={this.handleNameChange}></input>
                    <button type='submit'></button>
                </form>
                <div className="filter">
                    <div className="filter__top">
                        <Link to={'/home/filter/breakfast'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Breakfast</p>
                        </section>
                        </Link>
                        <Link to={'/home/filter/lunch'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Lunch</p>
                        </section>
                        </Link>
                        <Link  to={'/home/filter/dinner'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Dinner</p>
                        </section>
                        </Link>
                    </div>
                    <div className="filter__bottom">
                    <Link  to={'/home/filter/coffee'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Coffee and tea</p>
                        </section>
                        </Link>
                        <Link to={'/home/filter/nigthLife'}>
                        <section className="filter__card">
                            <p><i className="fas fa-glass-martini-alt"></i></p>
                            <p>Night Life</p>
                        </section>
                        </Link>
                        <Link to={'/home/filter/thingsToDo'}>
                        <section className="filter__card">
                            <p><i className="fas fa-theater-masks"></i></p>
                            <p>Things <br /> to do</p>
                        </section>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    }
}

export default Search
