//import logic from './logic'

require('isomorphic-fetch')

const logic = require('./logic')

const {expect} = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () =>{
    beforeEach(()=>{

    })
    
    describe('users', () => {
        describe('register', () => {
            it('should succeed on correct data', () =>
                logic.registerUser('John', 'Doe', `jd-${Math.random()}`, '123') //implicit return for asyncronous register
                    .then(id => expect(id).to.be.a('string'))
            )

            it('should fail on trying to register twice same user', () => {
                const username = `jd-${Math.random()}`

                return logic.registerUser('John', 'Doe', username, '123')
                    .then(id => {
                        expect(id).to.be.a('string')

                        return logic.registerUser('John', 'Doe', username, '123')
             
                    })
                    .catch(err => {
                        expect(err).not.to.be.undefined
                        expect(err.message).to.equal(`user with username "${username}" already exists`)
                    })

            })

            it('should fail on undefined name', () => {
                expect(()=>
                    logic.registerUser(undefined, 'Doe', 'jd', '123')
                ).to.throw(TypeError, 'undefined is not a string') 
            })

            //TODO more cases
        }) 
    })



})