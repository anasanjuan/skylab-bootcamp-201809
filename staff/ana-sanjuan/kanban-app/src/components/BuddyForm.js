import React, {Component} from 'react'
import logic from '../logic'


class BuddyForm extends  Component {

    state = {buddyUsername: ''}

    handleOnChange = event => {
        const buddyUsername = event.target.value

        this.setState({buddyUsername})
    }
    handleOnSubmit = event => {
        event.preventDefault()

        this.props.OnAddBuddy(this.state.buddyUsername)
    }
    render() {
        return <div>
            <form onSubmit={this.handleOnSubmit}>
                <input onChange={this.handleOnChange} placeholder='write your buddy name here'/>
                <button>Add Buddy</button>
            </form>
        </div>
    }
}

export default BuddyForm