const mongoose = require('mongoose');
//to link
const Order = require('./orderModel');

const customerSchema = mongoose.Schema({
    title: {
        type: String,
        enum: ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Other'],
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    homeAddress: {
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: String,
        town: {
            type: String,
            required: true
        },
        countyCity: {
            type: String,
            required: true
        },
        eircode: String
    },
    shippingAddress: {
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: String,
        town: {
            type: String,
            required: true
        },
        countyCity: {
            type: String,
            required: true
        },
        eircode: String
    }
});

// Cascade on delete
customerSchema.pre('remove', async function(next) {
    try {
        // check
        await Order.deleteMany({ customerId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

const Customer = mongoose.model('Customer', customerSchema);

// insert customer
Customer.insertCustomer = async (details) => {
    try {
        const customer = await Customer.create(details);
        console.log('Inserted Customer: ');
        console.log(JSON.stringify(customer, null, 2)); 
        return customer;
    } catch (error) {
        throw new Error(error.message);
    }
};

// find random customer 
Customer.findCustomer = async () => {
    try {
        const count = await Customer.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomCustomer = await Customer.findOne().skip(randomIndex);
        return randomCustomer;
    } catch (error) {
        throw new Error(error.message);
    }
};

// find random customer and update the customer's mobile, email and title
Customer.updateCustomer = async (details) => {
    try {
        const count = await Customer.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomCustomer = await Customer.findOne().skip(randomIndex);

        if (!details.mobile || !details.email || !details.title) {
            throw new Error('Mobile, email, and title are required for update operation');
        }

        randomCustomer.mobile = details.mobile;
        randomCustomer.email = details.email;
        randomCustomer.title = details.title;

        if (details.homeAddress) {
            randomCustomer.homeAddress = {
                ...randomCustomer.homeAddress,
                ...details.homeAddress
            };
        }

        if (details.shippingAddress) {
            randomCustomer.shippingAddress = {
                ...randomCustomer.shippingAddress,
                ...details.shippingAddress
            };
        }

        const updatedCustomer = await randomCustomer.save();
        console.log('Updated Customer: ');
        console.log(JSON.stringify(updatedCustomer, null, 2));
        return updatedCustomer;
    } catch (error) {
        throw new Error(error.message);
    }
};



//delete customer based on email, mobile and name
Customer.deleteCustomer = async (details) => {
    try {
        console.log('Deleting customer with details:', details);
        const { email, mobile, firstName, surname } = details; 
        const deletedCustomer = await Customer.deleteOne({ email, mobile, firstName, surname });
        console.log('Deleted customer:', deletedCustomer);
        return deletedCustomer;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw new Error(error.message);
    }
};

//export customer
module.exports = Customer;
