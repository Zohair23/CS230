const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    contractDate: {
        type: Date,
        required: true
    },
    propertyAddress: {
        type: String,
        required: true
    },
    tenants: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant'
        }],
        validate: [
            {
                validator: function (value) {
                    return value.length > 0; 
                },
                message: 'At least one tenant is required'
            },
            {
                validator: function (value) {
                    return value.length <= 3; 
                },
                message: 'Maximum of three tenants allowed'
            }
        ],
        required: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Landlord',
        required: true
    },
    feeMonthly: {
        type: Number,
        required: true
    },
    propertyDoorNumber: {
        type: Number,
        required: true
    },
    contractLength: {
        type: String,
        enum: ['Month', 'Year', 'Permanent'],
        required: true
    },
    propertyType: {
        type: String,
        enum: ['Apartment', 'Semi-Detached', 'Detached', 'Bungalow'],
        required: true
    }
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
