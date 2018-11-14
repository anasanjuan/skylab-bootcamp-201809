import React, { Component } from 'react'
const logic = require('../logic')
class Post extends Component {
    state = { text: this.props.text, status: this.props.status, buddies: this.props.buddies, assignTo: this.props.assignTo }


    handleChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleBlur = () => {
        this.props.onUpdatePost(this.props.postitId, this.state.text)
    }

    handleStatusChange = event => {
        event.preventDefault()

        const status = event.target.value

        this.setState({ status })

        this.props.onChangeStatus(this.props.postitId, status)
    }

    handleAssignToChange = event => {
        event.preventDefault()

        const assignTo = event.target.value

        this.setState({assignTo})

        this.props.OnChangeAssignTo(this.props.postitId, assignTo)
    }

    render() {
        return <article className="post">
            <textarea defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} />
            <select className="post__dropdown" onChange={this.handleAssignToChange} defaultValue = {this.props.assignTo?this.props.assignTo: 'select buddy' } >
                {this.props.buddies.map(buddy => <option value={buddy}>{buddy}</option>)}
            </select>
            <select className="post__dropdown" onChange={this.handleStatusChange} defaultValue = {this.state.status}>
                <option value="TODO">To Do</option>
                <option value="DOING">Doing</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Done</option>
            </select>

            <button className="post__trash" onClick={()=> this.props.onDeletePost(this.props.postitId)}><i className="far fa-trash-alt"></i></button>
        </article>
    }
}

export default Post