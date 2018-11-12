import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'
import Error from './Error'

class Postits extends Component {
    state = { postits: [], toDoPostits: [], doingPostits: [], reviewPostits: [], donePostits: [] , error: null}

    componentDidMount() {
        logic.listPostits()
            .then(postits => {
                const toDoPostits = postits.filter(post => post.status === "TODO")
                const doingPostits = postits.filter(post => post.status === "DOING")
                const reviewPostits = postits.filter(post => post.status === "REVIEW")
                const donePostits = postits.filter(post => post.status === "DONE")

                this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
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
        } catch ({ message }) {
            this.setState({error: message}) 
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
        } catch ({ message }) {
            this.setState({error: message})  
        }
    }

    handleModifyPostit = (id, text) => {
        try {
            logic.modifyPostit(id, text)
                .then(() => logic.listPostits())
                .then(postits => {
                    const toDoPostits = postits.filter(post => post.status === "TODO")
                    const doingPostits = postits.filter(post => post.status === "DOING")
                    const reviewPostits = postits.filter(post => post.status === "REVIEW")
                    const donePostits = postits.filter(post => post.status === "DONE")

                    this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
                })
        } catch ({ message }) {
            this.setState({error: message}) 
        }
    }

    handleChangeStatus = (id, status) => {
        try {
            logic.modifyPostitStatus(id, status)
                .then(() => logic.listPostits())
                .then(postits => {
                    const toDoPostits = postits.filter(post => post.status === "TODO")
                    const doingPostits = postits.filter(post => post.status === "DOING")
                    const reviewPostits = postits.filter(post => post.status === "REVIEW")
                    const donePostits = postits.filter(post => post.status === "DONE")

                    this.setState({ postits, toDoPostits, doingPostits, reviewPostits, donePostits })
                })
        } catch ({ message }) {
            this.setState({error: message}) 
        }
    }

    render() {
        return <div>
            <h1 className="title">Kanban App </h1>
            <div className="kanbanContainer">
                <section className="column1">
                    <h2>To do</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"TODO"} />
                    {this.state.error && <Error message={this.state.error} />}
                    <section >
                        {this.state.toDoPostits.map(postit => <Post status={"TODO"} key={postit.id} onChangeStatus={this.handleChangeStatus} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column2">
                    <h2>Doing</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"DOING"} />
                    <section >
                        {this.state.doingPostits.map(postit => <Post status={"DOING"} key={postit.id} text={postit.text} onChangeStatus={this.handleChangeStatus} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column3">
                    <h2>Review</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"REVIEW"} />
                    <section >
                        {this.state.reviewPostits.map(postit => <Post status={"REVIEW"} key={postit.id} text={postit.text} onChangeStatus={this.handleChangeStatus} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>

                <section className="column4">
                    <h2>Done</h2>
                    <InputForm onSubmit={this.handleSubmit} status={"DONE"} />
                    <section >
                        {this.state.donePostits.map(postit => <Post status={"DONE"} key={postit.id} text={postit.text} onChangeStatus={this.handleChangeStatus} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
                    </section>
                </section>
            </div>
        </div>
    }
}

export default Postits
