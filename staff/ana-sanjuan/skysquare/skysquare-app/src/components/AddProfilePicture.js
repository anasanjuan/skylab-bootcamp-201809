import React, { Component } from 'react'
import logic from '../logic/logic'

class AddProfilePicture extends Component {
    state = { profilePicture: this.props.profilePicture, previewPicture: null, open: false }

    handleClick = () => {
        this.setState({ open: !this.state.open })
    }

    handlePictureSelect = event => {
        event.preventDefault()

        this.setState({
            previewPicture: URL.createObjectURL(event.target.files[0]),
            profilePicture: event.target.files[0]
        })

    }

    handlePictureLoad = event => {
        event.preventDefault()

        logic.UploadProfilePicture(this.state.profilePicture)
            .then(res => this.setState({ previewPicture: null, profilePicture: res, open: !this.state.open }))
    }


    render() {
        return (<div className='add-profile-picture'>
            <img  onClick={this.handleClick} src={this.props.profilePicture} alt=''></img>
            <form onSubmit={this.handlePictureLoad} className={this.state.open ? "profilePicture__edit profilePicture__edit--open" : "profilePicture__edit"} encType="multipart/form-data" >
                <input type="file" name="pic" accept="image/*" onChange={this.handlePictureSelect}></input>
                <button type='submit'>Load Picture</button>
            </form>
        </div>

        )
    }

}

export default AddProfilePicture