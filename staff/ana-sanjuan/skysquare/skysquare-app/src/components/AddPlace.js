import React, { Component } from 'react'
import Map from './Map'

class AddPlace extends Component {
    state = { error: null, name: '', address: '', latitude: 0, longitud: 0, breakfast: false, lunch: false, dinner: false, coffee: false, nightLife: false, thingsToDo: false }

    getBoolean(target) {
        let option
        if (target === 'on') {
           return option = true

        } else {
            return option = false
        }
    }

    handleMapClick = (latitude, longitud) => {
        this.setState({ latitude, longitud })
    }

    handleOnChangeName = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleOnChangeAddress = event => {
        const address = event.target.value

        this.setState({ address })
    }

    handleOnChangeBreakfast = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ breakfast: option })
    }

    handleOnChangeLunch = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ lunch: option })
    }
    handleOnChangeDinner = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ dinner: option })
    }
    handleOnChangeCoffee = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ coffee: option })
    }
    handleOnChangeNightLife = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ nightLife: option })
    }
    handleOnChangeThingsToDo = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ thingsToDo: option })
    }
    handleSubmit = event => {
        event.preventDefault()

        const { name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife, thingsToDo } = this.state

        this.props.onAddPlace(name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)
    }

    render() {
        return <div className='add__place'>
            <h4>Add a new Place</h4>
            <section className='add__place__fields'>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' placeholder='Add name' onChange={this.handleOnChangeName}></input><br />
                    <input type='text' placeholder='Add address' onChange={this.handleOnChangeAddress}></input><br />
                    <Map className='add__place__map' onMapClick={this.handleMapClick} />
                    <p>This place is good for:</p>
                    <section className='checkboxes'>
                        <div>
                            <label><input type='checkbox' className='checkboxes__input' name='Breakfast' onChange={this.handleOnChangeBreakfast}></input>Breakfast</label>
                            <label><input type='checkbox' className='checkboxes__input' name='Lunch' onChange={this.handleOnChangeLunch}></input>Lunch</label>
                            <label><input type='checkbox' className='checkboxes__input' name='Dinner' onChange={this.handleOnChangeDinner}></input>Dinner</label>
                        </div>
                        <div>
                            <label><input type='checkbox' className='checkboxes__input' name='Coffee' onChange={this.handleOnChangeCoffee}></input>Coffee</label>
                            <label><input type='checkbox' className='checkboxes__input' name='NightLife' onChange={this.handleOnChangeNightLife}></input>NigthLife</label>
                            <label><input type='checkbox' className='checkboxes__input' name='ThingsToDo' onChange={this.handleOnChangeThingsToDo}></input>ThingsToDo</label>
                        </div>
                    </section>
                    <button type='submit'>Save</button>
                </form>
            </section>
        </div>
    }
}

export default AddPlace