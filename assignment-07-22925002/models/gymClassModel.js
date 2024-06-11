const mongoose = require('mongoose');

const gymClassSchema = mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    classDay: {
        type: String,
        required: true
    },
    sessionLengthHours: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currentNumberOfMembers: {
        type: Number,
        required: true
    }
});

const GymClass = mongoose.model('GymClass', gymClassSchema);

module.exports = GymClass;
