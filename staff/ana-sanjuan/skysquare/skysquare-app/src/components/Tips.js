import React, { Component } from 'react'
import logic from '../logic'
import Tip from './Tip'

class Tips extends Component {
    state = { error: null, tips: [], text: '' }
    componentDidMount() {
        try {
            logic.listPlaceTips(this.props.id)
                .then(tips => this.setState({ tips, error: null }))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleTextChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleSubmitText = event => {
        event.preventDefault()
        try {
            logic.addTip(this.props.id, this.state.text)
                .then(res => {
                    let newTips = this.state.tips
                    
                    this.setState({ text: '', tips: [...newTips, res], error: null })
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return (<main className='tips'>
            <section className='add__tip'>
                <form onSubmit={this.handleSubmitText}>
                    <div className='add__tip__header'>
                        <h6>Add a new tip</h6>
                        <button type='submit'>Publish</button>
                    </div>
                    <textarea className='textarea__tip' type='text' value={this.state.text} placeholder='what is good in this place?' onChange={this.handleTextChange}></textarea>
                </form>
            </section>
            <section>
                {this.state.tips.map(tip => <Tip key={tip.id} text={tip.text} userName={tip.userName} userSurname={tip.userSurname} time={tip.time} userPicture={tip.userPicture} />)}
            </section>

        </main>)
    }
}

export default Tips