import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'
import Error from './Error'
import BuddyForm from './BuddyForm'

class Postits extends Component {
    state = { assignToUsername: [], buddies: [], postits: [], toDoPostits: [], doingPostits: [], reviewPostits: [], donePostits: [], error: null }

    componentDidMount() {
        logic.listPostits()
            .then(postits => {

                const toDoPostits = postits.filter(post => post.status === "TODO")
                const doingPostits = postits.filter(post => post.status === "DOING")
                const reviewPostits = postits.filter(post => post.status === "REVIEW")
                const donePostits = postits.filter(post => post.status === "DONE")

                this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
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
                .then(postits => {
                    const toDoPostits = postits.filter(post => post.status === "TODO")
                    const doingPostits = postits.filter(post => post.status === "DOING")
                    const reviewPostits = postits.filter(post => post.status === "REVIEW")
                    const donePostits = postits.filter(post => post.status === "DONE")

                    this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
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
                .then(postits => {
                    const toDoPostits = postits.filter(post => post.status === "TODO")
                    const doingPostits = postits.filter(post => post.status === "DOING")
                    const reviewPostits = postits.filter(post => post.status === "REVIEW")
                    const donePostits = postits.filter(post => post.status === "DONE")

                    this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
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
                .then(postits => {
                    const toDoPostits = postits.filter(post => post.status === "TODO")
                    const doingPostits = postits.filter(post => post.status === "DOING")
                    const reviewPostits = postits.filter(post => post.status === "REVIEW")
                    const donePostits = postits.filter(post => post.status === "DONE")

                    this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
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
                .then(postits => {
                    const toDoPostits = postits.filter(post => post.status === "TODO")
                    const doingPostits = postits.filter(post => post.status === "DOING")
                    const reviewPostits = postits.filter(post => post.status === "REVIEW")
                    const donePostits = postits.filter(post => post.status === "DONE")

                    this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
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
                .then(postits => {
                    const toDoPostits = postits.filter(post => post.status === "TODO")
                    const doingPostits = postits.filter(post => post.status === "DOING")
                    const reviewPostits = postits.filter(post => post.status === "REVIEW")
                    const donePostits = postits.filter(post => post.status === "DONE")

                    this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
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
                        {this.state.toDoPostits.map(postit => <Post assignTo={postit.assignTo} status={"TODO"} buddies={this.state.buddies} key={postit.id} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} text={postit.text} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column2">
                    <h2>Doing</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"DOING"} />
                    <section >
                        {this.state.doingPostits.map(postit => <Post status={"DOING"} assignTo={postit.assignTo} key={postit.id} buddies={this.state.buddies} text={postit.text} onChangeStatus={this.handleChangeStatus} OnChangeAssignTo={this.handleChangeAssignTo} postitId={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column3">
                    <h2>Review</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"REVIEW"} />
                    <section >
                        {this.state.reviewPostits.map(postit => <Post status={"REVIEW"} assignTo={postit.assignTo}  key={postit.id} buddies={this.state.buddies} text={postit.text} onChangeStatus={this.handleChangeStatus} postitId={postit.id} OnChangeAssignTo={this.handleChangeAssignTo} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column4">
                    <h2>Done</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"DONE"} />
                    <section >
                        {this.state.donePostits.map(postit => <Post status={"DONE"} assignTo={postit.assignTo}  key={postit.id} buddies={this.state.buddies} text={postit.text} onChangeStatus={this.handleChangeStatus} postitId={postit.id} OnChangeAssignTo={this.handleChangeAssignTo} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>
            </div>
        </div>
    }
}

export default Postits
