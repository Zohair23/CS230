const mongoose = require('mongoose');

const memberClassSchema = mongoose.Schema({
    // Reference to the gym member
    gymMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymMember',
        required: true
    },
    // Array of references to gym classes
    gymClasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymClass',
        required: true
    }]
});

const MemberClass = mongoose.model('MemberClass', memberClassSchema);

module.exports = MemberClass;

