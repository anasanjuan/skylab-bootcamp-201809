import React from 'react'

function UserTip(props) {
    return <section>
        <div><img src={props.picture} alt='#'></img></div>
        <div>
            <h5>{props.placeName}</h5>
            <h6>{props.time}</h6>
        </div>
        <div className='place__score'>
            <div className='score'>{props.scoring}</div>
        </div>
        <p>{props.text}</p>
    </section>
}
export default UserTip


