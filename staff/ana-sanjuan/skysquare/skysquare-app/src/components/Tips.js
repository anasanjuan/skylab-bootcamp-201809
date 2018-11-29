import React, { Component } from 'react'
import logic from '../logic/logic'
import Tip from './Tip'

class Tips extends Component {
    state = { tips: [], text: '' }
    componentDidMount() {
        logic.listPlaceTips(this.props.id)
            .then(tips => this.setState({ tips }))
    }

    handleTextChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleSubmitText = event => {
        event.preventDefault()

        logic.addTip(this.props.id, this.state.text)
            .then(res => {
                let newTips = this.state.tips
                this.setState({ text: '', tips: [...newTips, res] })
            })
    }

    render() {
        return (<main className='tips'>
            <section>
                <h4>Insert a new tip</h4>
                <form onSubmit={this.handleSubmitText}>
                    <input type='text' value={this.state.text} placeholder='what is good in this place?' onChange={this.handleTextChange}></input>
                    <button type='submit'>Save</button>
                </form>
            </section>
            <section>
                {this.state.tips.map(tip => <Tip key={tip.id} text={tip.text} userName={tip.userName} userSurname={tip.userSurname} time={tip.time} userPicture={tip.userPicture} />)}
            </section>

        </main>)
    }
}

export default Tips