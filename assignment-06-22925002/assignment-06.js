// References
// Mainly through lectures, Moodle resources, and other sources.
// https://www.w3schools.com/nodejs/
// https://www.tutorialspoint.com/expressjs/index.htm
// https://www.w3schools.com/js/js_json_intro.asp
// https://www.w3schools.com/mongodb/
// https://www.w3schools.com/jsref/met_console_log.asp
// https://www.w3schools.com/nodejs/nodejs_mongodb_create_db.asp#:~:text=To%20create%20a%20database%20in,make%20a%20connection%20to%20it.
// https://www.w3schools.com/nodejs/nodejs_mongodb.asp
// VS Code used as an IDE, downloaded Node.js, MongoDB, etc.

// To connect to Mongoose, use Express and connect files
const express = require('express');
const mongoose = require('mongoose');
//member model
const GymMember = require('./models/gymMemberModel');
//class model
const GymClass = require('./models/gymClassModel');
//join model
const MemberClass = require('./models/joinModel'); 
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://zohairmoosavi:12345678Admin@cluster0.wnaa7zl.mongodb.net/Assignment-06-Zohair?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
        // Start server
        app.listen(3000, () => {
            console.log('Node API is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Routes

// Gym member routes:

// create a new gym member (C)
app.post('/members', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/members/ (POST)');
    console.log(`{
        "title": "-",
        "firstName": "-",
        "lastName": "-",
        "emailAddress": "-",
        "premiumMembership": true
      }`);

    try {
        const member = await GymMember.create(req.body);
        console.log('New gym member created:', member);
        res.status(201).json({ message: 'Gym member created successfully', data: member });
    } catch (error) {
        console.error('Error creating gym member:', error);
        res.status(500).json({ message: 'Failed to create gym member', error: error.message });
    }
});

// get all gym members (R)
app.get('/members', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Connect to http://localhost:3000/members/ (GET)');
    
    try {
        const members = await GymMember.find();
        console.log('Retrieved all gym members:', members);
        res.status(200).json({ message: 'Gym members retrieved successfully', data: members });
    } catch (error) {
        console.error('Error retrieving gym members:', error);
        res.status(500).json({ message: 'Failed to retrieve gym members', error: error.message });
    }
});

// update details of a gym member (U)
app.put('/members', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/members/ (PUT)');
    console.log(`{
        "_id": "-",
        "title": "-",
        "firstName": "-",
        "lastName": "-",
        "emailAddress": "-",
        "premiumMembership": true
    }`);

    try {
        const updatedMember = await GymMember.findByIdAndUpdate(req.body._id, req.body, { new: true });
        console.log('Gym member updated:', updatedMember);
        res.status(200).json({ message: 'Gym member updated successfully', data: updatedMember });
    } catch (error) {
        console.error('Error updating gym member:', error);
        res.status(500).json({ message: 'Failed to update gym member', error: error.message });
    }
});

// delete a gym member (D)
app.delete('/members', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/members/ (DELETE)');
    console.log(`{
        "_id": "-" 
      }`);

    try {
        const deletedMember = await GymMember.findByIdAndDelete(req.body._id);
        
        // delete in join model aswell
        await MemberClass.deleteMany({ gymMember: deletedMember._id });

        console.log('Gym member deleted:', deletedMember);
        res.status(200).json({ message: 'Gym member deleted successfully', data: deletedMember });
    } catch (error) {
        console.error('Error deleting gym member:', error);
        res.status(500).json({ message: 'Failed to delete gym member', error: error.message });
    }
});

// Gym class routes:

// create a new gym class (C)
app.post('/classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/classes/ (POST)');
    console.log(`{
        "className": "-",
        "classDay": "-",
        "sessionLengthHours": 1,
        "price": 20,
        "currentNumberOfMembers": 0
    }`);

    try {
        const gymClass = await GymClass.create(req.body);
        console.log('New gym class created:', gymClass);
        res.status(201).json({ message: 'Gym class created successfully', data: gymClass });
    } catch (error) {
        console.error('Error creating gym class:', error);
        res.status(500).json({ message: 'Failed to create gym class', error: error.message });
    }
});

// get all gym classes (R)
app.get('/classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Connect to http://localhost:3000/classes/ (GET)');

    try {
        const classes = await GymClass.find();
        console.log('Retrieved all gym classes:', classes);
        res.status(200).json({ message: 'Gym classes retrieved successfully', data: classes });
    } catch (error) {
        console.error('Error retrieving gym classes:', error);
        res.status(500).json({ message: 'Failed to retrieve gym classes', error: error.message });
    }
});

// update details of a gym class (U)
app.put('/classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/classes/ (PUT)');
    console.log(`{
        "_id": "-", 
        "className": "-",
        "classDay": "-",
        "sessionLengthHours": 2.5,
        "price": 16,
        "currentNumberOfMembers": 6
      }`);

    try {
        const updatedClass = await GymClass.findByIdAndUpdate(req.body._id, req.body, { new: true });
        console.log('Gym class updated:', updatedClass);
        res.status(200).json({ message: 'Gym class updated successfully', data: updatedClass });
    } catch (error) {
        console.error('Error updating gym class:', error);
        res.status(500).json({ message: 'Failed to update gym class', error: error.message });
    }
});

// delete a gym class (D)
app.delete('/classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/classes/ (DELETE)');
    console.log(`{
        "_id": "-"
    }`);

    try {
        const deletedClass = await GymClass.findByIdAndDelete(req.body._id);
        
        // delete in join model aswell
        await MemberClass.deleteMany({ gymClasses: deletedClass._id });

        console.log('Gym class deleted:', deletedClass);
        res.status(200).json({ message: 'Gym class deleted successfully', data: deletedClass });
    } catch (error) {
        console.error('Error deleting gym class:', error);
        res.status(500).json({ message: 'Failed to delete gym class', error: error.message });
    }
});

// Gym join routes:

// create a new relationship between gym member and gym class (C)
app.post('/member-classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/member-classes/ (POST)');
    console.log(`{
        "gymMember": "-",
        "gymClasses": ["-", "-", "-"]
    }`);

    try {
        // check if member already exists
        const existingMemberClasses = await MemberClass.find({ gymMember: req.body.gymMember });
        if (existingMemberClasses.length >= 3) {
            return res.status(400).json({ message: 'Gym member is already enrolled in the maximum number of classes' });
        }

        // check if the member is adding more than 3 classes
        if (req.body.gymClasses.length > 3) {
            return res.status(400).json({ message: 'Cannot enroll in more than 3 classes' });
        }

        // check if the member is trying to add duplicate classes
        const uniqueClasses = [...new Set(req.body.gymClasses)];
        if (req.body.gymClasses.length !== uniqueClasses.length) {
            return res.status(400).json({ message: 'Cannot enroll in duplicate classes' });
        }

        const memberClass = await MemberClass.create(req.body);
        res.status(201).json(memberClass);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create gym member-class relationship', error: error.message });
    }
});

// get all gym member-class relationships (R)
app.get('/member-classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Connect to http://localhost:3000/member-classes/ (GET)');
    
    try {
        const memberClasses = await MemberClass.find();
        console.log('Retrieved all gym member-class relationships:', memberClasses);
        res.status(200).json({ message: 'Gym member-class relationships retrieved successfully', data: memberClasses });
    } catch (error) {
        console.error('Error retrieving gym member-class relationships:', error);
        res.status(500).json({ message: 'Failed to retrieve gym member-class relationships', error: error.message });
    }
});

// update details of a gym member-class relationship (U)
app.put('/member-classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/member-classes/ (PUT)');
    console.log(`{
        "_id": "-", 
        "gymMember": "-", 
        "gymClasses": [
            "-", 
            "-", 
            "-"
        ]
    }`);

    try {
        // Check if the member is trying to add more than 3 classes
        const memberClass = await MemberClass.findOne({ memberID: req.body.memberID });
        if (!memberClass) {
            return res.status(404).json({ message: 'Gym member-class relationship not found' });
        }

        const existingMemberClasses = await MemberClass.find({ memberID: req.body.memberID });
        if (existingMemberClasses.length >= 3 && !existingMemberClasses.find(c => c._id.toString() !== req.body._id)) {
            return res.status(400).json({ message: 'Gym member is already enrolled in the maximum number of classes' });
        }

        const updatedMemberClass = await MemberClass.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).json(updatedMemberClass);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update gym member-class relationship', error: error.message });
    }
});

// delete a gym member-class relationship (D)
app.delete('/member-classes', async (req, res) => {

    //print description
    console.log('Use a program such as Postman to test your program:');
    console.log('Use the JSON body template below and connect to http://localhost:3000/member-classes/ (DELETE)');
    console.log(`{
        "_id": "-"
    }`);

    try {
        const deletedMemberClass = await MemberClass.findByIdAndDelete(req.body._id);
        console.log('Gym member-class relationship deleted:', deletedMemberClass);
        res.status(200).json({ message: 'Gym member-class relationship deleted successfully', data: deletedMemberClass });
    } catch (error) {
        console.error('Error deleting gym member-class relationship:', error);
        res.status(500).json({ message: 'Failed to delete gym member-class relationship', error: error.message });
    }
});

// if route doesn't exist:
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

/*
Database design:
For the database, I modeled three main entities: gym members, gym classes, and their relationship through the join model. Each gym member can only take 3 classes.
If a CRUD in the member or class is applied, based on what functionaliy, the join model is also deleted or updated accordingly, the join model also has its open CRUD functionality.
The join model basically acts a relationship between members and classes.
Automatic ids are generated using MongoDB, and the relevant ids are used in applying CRUD in the join model.
The two models, members and classes have their own CRUD.
Basic CRUD is used.

Impact on code development:
This design allows for efficient management of gym members, classes, and their relationships. It simplifies operations such as enrollment, tracking attendance, and managing memberships.
*/

