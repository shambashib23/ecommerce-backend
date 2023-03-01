const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userAccountSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    mobileNumber: {
        type: Number,
        // required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Indexing the schema
userAccountSchema.index({ name: 1, email: 1 });

userAccountSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const UserAccount = mongoose.model('userAccount', userAccountSchema);

module.exports = UserAccount;