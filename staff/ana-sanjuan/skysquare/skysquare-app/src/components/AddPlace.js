import React, { Component } from 'react'
import Map from './Map'

class AddPlace extends Component {
    state = { name: '', address: '', latitude: 0, longitud: 0, breakfast: 'off', lunch: 'off', dinner: 'off', coffee: 'off', nightLife: 'off', thingsToDo: 'off' }


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
        const breakfast = event.target.value

        this.setState({ breakfast })
    }
    handleOnChangeLunch = event => {
        const lunch = event.target.value

        this.setState({ lunch })
    }
    handleOnChangeDinner = event => {
        const dinner = event.target.value

        this.setState({ dinner })
    }
    handleOnChangeCoffee = event => {
        const coffee = event.target.value

        this.setState({ coffee })
    }
    handleOnChangeNightLife = event => {
        const nightLife = event.target.value

        this.setState({ nightLife })
    }
    handleOnChangeThingsToDo = event => {
        const thingsToDo = event.target.value

        this.setState({ thingsToDo })
    }
    handleSubmit = event => {
        event.preventDefault()

        const { name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife, thingsToDo } = this.state

        this.props.onAddPlace(name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)
    }
    render() {
        return <div className='add__place'>
            <h1>Add a new Place</h1>
            <Map className='add__place__map' onMapClick={this.handleMapClick} />
            <section className='add__place__fields'>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' placeholder='Add name' onChange={this.handleOnChangeName}></input><br/>
                    <input type='text' placeholder='Add address' onChange={this.handleOnChangeAddress}></input><br/>
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