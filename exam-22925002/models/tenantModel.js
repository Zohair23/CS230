const mongoose = require('mongoose');

const tenantSchema = mongoose.Schema({
    title: {
        type: String,
        enum: ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Prof'],
        required: true
    },
    firstNames: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    homeAddress: {
        addressLine1: { type: String, required: true },
        addressLine2: String,
        town: { type: String, required: true },
        county: { type: String, required: true },
        eircode: { type: String, required: true }
    }
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
