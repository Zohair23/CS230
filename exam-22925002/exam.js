// References
// Mainly through lectures, Moodle resources, and other sources.
// https://www.w3schools.com/nodejs/
// https://www.tutorialspoint.com/expressjs/index.htm
// https://www.w3schools.com/js/js_json_intro.asp
// https://www.w3schools.com/mongodb/
// https://www.w3schools.com/nodejs/nodejs_mongodb_create_db.asp#:~:text=To%20create%20a%20database%20in,make%20a%20connection%20to%20it.
// https://www.w3schools.com/nodejs/nodejs_mongodb.asp
// https://ejs.co/#docs
// VS Code used as an IDE, downloaded Node.js, MongoDB, and ejs etc.

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const Tenant = require('./models/tenantModel');
const Landlord = require('./models/landlordModel');
const Contract = require('./models/contractModel');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://zohairmoosavi:12345678Admin@cluster0.wnaa7zl.mongodb.net/CS230_Exam?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Node API is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

//IMPORTANT!!!
//User Interface: use the app.get() routes for each model to access the page.
// directly using other routes like app.post() or app.put() first may cause problems.

// Tenant routes

//CREATE TENANT
app.get('/tenants/new', (req, res) => {
    res.render('new_tenant');
});

app.post('/tenants', async (req, res) => {
    try {
        const tenant = await Tenant.create(req.body);
        res.status(201).json(tenant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//UPDATE TENANT
app.get('/tenants/:id/edit', async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        res.render('edit_tenant', { tenant });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});


app.post('/tenants/:id', async (req, res) => {
    try {
        const updatedTenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTenant);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

//DELETE TENANT
app.get('/tenantsDelete/:id/delete', async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        const contracts = await Contract.find({ tenants: tenant._id });

        if (contracts.length === 1 && contracts[0].tenants.length === 1) {
            
            await Contract.findByIdAndDelete(contracts[0]._id);
            await Tenant.findByIdAndDelete(tenant._id);
            res.status(200).json({ message: 'Tenant and associated contract deleted successfully' });
        } else {
            
            await Contract.updateMany({ tenants: tenant._id }, { $pull: { tenants: tenant._id } });
            await Tenant.findByIdAndDelete(tenant._id);
            res.status(200).json({ message: 'Tenant removed from associated contracts' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/tenantsDelete/:id', async (req, res) => {
    try {
        await Tenant.findByIdAndDelete(req.body._id);
        res.status(200).json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Landlord routes

//CREATE LANDLORD
app.get('/landlords/new', (req, res) => {
    res.render('new_landlord');
});

app.post('/landlords', async (req, res) => {
    try {
        const landlord = await Landlord.create(req.body);
        res.status(201).json(landlord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//UPDATE LANDLORD
app.get('/landlords/:id/edit', async (req, res) => {
    try {
        const landlord = await Landlord.findById(req.params.id);
        res.render('edit_landlord', { landlord });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/landlords/:id', async (req, res) => {
    try {
        const updatedLandlord = await Landlord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedLandlord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//DELETE LANDLORD
app.get('/landlordsDelete/:id/delete', async (req, res) => {
    try {
        const landlord = await Landlord.findById(req.params.id);
        
        await Contract.deleteMany({ landlord: landlord._id });
        
        await Landlord.findByIdAndDelete(landlord._id);
        res.status(200).json({ message: 'Landlord and associated contracts deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/landlordsDelete/:id', async (req, res) => {
    try {
        await Landlord.findByIdAndDelete(req.body._id);
        res.status(200).json({ message: 'Landlord deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Contract routes

//CREATE CONTRACT
app.get('/contracts/new', (req, res) => {
    res.render('new_contract');
});

app.post('/contracts', async (req, res) => {
    try {
        const contract = await Contract.create(req.body);
        res.status(201).json(contract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//UPDATE CONTRACT
app.get('/contracts/:id/edit', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        res.render('edit_contract', { contract });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/contracts/:id', async (req, res) => {
    try {
        const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedContract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//DELETE CONTRACT
app.get('/contractsDelete/:id/delete', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        res.render('delete_contract', { contract });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/contractsDelete/:id', async (req, res) => {
    try {
        await Contract.findByIdAndDelete(req.body._id);
        res.status(200).json({ message: 'Contract deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//DISPLAY TABLES

//Tenant display
app.get('/tenantsDisplay', async (req, res) => {
    try {
        const tenants = await Tenant.find();
        res.render('display_tenants', { tenants });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Landlord display
app.get('/landlordsDisplay', async (req, res) => {
    try {
        const landlords = await Landlord.find();
        res.render('display_landlords', { landlords });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Contract display
app.get('/contractsDisplay', async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.render('display_contracts', { contracts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//invalid route
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
