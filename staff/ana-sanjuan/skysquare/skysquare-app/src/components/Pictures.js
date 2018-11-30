import React, { Component } from 'react'
import logic from '../logic/logic'

class Pictures extends Component {
    state = { error: null, pictures: [], picture: null, previewPicture: null }

    componentDidMount() {
        try {
            logic.listPictures(this.props.id)
            .then(pictures => this.setState({ pictures, error: null }))
            .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handlePictureSelect = event => {
        event.preventDefault()

        this.setState({
            previewPicture: URL.createObjectURL(event.target.files[0]),
            picture: event.target.files[0]
        })

    }

    handlePictureLoad = event => {
        event.preventDefault()

        try {
            logic.UploadPicture(this.props.id, this.state.picture)
            .then(res => {
                const prevPictures = this.state.pictures

                this.setState({ previewPicture: null, pictures: [...prevPictures, res], error: null })
            })
            .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return (<div className='pictures'>
            <form encType="multipart/form-data" onSubmit={this.handlePictureLoad}>
                <input type="file" name="pic" accept="image/*" onChange={this.handlePictureSelect}></input>
                <img src={this.state.previewPicture} alt='' className='picture__preview' />
                <button type='submit'>Load Picture</button>
            </form>
            <main className='pictures__main'>
                {this.state.pictures.map(picture => <img className='picture__item' src={`${picture}`} alt='#'></img>)}
            </main>
        </div>)
    }
}

export default Pictures