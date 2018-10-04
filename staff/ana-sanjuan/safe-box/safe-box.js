// safe-box.js

var safeBox = {

    saveSecret: function(secret, password) {
        if (password === undefined) throw Error ('invalid password')
        if (password.trim() === '') throw Error ('invalid password')
        data = []
        data.push ({secret: secret, password: password});
    },

    retrieveSecret: function(password) {
        myData = data.find(function(item) {
            return item.password === password;
        });
        if (password ===  myData.password) {
            return myData.secret;
        } else {
            throw Error ('invalid password');
        }
    }
}