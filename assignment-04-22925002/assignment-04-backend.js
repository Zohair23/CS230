//References
//Mainly through lectures,moodle resources and other sources.
//https://www.w3schools.com/nodejs/
//https://www.tutorialspoint.com/expressjs/index.htm
//https://www.w3schools.com/js/js_json_intro.asp
//https://www.w3schools.com/sql/
//https://www.w3schools.com/jsref/met_console_log.asp
//https://www.w3schools.com/php/php_mysql_intro.asp
//vs code used as ide, downloaded node.js,sql,etc.

// loading in path,express,sql,etc.
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

// Connecting to database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'webcourse.cs.nuim.ie',
    user: 'u230740',
    password: 'ieCae6vewohci0ch',
    database: 'cs230_u230740'
});

//middleware for json request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));


//route handler for the root URL
//Use this for adding a adding/searching a user using front end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'assignment-04.html'));
});

//When server starts(initialisation)...
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    
    
    console.log('Connected to database');

    //Instructions displayed on console
    console.log('');
    console.log('CRUD');
    console.log('Create(C):');
    console.log('To add a new user, use a tool such as Postman or cURL. Provided below is a template of the ');
    console.log('JSON you need to insert in the request body:');
    console.log('Make sure you are on http://localhost:3000/users/insert (POST) when inserting.');
    console.log(JSON.stringify({
        title: "Choose from: ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Sir', 'Madam', 'Prof']",
        firstName: "-",
        surname: "-",
        mobile: "-",
        email: "-",
        address: {
            addressLine1: "-",
            addressLine2: "-",
            town: "-",
            county: "-",
            eircode: "-"
        }
    }, null, 2));

    console.log('');
    console.log('Retrieve(R):');
    console.log('Go to http://localhost:3000/users/search (POST) for searching');
    console.log('JSON request body template:')
    console.log(JSON.stringify({
        firstName: "-",
        surname: "-",
    }, null, 2));


    console.log('');
    console.log('Update(U):');
    console.log('Go to http://localhost:3000/users/update/{userID} (PUT) for updating');
    console.log('JSON request body template:')
    console.log(JSON.stringify({
        title: "Choose from: ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Sir', 'Madam', 'Prof']",
        mobile: "-",
        email: "-",
        address: {
            addressLine1: "-",
            addressLine2: "-",
            town: "-",
            county: "-",
            eircode: "-"
        }
    }, null, 2));


    console.log('');
    console.log('Delete(D):');
    console.log('Go to http://localhost:3000/users/delete (DELETE) for deleting');
    console.log('JSON request body template:')
    console.log(JSON.stringify({
        email: "-",
        mobile: "-",
        firstName: "-",
        surname: "-"
    }, null, 2));

    console.log('');
    console.log('Front-end:');
    console.log('Go to http://localhost:3000/ (CREATE/RETRIEVE).');
    console.log('And enter in information.')
    connection.release();
});

//Update (U)
app.put('/users/update/:userId', (req, res) => {
    const userId = req.params.userId;
    const { title, email, mobile, address } = req.body;

    console.log('Updating user:', userId); 

    if (title === null || email === null || mobile === null) {
        return res.status(400).json({ error: 'Title, email, and mobile cannot be null' });
    }

    const updateUserQuery = 'UPDATE UserInfo SET Title = IFNULL(?, Title), Email = IFNULL(?, Email), Mobile = ? WHERE UserID = ?';
    const updateUserParams = [title, email, mobile, userId];

    pool.query('SELECT * FROM UserInfo WHERE UserID = ?', userId, (err, userRows) => {
        if (err) {
            console.error('Error retrieving user information:', err);
            return res.status(500).json({ error: 'Failed to update user' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = userRows[0];
        const updatedFields = {};

    
        if (title !== currentUser.Title) {
            updatedFields.Title = title;
        }
        if (email !== currentUser.Email) {
            updatedFields.Email = email;
        }
        if (mobile !== currentUser.Mobile) {
            updatedFields.Mobile = mobile;
        }

        
        let updateAddressQuery, updateAddressParams;
        if (address) {
            updateAddressQuery = 'UPDATE UserAddress SET AddressLine1 = ?, AddressLine2 = ?, Town = ?, County = ?, Eircode = ? WHERE UserID = ?';
            updateAddressParams = [address.addressLine1, address.addressLine2, address.town, address.county, address.eircode, userId];
        }

        
        pool.query(updateUserQuery, updateUserParams, (err, userResult) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ error: 'Failed to update user' });
            }

            
            if (address) {

                pool.query(updateAddressQuery, updateAddressParams, (err, addressResult) => {
                    if (err) {
                        console.error('Error updating user address:', err);
                        return res.status(500).json({ error: 'Failed to update user address' });
                    }
                    console.log('Updated fields:', { ...updatedFields, ...address }); 
                    res.json({ message: 'User and address updated successfully', updatedFields: { ...updatedFields, ...address } });
                });
            } else {
                
                console.log('Updated fields:', updatedFields); 
                res.json({ message: 'User updated successfully', updatedFields: updatedFields });
            }
        });
    });
});


app.delete('/users/delete', (req, res) => {
    const { email, mobile, firstName, surname } = req.body;

    
    if (!email || !mobile || !firstName || !surname) {
        return res.status(400).json({ error: 'Email, Mobile, First Name, and Surname are required fields' });
    }

    pool.query('DELETE FROM UserInfo WHERE Email = ? AND Mobile = ? AND FirstName = ? AND Surname = ?', [email, mobile, firstName, surname], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

       
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No matching user records found' });
        }

        console.log('User records deleted for:', email, mobile, firstName, surname); 
        res.json({ message: 'User records deleted successfully' });
    });
});



//Retrieve (R)
app.post('/users/search', (req, res) => {
    const { firstName, surname } = req.body;

    if (!firstName || !surname) {
        return res.status(400).json({ error: 'First name and surname are required' });
    }

    const query = `
        SELECT 
            u.*, 
            a.AddressLine1, 
            a.AddressLine2, 
            a.Town, 
            a.County, 
            a.Eircode 
        FROM 
            UserInfo u 
        LEFT JOIN 
            UserAddress a 
        ON 
            u.UserID = a.UserID 
        WHERE 
            u.FirstName = ? AND 
            u.Surname = ?
    `;

    pool.query(query, [firstName, surname], (err, rows) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).json({ error: 'Failed to retrieve user' });
        }
        
        if (rows.length === 0) {
            console.log('User not found'); 
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Retrieved user:', rows[0]); 
        res.json(rows[0]);
    });
});




//Create (C)
app.post('/users/insert', (req, res) => {
    const { title, firstName, surname, mobile, email, address } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                connection.release();
                return res.status(500).json({ error: 'Failed to create user' });
            }

            connection.query('INSERT INTO UserInfo (Title, FirstName, Surname, Mobile, Email) VALUES (?, ?, ?, ?, ?)',
                [title, firstName, surname, mobile, email], (err, result) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        connection.rollback(() => {
                            connection.release();
                            return res.status(500).json({ error: 'Failed to create user' });
                        });
                    }

                    const userId = result.insertId;

                    connection.query('INSERT INTO UserAddress (UserID, AddressLine1, AddressLine2, Town, County, Eircode) VALUES (?, ?, ?, ?, ?, ?)',
                        [userId, address.addressLine1, address.addressLine2 || null, address.town, address.county, address.eircode],
                        (err) => {
                            if (err) {
                                console.error('Error inserting user address:', err);
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(500).json({ error: 'Failed to create user address' });
                                });
                            }
                           
                            connection.commit((err) => {
                                if (err) {
                                    console.error('Error committing transaction:', err);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ error: 'Failed to create user' });
                                    });
                                }
                                
                                
                                connection.query('SELECT u.*, a.* FROM UserInfo u LEFT JOIN UserAddress a ON u.UserID = a.UserID WHERE u.UserID = ?', userId, (err, rows) => {
                                    if (err) {
                                        console.error('Error retrieving inserted user:', err);
                                        connection.release();
                                        return res.status(500).json({ error: 'Failed to fetch inserted user details' });
                                    }

                                    console.log('Inserted user:', rows[0]); 
                                    connection.release();
                                    res.status(201).json({ message: 'User created successfully' });
                                });
                            });
                        });
                });
        });
    });
});



//Users
app.get('/users', (req, res) => {
    pool.query('SELECT * FROM UserInfo', (err, rows) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return res.status(500).json({ error: 'Failed to retrieve users' });
        }
        console.log('Retrieved all users:', rows);
        res.json(rows);
    });
});

//Addresses
app.get('/addresses', (req, res) => {
    pool.query('SELECT * FROM UserAddress', (err, rows) => {
        if (err) {
            console.error('Error retrieving addresses:', err);
            return res.status(500).json({ error: 'Failed to retrieve addresses' });
        }
        console.log('Retrieved all addresses:', rows); 
        res.json(rows);
    });
});



app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


module.exports = app;