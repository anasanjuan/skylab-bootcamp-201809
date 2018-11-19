import React from 'react'

function Landing(props) {
    return (<div>
        <div className="landing">
            <header className="landing__header">
                <section className="title">
                    <h1>SkySquare</h1>
                    <h2>City Guide</h2>
                </section>
                <section className="landing__subtitle">
                    Skysquare knows what you like and <br /> will bring you to places you will love
                </section>
            </header>
            <main>
                <button className="landing__register" onClick={props.onRegisterClick}>Register with your email</button>
            </main>
        </div>
        <footer>
            <button className="footer__logIn" onClick={props.onLogInClick}>¿Do you already have an account? Log In now!</button>
        </footer>
    </div>
    );


}

export default Landing