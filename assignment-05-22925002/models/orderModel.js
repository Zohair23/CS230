const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

// insert a new order based on the customerid and itemid
Order.insertOrder = async (customerId, items) => {
    try {
        //check customer id
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            throw new Error('Invalid customer ID');
        }

        //check item id and quantity
        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.itemId)) {
                throw new Error('Invalid item ID');
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new Error('Invalid quantity for item');
            }
        }

        const order = await Order.create({ customerId, items });
        console.log('Order Added:');
        console.log(JSON.stringify(order, null, 2));
        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};

// find a random order
Order.findOrder = async () => {
    try {
        const count = await Order.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomOrder = await Order.findOne().skip(randomIndex).populate('customerId items.itemId');
        return randomOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

// find a random order and update the order's customerid, items and orderDate
Order.updateOrder = async (orderDetails) => {
    try {
        const count = await Order.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomOrder = await Order.findOne().skip(randomIndex);

        // Update order details if provided
        if (orderDetails.customerId) {
            randomOrder.customerId = orderDetails.customerId;
        }
        if (orderDetails.items) {
            randomOrder.items = orderDetails.items;
        }
        if (orderDetails.orderDate) {
            randomOrder.orderDate = orderDetails.orderDate;
        }

        const updatedOrder = await randomOrder.save();
        console.log('Updated Order:');
        console.log(JSON.stringify(updatedOrder, null, 2)); 
        return updatedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete an order based on the customerid and itemid
Order.deleteOrderByCustomerAndItem = async (customerId, itemId) => {
    try {
        const deletedOrder = await Order.updateOne(
            { customerId },
            { $pull: { items: { itemId } } }
        );
        console.log('Deleted Order:');
        console.log(JSON.stringify(deletedOrder, null, 2)); 
    } catch (error) {
        throw new Error(error.message);
    }
};

//export Order
module.exports = Order;

