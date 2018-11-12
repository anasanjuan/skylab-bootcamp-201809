import React from 'react'

function Landing(props) {
    return <section>
        <button className="basic__button" onClick={props.onRegisterClick}>Register</button> or <button className="basic__button" onClick={props.onLoginClick}>Login</button>
    </section>
}

export default Landing