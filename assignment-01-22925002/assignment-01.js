const shapeData = {
    triangle1: { x: 0, height: 90 },
    trapezium2: { x: 0, height: 90, width: 185 },
    trapezium3: { x: 0, height: 90, width: 365 },
    trapezium4: { x: 0, height: 90, width: 545 },
    trapezium5: { x: 0, height: 90, width: 725 },
    trapezium6: { x: 0, height: 90, width: 905 }
};

let ageGroupFlag = 1;


function toggleAgeGroup() {
    ageGroupFlag = 1 - ageGroupFlag; 
    updateColors(); 
    updateAgeGroupText(); 
}


function updateAgeGroupText() {
    const ageGroupDisplay = document.getElementById('ageGroupDisplay');
    ageGroupDisplay.innerText = `Age Group: ${ageGroupFlag ? '1-4' : '>=5'} years`;
}


function updateColors() {
    const guidelines = ageGroupFlag ? ageGuidelines1to4 : ageGuidelines5andAbove;

    for (let i = 1; i <= 6; i++) {
        const shapeId = i === 1 ? 'triangle1' : `trapezium${i}`;
        const shape = shapeData[shapeId];
        const circle = document.getElementById(`xValue${i}`);
        const shapeGuidelines = guidelines[shapeId];

        if (shape.x < shapeGuidelines.below) {
            circle.style.backgroundColor = 'green'; 
        } else if (shape.x >= shapeGuidelines.withinLow && shape.x <= shapeGuidelines.withinHigh) {
            circle.style.backgroundColor = 'yellow'; 
        } else {
            circle.style.backgroundColor = 'red'; 
        }
    }
}



const ageGuidelines1to4 = {
    triangle1: { below: 0, withinLow: 0, withinHigh: 0 },
    trapezium2: { below: 1, withinLow: 1, withinHigh: 2 },
    trapezium3: { below: 2, withinLow: 2, withinHigh: 4 },
    trapezium4: { below: 3, withinLow: 3, withinHigh: 3 },
    trapezium5: { below: 2, withinLow: 2, withinHigh: 5 },
    trapezium6: { below: 3, withinLow: 3, withinHigh: 6 },
};


const ageGuidelines5andAbove = {
    triangle1: { below: 0, withinLow: 0, withinHigh: 0 },
    trapezium2: { below: 1, withinLow: 1, withinHigh: 2 },
    trapezium3: { below: 2, withinLow: 2, withinHigh: 2 },
    trapezium4: { below: 3, withinLow: 3, withinHigh: 5 },
    trapezium5: { below: 3, withinLow: 3, withinHigh: 7 },
    trapezium6: { below: 5, withinLow: 5, withinHigh: 7 },
};



function validateDate() {
    const dateInput = document.getElementById('dateInput').value;
    const dateRegex = /^(?!0000)[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    if (dateRegex.test(dateInput)) {
        const [year, month, day] = dateInput.split('-').map(Number);

        
        const lastDayOfMonth = new Date(year, month, 0).getDate();

        if (day <= lastDayOfMonth) {
            alert('Date is valid!');
            displayDateInWords(year, month, day);
        } else {
            alert('Invalid day for the selected month!');
        }
    } else {
        alert('Invalid date format or out-of-range values! Please use YYYY-MM-DD.');
    }
}

function displayDateInWords(year, month, day) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthName = months[month - 1];
    const dateInWords = `${monthName} ${day}, ${year}`;
    
    document.getElementById('dateOutput').innerText = `Date on record: ${dateInWords}`;
}



function changeValue(shapeId, operation) {
    const data = shapeData[shapeId];

    if (operation === '+') {
        data.x++;
        data.height += 10; 

        
        for (let i = parseInt(shapeId.charAt(shapeId.length - 1)) + 1; i <= 6; i++) {
            const nextTrapezium = shapeData[`trapezium${i}`];
            nextTrapezium.width = nextTrapezium.width + 20; 
            document.getElementById(`trapezium${i}`).style.width = `${nextTrapezium.width}px`;
        }
    } else if (operation === '-' && data.x > 0) {
        data.x--;
        data.height -= 10; 

        
        for (let i = parseInt(shapeId.charAt(shapeId.length - 1)) + 1; i <= 6; i++) {
            const nextTrapezium = shapeData[`trapezium${i}`];
            nextTrapezium.width = nextTrapezium.width - 20; 
            document.getElementById(`trapezium${i}`).style.width = `${nextTrapezium.width}px`;
        }
    }


    document.getElementById(`xValue${shapeId.charAt(shapeId.length - 1)}`).innerText = data.x;


    if (shapeId.startsWith("triangle")) {
        document.getElementById(shapeId).style.setProperty('--triangle-height', `${data.height-5}px`);
    } else {
        document.getElementById(shapeId).style.setProperty('--trapezium-height', `${data.height}px`);
    }
    updateColors();
}

updateColors();
updateAgeGroupText();