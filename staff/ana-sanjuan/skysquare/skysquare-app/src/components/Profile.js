import React, { Component } from 'react'
import AddProfilePicture from './AddProfilePicture'
import UserTip from './UserTip'
import logic from '../logic/logic'

class Profile extends Component {
    state = { error: null, user: {}, open: false, pictures: [], tips: [], listPictures: false }

    componentDidMount() {
        try {
            logic.retrieveUser()
                .then(user => this.setState({ user }))
                .then(() => logic.listUserPictures(this.state.user.id))
                .then(pictures => this.setState({ pictures, error: null }))
                .then(() => logic.listUserTips(this.state.user.id))
                .then(tips =>  this.setState({ tips, error: null }))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }

    }
    handleClick = () => {
        this.setState({ open: !this.state.open })
    }

    handleListTips = () => {
        this.setState({ listPictures: false })
    }
    handleListPictures = () => {
        this.setState({ listPictures: true })
    }


    render() {
        return <div className="profile">
            <header className='profile__header'>
                <div className='profile__top'>
                    <button onClick={this.handleClick}><i className="fas fa-cog"></i></button>
                    <div className={this.state.open ? "profile__edit profile__edit--open" : "profile__edit"}>
                        <p>{this.state.user.email}</p>
                        <p>{this.state.user.phone}</p>
                        <p>{this.state.user.birthday}</p>
                    </div>
                    <h4>{`${this.state.user.name} ${this.state.user.surname}`}</h4>
                    <button onClick={this.props.onLogOutClick}>Log Out</button>

                </div>
                <section className='profile__info'>
                    <AddProfilePicture id={this.state.user.id} profilePicture={this.state.user.profilePicture} />
                    <div className='profile__info__tips' onClick={this.handleListTips}>
                        <h5>{this.state.tips.length}</h5>
                        <h4>Tips</h4>
                    </div>
                    <div className='profile__info__pictures' onClick={this.handleListPictures}>
                        <h5>{this.state.pictures.length}</h5>
                        <h4>Pictures</h4>
                    </div>
                </section>
                <button className='addPlace__button' onClick={this.props.onAddPlaceClick}>Add New Place</button>
            </header>
            <main className='profile__main'>
                <section>
                    {!this.state.listPictures && this.state.tips.map(tip => <UserTip key={tip.id} placeId={tip.placeId} text={tip.text} picture={tip.picture} placeName={tip.placeName} time={tip.time} scoring={tip.scoring} />)}
                    {this.state.listPictures && this.state.pictures.map(picture => <img className='basic__img' src={`${picture}`} alt='#'></img>)}
                </section>
            </main>

        </div>
    }
}

export default Profile