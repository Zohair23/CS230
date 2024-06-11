const mongoose = require('mongoose');
//to link
const Order = require('./orderModel');

const itemSchema = mongoose.Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// Cascade on delete
itemSchema.pre('remove', async function (next) {
    try {
        // check
        await Order.deleteMany({ 'items.itemId': this._id });
        next(); 
    } catch (error) {
        next(error); 
    }
});

//maximum number of items (10)
const cappedCollectionOptions = { capped: { size: 100000, max: 10 } };

const Item = mongoose.model('Item', itemSchema, 'items', cappedCollectionOptions);

// insert a new item
Item.insertItem = async (details) => {
    try {
        const item = await Item.create(details);
        console.log('Inserted Item: ');
        console.log(JSON.stringify(item, null, 2));
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
};

// find random item
Item.findItem = async () => {
    try {
        const count = await Item.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomItem = await Item.findOne().skip(randomIndex);
        return randomItem;
    } catch (error) {
        throw new Error(error.message);
    }
};

// find a random item and update the item's model, price and manufacturer)
Item.updateItem = async (details) => {
    try {
        const count = await Item.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomItem = await Item.findOne().skip(randomIndex);

        if (!details.manufacturer || !details.model || !details.price) {
            throw new Error('Manufacturer, model, and price are required for update operation');
        }

        // update them
        randomItem.manufacturer = details.manufacturer;
        randomItem.model = details.model;
        randomItem.price = details.price;

        const updatedItem = await randomItem.save();
        console.log('Updated Item: ');
        console.log(JSON.stringify(updatedItem, null, 2)); 
        return updatedItem;
    } catch (error) {
        throw new Error(error.message);
    }
};


// delete an item based on the manufacturer and model
Item.deleteItem = async (details) => {
    try {
        const { manufacturer, model } = details;
        const deletedItem = await Item.findOneAndDelete({ manufacturer, model });
        return deletedItem;
    } catch (error) {
        throw new Error(error.message);
    }
};

//export item
module.exports = Item;
