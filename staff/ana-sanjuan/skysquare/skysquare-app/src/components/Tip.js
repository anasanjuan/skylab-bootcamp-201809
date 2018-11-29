import React from 'react'

function Tip(props) {
    return <section>
        <div><img src={props.userPicture} alt='#'></img></div>
        <div>
            <h5>{`${props.userName} ${props.userSurname}`}</h5>
            <h6>{props.time}</h6>
        </div>
        <p>{props.text}</p>
    </section>
}
export default Tip


