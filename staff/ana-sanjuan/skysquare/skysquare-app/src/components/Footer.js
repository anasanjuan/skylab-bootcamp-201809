import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Footer extends Component {
    state = {}
    render() {
        return <footer className="footer" >
            <nav className="footer__nav">
                <ul>
                    <Link to={'/home'}>
                        <li className="nav-items">
                            <i className="fas fa-search"></i>
                            <h5>Search</h5>
                        </li>
                    </Link>
                    <Link to={'/myLists'}>
                        <li className="nav-items">
                            <i className="fas fa-list-ul"></i>
                            <h5>Lists</h5>
                        </li>
                    </Link>
                    <Link to={'/history'}>
                        <li className="nav-items">
                            <i className="fas fa-history"></i>
                            <h5>History</h5>
                        </li>
                    </Link>
                    <Link to={'/profile'}>
                        <li className="nav-items">
                            <i className="far fa-user"></i>
                            <h5>Profile</h5>
                        </li>
                    </Link>
                </ul>
            </nav>
        </footer>
    }
}

export default Footer