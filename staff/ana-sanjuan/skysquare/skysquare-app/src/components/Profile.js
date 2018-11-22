import React from 'react'

function Profile(props) {

    return<div>
        <button onClick={props.onLogOutClick}>Log Out</button>
    </div>
}

export default Profile