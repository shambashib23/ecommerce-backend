const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const UserAccount = mongoose.model('userAccount', userAccountSchema);

module.exports = UserAccount;