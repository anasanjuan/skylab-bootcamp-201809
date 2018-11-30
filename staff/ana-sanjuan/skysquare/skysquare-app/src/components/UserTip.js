import React from 'react'
import { Link } from 'react-router-dom'

function UserTip(props) {
    return <section className='tip'>
        <Link to={`/home/place/${props.placeId}`}>
            <div className='tip__top'>
                <div className='tip__top__img'>
                    <img className='basic__img' src={props.picture} alt='#'></img>
                </div>
                <div className='tip__info'>
                    <h5>{props.placeName}</h5>
                    <h6>{props.time}</h6>
                </div>
                <div >
                    <div className='score'>{props.scoring}</div>
                </div>
            </div>

            <p className='tip__text'>{props.text}</p>
        </Link>
    </section>
}
export default UserTip

