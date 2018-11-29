import React, {Component} from 'react'
import logic from '../logic/logic'

class AddPicture extends Component {
    state={ picture: null, previewPicture: null}

    handlePictureSelect = event => {
        event.preventDefault()

        this.setState({
            previewPicture: URL.createObjectURL(event.target.files[0]),
            picture: event.target.files[0]
          })
        
    }

    handlePictureLoad = event => {
        event.preventDefault()

        logic.UploadPicture(this.props.placeId, this.state.picture)
            .then(res => {
                this.setState({previewPicture: null})
            })
    }


    render() {
        return(<div className='addPicture'>
            <form encType="multipart/form-data" onSubmit={this.handlePictureLoad}>
            <input type="file" name="pic" accept="image/*" onChange={this.handlePictureSelect}></input>
            <img src={this.state.previewPicture} alt='' className='picture__preview'/>
            <button type='submit'>Load Picture</button>
            </form>
        </div>

        )
    }

}

export default AddPicture