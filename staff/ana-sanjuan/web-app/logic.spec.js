const logic = require('./logic')

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    describe('register user', () => {
        it('should succed on correct data', () => {
            logic.registerUser('name', 'surname', 'username', '123')
            
            
        })

        it ('should fail on undefined name', ()=>{
            expect(()=>
                logic.registerUser(undefined, 'surname', 'username', '123')
            ).to.throw(TypeError, 'undefined is not a string')
        })

    })
    
   
})