import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import PostAssignTo from './PostAssignTo'
import Post from './Post'
import Error from './Error'
import BuddyForm from './BuddyForm'

class Postits extends Component {
    state = { assignToUsername: [], buddies: [], postits: [], assignPostits:[], error: null }

    componentDidMount() {
        logic.listPostits()
            .then(_postits => {
                const [postits, assignPostits] = _postits

                this.setState({ postits, assignPostits })
            })
            .then(() => logic.listBuddies())
            .then(buddies => {
                this.setState({ buddies })
            })
    }

    handleSubmit = (text, status) => {
        try {
            logic.addPostit(text, status)
                .then(() => logic.listPostits())
                .then(_postits => {
                    const [postits, assignPostits] = _postits
    
                    this.setState({ postits, assignPostits })
                })
                .catch (error =>
                    this.setState({ error: error.message })
                )
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleAddBuddy = (buddyUsername) => {
        try {
            logic.addBuddy(buddyUsername)
                .then(() => logic.listPostits())
                .then(_postits => {
                    const [postits, assignPostits] = _postits
    
                    this.setState({ postits, assignPostits })
                })
                .then(() => logic.listBuddies())
                .then(buddies => {
                    this.setState({ buddies })
                })
                .catch (error =>
                    this.setState({ error: error.message })
                )
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleRemovePostit = id => {
        try {
            logic.removePostit(id)
                .then(() => logic.listPostits())
                .then(_postits => {
                    const [postits, assignPostits] = _postits
    
                    this.setState({ postits, assignPostits })
                })
                .catch (error =>
                    this.setState({ error: error.message })
                )
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleModifyPostit = (postitId, text) => {
        try {
            logic.modifyPostit(postitId, text)
                .then(() => logic.listPostits())
                .then(_postits => {
                    const [postits, assignPostits] = _postits
    
                    this.setState({ postits, assignPostits })
                })
                .catch (error =>
                    this.setState({ error: error.message })
                )
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleChangeStatus = (postitId, status) => {
        try {
            logic.modifyPostitStatus(postitId, status)
                .then(() => logic.listPostits())
                .then(_postits => {
                    const [postits, assignPostits] = _postits
    
                    this.setState({ postits, assignPostits })
                })
                .catch (error =>
                    this.setState({ error: error.message })
                )
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleChangeAssignTo = (postitId, assignToUsername) => {
        try {
            logic.assignBuddy(postitId, assignToUsername)
                .then(()=> {
                    this.setState({assignToUsername})
                })
                .then(() => logic.listPostits())
                .then(_postits => {
                    const [postits, assignPostits] = _postits
    
                    this.setState({ postits, assignPostits })
                })
                .then(() => logic.listBuddies())
                .then(buddies => {
                    this.setState({ buddies })
                })
                .catch (error =>
                    this.setState({ error: error.message })
                )
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    render() {
        return <div>
            <h1 className="title">Kanban App </h1>
            <BuddyForm OnAddBuddy={this.handleAddBuddy}  />
            {this.state.error && <Error message={this.state.error} />}
            <div className="kanbanContainer">
                <section className="column1">
                    <h2>To do</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"TODO"} />
                    {this.state.error && <Error message={this.state.error} />}
                    <section >
                        {this.state.postits.filter(post => post.status === 'TODO').map(postit => <Post assignTo={postit.assignTo} status={"TODO"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} /> )}
                        {this.state.assignPostits.filter(post => post.status === 'TODO').map(postit => <PostAssignTo assignTo={postit.assignTo} status={"TODO"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column2">
                    <h2>Doing</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"DOING"} />
                    <section >
                        {this.state.postits.filter(post => post.status === 'DOING').map(postit => <Post assignTo={postit.assignTo} status={"DOING"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} /> )}
                        {this.state.assignPostits.filter(post => post.status === 'DOING').map(postit => <PostAssignTo assignTo={postit.assignTo} status={"DOING"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column3">
                    <h2>Review</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"REVIEW"} />
                    <section >
                        {this.state.postits.filter(post => post.status === 'REVIEW').map(postit => <Post assignTo={postit.assignTo} status={"REVIEW"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} /> )}
                        {this.state.assignPostits.filter(post => post.status === 'REVIEW').map(postit => <PostAssignTo assignTo={postit.assignTo} status={"REVIEW"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                   </section>
                </section>

                <section className="column4">
                    <h2>Done</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"DONE"} />
                    <section >
                        {this.state.postits.filter(post => post.status === 'DONE').map(postit => <Post assignTo={postit.assignTo} status={"DONE"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} /> )}
                        {this.state.assignPostits.filter(post => post.status === 'DONE').map(postit => <PostAssignTo assignTo={postit.assignTo} status={"DONE"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                   </section>
                </section>
            </div>
        </div>
    }
}

export default Postits
