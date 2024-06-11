//References
//Mainly through lectures,moodle resources,other sources and past assignments.
//https://www.w3schools.com/js/js_ajax_intro.asp
//https://www.w3schools.com/js/



//AJAX create
const createUser = (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const firstName = document.getElementById('firstName').value;
    const surname = document.getElementById('surname').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const addressLine1 = document.getElementById('addressLine1').value;
    const addressLine2 = document.getElementById('addressLine2').value;
    const town = document.getElementById('town').value;
    const county = document.getElementById('county').value;
    const eircode = document.getElementById('eircode').value;

    fetch('/users/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            title,
            firstName,
            surname,
            mobile,
            email,
            address: {
                addressLine1,
                addressLine2,
                town,
                county,
                eircode
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Duplicate user entry or server error');
        }
        return response.json();
    })
    .then(data => {
        console.log('User created:', data);

        alert('User created successfully');
    })
    .catch(error => {
        console.error('Error creating user:', error);

        alert(error.message);
    });
};



//AJAX search/retrieve
const retrieveUser = () => {
    const searchFirstName = document.getElementById('searchFirstName').value;
    const searchLastName = document.getElementById('searchLastName').value;

    fetch('/users/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName: searchFirstName, surname: searchLastName })
    })
    .then(response => response.json())
    .then(data => {
 
        const userDetailsDiv = document.getElementById('userDetails');
        userDetailsDiv.innerHTML = `
            <p><strong>User ID:</strong> ${data.UserID}</p>
            <p><strong>Title:</strong> ${data.Title}</p>
            <p><strong>First Name:</strong> ${data.FirstName}</p>
            <p><strong>Surname:</strong> ${data.Surname}</p>
            <p><strong>Mobile:</strong> ${data.Mobile}</p>
            <p><strong>Email:</strong> ${data.Email}</p>
            <p><strong>Address Line 1:</strong> ${data.AddressLine1}</p>
            <p><strong>Address Line 2:</strong> ${data.AddressLine2}</p>
            <p><strong>Town:</strong> ${data.Town}</p>
            <p><strong>County:</strong> ${data.County}</p>
            <p><strong>Eircode:</strong> ${data.Eircode}</p>
            <!-- Add more details as needed -->
        `;
    })
    .catch(error => console.error('Error retrieving user:', error));
};

document.getElementById('createUserForm').addEventListener('submit', createUser);
