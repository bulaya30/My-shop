const driver = require('mongoose');
const validator = require('validator')
const crypt = require('bcrypt')

const schema = new driver.Schema({
    name: {
        type: String,
        required: [true, 'Nom utilisateur est recommandé']
    },
    type: {
        type: String,
        required: [true, 'Ce champs est recommandé']
    },
    email: {
        type: String,
        required: [true, 'L\'addresse e-mail est recommandé'],
        unique: true,
        lowercase: [true, 'L\'address e-mail ne doit conternir des lettres en majuscule'],
        validate: [validator.isEmail, 'Entre l\'address e-mail valide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est recommandé'],
        minlength: [8, 'The password must be at least 8 caracter long']
    }
}, {timestamps: true})

// Function to hash user password before saving
schema.pre('save', async function(next){
    let salt = 10;
    this.password = await crypt.hash(this.password, salt);
    next()
})
//Function to login user
schema.statics.login = async function(email, password){
    let user = await this.findOne({email:email});
    if(user){
        let pwd = await crypt.compare(password, user.password);
        if(pwd) {
            return user;
        }
        return {errors : {message: 'Wrong email address or password'}}
    }
    return {errors : {message: 'Wrong email address or password'}}
}


const user = driver.model('user', schema);
module.exports = user;