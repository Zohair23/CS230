const mongoose = require('mongoose');

const gymMemberSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    premiumMembership: {
        type: Boolean,
        required: true
    }
});

const GymMember = mongoose.model('GymMember', gymMemberSchema);

module.exports = GymMember;


