import React from 'react'

function Place (props) {
    return(<div className='place'>
        <img></img>
        <h1>{props.name}</h1>
        <p>lorem lorem</p>
        <div className='score'>{props.scoring}</div>
    </div>)
}

export default Place