import React, { Component } from 'react'

class Register extends Component {
    state = { name: '', surname: '', email: '', password: '', birthday: '', gender: '', phone: '' }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleEmailChange = event => {
        const email = event.target.value

        this.setState({ email })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleBirthdayChange = event => {
        const birthday = event.target.value

        this.setState({ birthday })
    }

    handleGenderChange = event => {
        const gender = event.target.value

        this.setState({ gender })
    }

    handlePhoneChange = event => {
        const phone = event.target.value

        this.setState({ phone })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, email, password, birthday, gender, phone } = this.state

        this.props.onRegister(name, surname, email, password, birthday, gender? gender: null, phone? phone: null)
    }
    
    render() {
        return (<div className="register">
            <form onSubmit={this.handleSubmit}>
                <header className="register__header">
                    <nav className="navbar">
                        <ul className='navbar__ul'>
                            <li><i className="fas fa-arrow-left" onClick={this.props.OnGoBack}></i></li>
                            <li>Register</li>
                            <li><button type="submit" className="navbar__button">OK</button></li>
                        </ul>
                    </nav>
                </header>
                <main className="register__main">
                    <section className="add_picture">Add Photo</section>
                    <section>
                        <div className="fullname">
                            <input className="input_box--half" placeholder="Name" onChange={this.handleNameChange}></input>
                            <input className="input_box--half" placeholder="Surname" onChange={this.handleSurnameChange}></input>
                        </div>
                        <input className="input_box" placeholder="Email" onChange={this.handleEmailChange}></input>
                        <input className="input_box" placeholder="Password" onChange={this.handlePasswordChange}></input>
                        <input className="input_box" placeholder="Birthday" onChange={this.handleBirthdayChange}></input>
                        <input className="input_box--opt" placeholder="Gender(optional)" onChange={this.handleGenderChange}></input>
                        <input className="input_box--opt" placeholder="Phone number" onChange={this.handlePhoneChange}></input>
                    </section>
                </main>
                <footer className="register__footer">
                    <button onClick={this.props.onLogInClick}>Do you already have an account? Log In now</button>
                </footer>
            </form>
        </div>

        )
    }
}

export default Register