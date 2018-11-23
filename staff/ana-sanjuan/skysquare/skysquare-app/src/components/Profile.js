import React from 'react'

function Profile(props) {

    debugger
    return <div className="profile">
        <header>
            <div>
                <button onClick={props.onLogOutClick}>Log Out</button>
                <h1>My profile</h1>
            </div>
            <div>
                <img></img>
                <p>Number tips</p>
                <p>Number pics</p>
            </div>
        </header>
        <main>
            <section>
                <h2>Add a New Place</h2>
            </section>
            <section>
                <p>list tips and pictures</p>
            </section>
        </main>

    </div>
}

export default Profile