//References
//Mainly through lectures,moodle resources and other sources.
//https://www.w3schools.com/nodejs/
//https://www.tutorialspoint.com/expressjs/index.htm
//https://www.w3schools.com/js/js_json_intro.asp
//https://www.w3schools.com/mongodb/
//https://www.w3schools.com/jsref/met_console_log.asp
//https://www.w3schools.com/nodejs/nodejs_mongodb_create_db.asp#:~:text=To%20create%20a%20database%20in,make%20a%20connection%20to%20it.
//https://www.w3schools.com/nodejs/nodejs_mongodb.asp
//vs code used as ide, downloaded node.js,mongodb,etc.

//to connect to mongoose, use express and connect files
const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customerModel');
const Item = require('./models/itemModel');
const Order = require('./models/orderModel');
const app = express();

app.use(express.json());

// connect to mongoDB
mongoose.connect('mongodb+srv://zohairmoosavi:12345678Admin@cluster0.wnaa7zl.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to MongoDB');
    // start server
    app.listen(3000, () => {
        console.log('Node API is running on port 3000');
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


// Routes

// customer routes:

// create a new customer (C)
app.post('/customers', async (req, res) => {
    

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/customers/ (POST)');
    console.log(`{
        "title": "",
        "firstName": "",
        "surname": "",
        "mobile": "",
        "email": "",
        "homeAddress": {
            "addressLine1": "",
            "addressLine2": "",
            "town": "",
            "countyCity": "",
            "eircode": ""
        },
        "shippingAddress": {
            "addressLine1": "",
            "town": "",
            "countyCity": "",
            "eircode": ""
        }
    }`);    
    try {
        const customer = await Customer.insertCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// To get a random customer (R)
app.get('/customers', async (req, res) => {
    try {
        const customer = await Customer.findCustomer();

        // print details to the console
        console.log("Customer Details:");
        console.log("Title:", customer.title);
        console.log("First Name:", customer.firstName);
        console.log("Surname:", customer.surname);
        console.log("Mobile:", customer.mobile);
        console.log("Email:", customer.email);
        console.log("Home Address:");
        console.log("  Address Line 1:", customer.homeAddress.addressLine1);
        if (customer.homeAddress.addressLine2) {
            console.log("  Address Line 2:", customer.homeAddress.addressLine2);
        }
        console.log("  Town:", customer.homeAddress.town);
        console.log("  County/City:", customer.homeAddress.countyCity);
        if (customer.homeAddress.eircode) {
            console.log("  Eircode:", customer.homeAddress.eircode);
        }

        console.log("Shipping Address:");
        console.log("  Address Line 1:", customer.shippingAddress.addressLine1);
        if (customer.shippingAddress.addressLine2) {
            console.log("  Address Line 2:", customer.shippingAddress.addressLine2);
        }
        console.log("  Town:", customer.shippingAddress.town);
        console.log("  County/City:", customer.shippingAddress.countyCity);
        if (customer.shippingAddress.eircode) {
            console.log("  Eircode:", customer.shippingAddress.eircode);
        }


        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// get random customer and update their details (U)
app.put('/customers', async (req, res) => {
    try {
        // required fields
        const { mobile, email, title } = req.body;
        if (!mobile || !email || !title) {
            return res.status(400).json({ message: 'Mobile, email, and title are required for update operation' });
        }

        const updatedCustomer = await Customer.updateCustomer(req.body);
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// delete a customer based on their details (D)
app.delete('/customers', async (req, res) => {
    try {
        console.log('Delete request received:', req.body); 
        const deletedCustomers = await Customer.deleteCustomer(req.body);
        console.log('Deleted customers:', deletedCustomers); 
        res.status(200).json(deletedCustomers);
    } catch (error) {
        console.error('Error deleting customers:', error); 
        res.status(500).json({ message: error.message });
    }
});





// Item routes

// create a new item (C)
app.post('/items', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/items/ (POST)');
    console.log(`{
        "manufacturer": "Drive",
        "model": "App",
        "price": 30
    }`);  
    try {
        const item = await Item.insertItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get a random item and print (R)
app.get('/items', async (req, res) => {
    try {
        const item = await Item.findItem();

        //print details to console
        console.log("Item Details:");
        console.log("Manufacturer:", item.manufacturer);
        console.log("Model:", item.model);
        console.log("Price:", item.price);

        res.status(200).json(item); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get a random item and change its details (U)
app.put('/items', async (req, res) => {
    try {
        // required fields
        const { manufacturer, model, price } = req.body;
        if (!manufacturer || !model || !price) {
            return res.status(400).json({ message: 'Manufacturer, model, and price are required for update operation' });
        }

        const updatedItem = await Item.updateItem(req.body);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// delete an item based on details (D)
app.delete('/items', async (req, res) => {
    try {
        console.log('Delete request received:', req.body); 
        const deletedItem = await Item.deleteItem(req.body);
        console.log('Deleted item:', deletedItem); 
        res.status(200).json(deletedItem);
    } catch (error) {
        console.error('Error deleting item:', error); 
        res.status(500).json({ message: error.message });
    }
});






// Order routes

// create a new order (C)
app.post('/orders', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/orders/ (POST)');
    console.log(`{
        "customerId": "customer_id",
        "items": [
            {
                "itemId": "item_id",
                "quantity": 1
            },
            {
                "itemId": "another_item_id",
                "quantity": 2
            }
        ]
    }
    `);  
    try {
        const { customerId, items } = req.body;
        const order = await Order.insertOrder(customerId, items);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get random order and print (R)
app.get('/orders', async (req, res) => {
    try {
        const order = await Order.findOrder();

        //print details to console
        console.log("Order Details:");
        console.log("Customer ID:", order.customerId);
        console.log("Items:");
        order.items.forEach((item, index) => {
            console.log(`  Item ${index + 1}:`);
            console.log("    Item ID:", item.itemId);
            console.log("    Quantity:", item.quantity);
        });
        console.log("Order Date:", order.orderDate);

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get random order and change its details (U)
app.put('/orders', async (req, res) => {
    try {
        const updatedOrder = await Order.updateOrder(req.body);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// delete an order based on customer ID and item ID (D)
app.delete('/orders', async (req, res) => {
    try {
        const { customerId, itemId } = req.body;
        console.log('Delete request received:', req.body); 
        const deletedOrder = await Order.deleteOrderByCustomerAndItem(customerId, itemId);
        console.log('Deleted order:', deletedOrder); 
        res.status(200).json(deletedOrder);
    } catch (error) {
        console.error('Error deleting order:', error); 
        res.status(500).json({ message: error.message });
    }
});


// message for non existent routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});


/*
Database design:
For the database, I modeled three main entities: customers, items, and orders. Each customer can have multiple orders within them, and each order can contain multiple items.

Impact on code development:
This did make it a bit tricky, but I was able to connect the customer and item models more efficiently which did save time.
*/
