import React from 'react'

function Error(props) {
    return <div onClick={props.onErrorOkClick}>
        <p className={props.className}>{props.message}</p>
    </div>
}

export default Error
// module.exports = logic
