import React, { Component } from 'react';

class Home extends Component {
    state = {}
    
    render() {
        return <div>
            <header className="header__home">
                <section className="title">
                    <h1>SkySquare</h1>
                    <h2>City Guide</h2>
                </section>
            </header>
            <main className = "main__home" >
                <input className="search" type='text' placeholder="¿Qué estás buscando?"></input>
                <div className="filter">
                    <div className="filter__top">
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Breakfast</p>
                        </section>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Lunch</p>
                        </section>
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Dinner</p>
                        </section>
                    </div>
                    <div className="filter__bottom">
                        <section className="filter__card">
                            <p><i className="fas fa-coffee"></i></p>
                            <p>Coffee and tea</p>
                        </section>
                        <section className="filter__card">
                            <p><i className="fas fa-glass-martini-alt"></i></p>
                            <p>Night Life</p>
                        </section>
                        <section className="filter__card">
                            <p><i className="fas fa-theater-masks"></i></p>
                            <p>Things <br /> to do</p>
                        </section>
                    </div>
                </div>
            </main>
            <footer className = "footer__home" >
                <nav className="footer__nav">
                    <ul>
                        <li className="nav-items">
                            <i className="fas fa-search"></i>
                            <h5>Buscar</h5>
                        </li>
                        <li className="nav-items"><i className="fas fa-list-ul"></i>
                            <h5>Listas</h5>
                        </li>
                        <li className="nav-items"><i className="fas fa-history"></i>
                            <h5>Historial</h5>
                        </li>
                        <li className="nav-items"><i className="far fa-user"></i>
                            <h5>Mi perfil</h5>
                        </li>
                    </ul>
                </nav>
            </footer>
        </div>
    }
}

export default Home
