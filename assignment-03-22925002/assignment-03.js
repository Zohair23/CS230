//References
//https://www.w3schools.com/jsref/met_document_getelementbyid.asp
//https://www.w3schools.com/jsref/met_document_queryselector.asp
//https://www.w3schools.com/js/js_const.asp
//https://www.w3schools.com/jsref/met_storage_setitem.asp
//https://www.w3schools.com/jsref/prop_html_innerhtml.asp
//https://www.w3schools.com/jsref/jsref_foreach.asp
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
//https://www.w3schools.com/jsref/prop_node_textcontent.asp
//https://www.w3schools.com/jsref/jsref_trim_string.asp
//https://www.w3schools.com/jsref/met_document_addeventlistener.asp
//https://www.w3schools.com/jsref/met_element_matches.asp
//https://www.w3schools.com/jsref/met_node_contains.asp
//https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
//https://www.w3schools.com/jsreF/met_table_insertrow.asp
//https://www.w3schools.com/jsref/met_tablerow_insertcell.asp
//https://www.w3schools.com/jsref/event_onclick.asp
//https://www.w3schools.com/jsref/met_document_createelement.asp
//https://www.w3schools.com/jsref/met_node_appendchild.asp
//https://www.w3schools.com/jsref/met_node_insertbefore.asp
//https://www.w3schools.com/jsref/met_html_focus.asp
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
//https://developer.mozilla.org/en-US/docs/Web/API/Element/closest


const gradeTable = document.getElementById('gradeTable');
    const averageCells = document.querySelectorAll('.average');
    const unsubmittedCount = document.getElementById('unsubmittedCount');
    let presentationMode = 'percent'; 

    const conversionTable = {
      percent: value => `${value}%`,
      letter: value => {
        if (value >= 93) return 'A';
        else if (value >= 90) return 'A-';
        else if (value >= 87) return 'B+';
        else if (value >= 83) return 'B';
        else if (value >= 80) return 'B-';
        else if (value >= 77) return 'C+';
        else if (value >= 73) return 'C';
        else if (value >= 70) return 'C-';
        else if (value >= 67) return 'D+';
        else if (value >= 63) return 'D';
        else if (value >= 60) return 'D-';
        else return 'F';
      },
      '4.0': value => {
        if (value >= 93) return '4.0';
        else if (value >= 90) return '3.7';
        else if (value >= 87) return '3.3';
        else if (value >= 83) return '3.0';
        else if (value >= 80) return '2.7';
        else if (value >= 77) return '2.3';
        else if (value >= 73) return '2.0';
        else if (value >= 70) return '1.7';
        else if (value >= 67) return '1.3';
        else if (value >= 63) return '1.0';
        else if (value >= 60) return '0.7';
        else return '0.0';
      }
    };

    function saveTableState() {
      const tableHtml = document.getElementById('gradeTable').innerHTML;
      localStorage.setItem('tableState', tableHtml);
    }

    function restoreTableState() {
      const savedTableHtml = localStorage.getItem('tableState');
      if (savedTableHtml) {
        document.getElementById('gradeTable').innerHTML = savedTableHtml;
        calculateAverage();
        countUnsubmitted();
      }
    }

    function calculateAverage() {
      const rows = document.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td:not(.average):not(:first-child):not(:nth-child(2))'); // Excluding the first two columns
        let sum = 0;
        let count = 0;
        cells.forEach(cell => {
          const value = parseInt(cell.textContent);
          if (!isNaN(value)) {
            sum += value;
            count++;
          }
        });
        const average = count > 0 ? Math.round(sum / count) : '-';
        const averageCell = row.querySelector('.average');
        averageCell.textContent = average === '-' ? '-' : conversionTable[presentationMode](average);
        if (average !== '-' && average < 60) {
          averageCell.classList.add('red-bg');
        } else {
          averageCell.classList.remove('red-bg');
        }
      });
    }

    function countUnsubmitted() {
      const assignmentCells = document.querySelectorAll('tbody td.yellow-bg');
      let unsubmittedAssignments = 0;
      assignmentCells.forEach(cell => {
        if (cell.textContent.trim() === '-') {
          unsubmittedAssignments++;
        }
      });
      unsubmittedCount.textContent = `Unsubmitted Assignments: ${unsubmittedAssignments}`;
    }
  document.addEventListener('DOMContentLoaded', countUnsubmitted);


gradeTable.addEventListener('input', function(event) {
  const target = event.target;

  if (target.matches('td[contenteditable="true"]') && !target.classList.contains('average')) {

    if (target.textContent.trim() !== '') {
      target.classList.remove('yellow-bg');
    }

    if (target.cellIndex > 1) {
      const value = parseInt(target.textContent);
      if (isNaN(value) || value < 0 || value > 100) {
        target.textContent = '-';
        target.style.textAlign = 'center'; 
      } else {
        target.style.textAlign = 'right'; 
      }
    }
    calculateAverage();
    countUnsubmitted();
  }
});



function addRow() {
  const newRow = gradeTable.insertRow(-1);

  const headerRow = gradeTable.rows[0];
  for (let i = 0; i < headerRow.cells.length; i++) {
    const newCell = newRow.insertCell(-1);
    if (i === headerRow.cells.length - 1) {
      newCell.textContent = '-';
      newCell.classList.add('average');
    } else {
      newCell.contentEditable = 'true';
      newCell.textContent = '-';
      if (i > 1) {
        newCell.classList.add('yellow-bg');
      }
    }
  }
  

const deleteCell = newRow.insertCell(-1);
deleteCell.className = 'delete-cell';
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.onclick = function() {
  deleteRow(this);
};
deleteCell.appendChild(deleteButton);



  calculateAverage();
  countUnsubmitted();
}

    let assignmentCount = 5;

   
function addColumn() {
  const headerRow = gradeTable.querySelector('thead tr');
  const assignmentColumns = headerRow.querySelectorAll('th:not(:first-child):not(:nth-child(2))');
  const lastAssignmentColumnIndex = assignmentColumns.length - 1; 

  const newColumn = document.createElement('th');
  assignmentCount++;
  newColumn.textContent = `Assignment ${assignmentCount}`;

  if (lastAssignmentColumnIndex === -1) {
    headerRow.insertBefore(newColumn, headerRow.lastElementChild);
  } else {
    headerRow.insertBefore(newColumn, assignmentColumns[lastAssignmentColumnIndex].nextElementSibling);
  }

  const rows = document.querySelectorAll('tbody tr');
  rows.forEach((row, index) => {
    const newCell = document.createElement('td');
    newCell.contentEditable = 'true';
    newCell.textContent = '-';
    newCell.classList.add('yellow-bg');
    if (lastAssignmentColumnIndex === -1) {
      row.insertBefore(newCell, row.lastElementChild);
    } else {
      row.insertBefore(newCell, row.cells[lastAssignmentColumnIndex + 1]);
    }
    
  });

  const averageColumn = headerRow.querySelector('.average-header');
  headerRow.appendChild(averageColumn);

  calculateAverage();
  countUnsubmitted();
}

    function handleCellClick(event) {
      const target = event.target;
      if (target.textContent === '-') {
        target.textContent = '';
        target.focus();
      }
    }

    const editableCells = document.querySelectorAll('td[contenteditable="true"]');
    editableCells.forEach(cell => {
      cell.addEventListener('click', handleCellClick);
    });

    function toggleAveragePresentation() {
      const averageHeader = document.querySelector('.average-header');
      switch (presentationMode) {
        case 'percent':
          presentationMode = 'letter';
          averageHeader.textContent = 'Average [Letter]';
          break;
        case 'letter':
          presentationMode = '4.0';
          averageHeader.textContent = 'Average [4.0]';
          break;
        case '4.0':
          presentationMode = 'percent';
          averageHeader.textContent = 'Average [%]';
          break;
      }
      calculateAverage();
    }

    function deleteRow(button) {
  const row = button.closest('tr');
  row.remove();

  calculateAverage();
  countUnsubmitted();
}