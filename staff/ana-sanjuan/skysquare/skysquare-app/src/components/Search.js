import React, { Component } from 'react'
import {Link} from 'react-router-dom'

class Search extends Component {
    state = {}

    render() {
        return <div className= "search">
            <header className="search__header">
                <section className="title">
                    <h1>SkySquare</h1>
                    <h2>City Guide</h2>
                </section>
            </header>
            <main className = "search__main" >
                <input className="search__box" type='text' placeholder="¿Qué estás buscando?"></input>
                <div className="filter">
                    <div className="filter__top">
                        <Link to={'/home/breakfast'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Breakfast</p>
                        </section>
                        </Link>
                        <Link to={'/home/lunch'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Lunch</p>
                        </section>
                        </Link>
                        <Link  to={'/home/dinner'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Dinner</p>
                        </section>
                        </Link>
                    </div>
                    <div className="filter__bottom">
                    <Link  to={'/home/coffee'}>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Coffee and tea</p>
                        </section>
                        </Link>
                        <Link to={'/home/nigthLife'}>
                        <section className="filter__card">
                            <p><i className="fas fa-glass-martini-alt"></i></p>
                            <p>Night Life</p>
                        </section>
                        </Link>
                        <Link to={'/home/thingsToDo'}>
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
