import React from 'react'
import { Link } from 'react-router-dom'

function Place(props) {
    return (<div className='list__place__item'>
        <Link to={`/home/place/${props.id}`}>
            <header className='list__place__item__header'>
                <div> <img alt='' src={props.picture} ></img></div>
                <div>
                    <h1>{props.name}</h1>
                    <p>lorem lorem</p>
                </div>
                <div className='score'>{props.scoring}</div>
            </header>
            <p>lorem tip lorem tip</p>
        </Link>
    </div>)
}

export default Place