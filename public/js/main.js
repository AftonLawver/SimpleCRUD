const socket = io();
getEmployees();

const createNewEmployeeButton = document.getElementById("createEmployeeButton");
createNewEmployeeButton.addEventListener('click', () => {
    document.getElementById("nameInput").value = "";
    document.getElementById("occupationInput").value = "";
    document.getElementById("salaryInput").value = "";
    document.getElementById("createEmployeeForm").style.display = "block";
    document.getElementById("form-container").style.display = "block";
    createNewEmployeeButton.style.display = "none";
    document.getElementById("submitEmployeeButton").style.display = "inline";
})


const submitEmployeeButton = document.getElementById("submitEmployeeButton");
submitEmployeeButton.addEventListener('click', () => {
    if (validateForm()) {
        const data = extractUserInformation();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch('/create', options)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("createEmployeeForm").style.display = "none";
                document.getElementById("submitEmployeeButton").style.display = "none";
                document.getElementById("createEmployeeButton").style.display = "inline";
                document.getElementById("message").style.display = "block";
                document.getElementById("message").innerText = "Employee created!";
                setTimeout(() => {
                    document.getElementById("message").style.display = "none";
                }, 4000);
            })
    }
})

socket.on('employee', addEmployee);

function addEmployee(employee) {
    const tableBody = document.getElementById("tableBody");

    // Create new HTML elements for the row and cells
    const newRow = document.createElement('tr');
    const idCell = document.createElement('td');
    const nameCell = document.createElement('td');
    const occupationCell = document.createElement('td');
    const salaryCell = document.createElement('td');
    const actionCell = document.createElement('td');
    const updateButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    // Set the text content and button attributes
    idCell.textContent = employee.employee_id;
    nameCell.textContent = employee.name;
    occupationCell.textContent = employee.occupation;
    salaryCell.textContent = employee.salary;
    actionCell.classList.add("centeredCell");
    updateButton.textContent = 'Update';
    updateButton.classList.add('updateButton', 'buttons2');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton', 'buttons2');

    deleteButton.addEventListener('click', (event) => {
        document.getElementById("createEmployeeForm").style.display = "none";
        document.getElementById("form-container").style.display = "none";
        createNewEmployeeButton.style.display = "inline";
        document.getElementById("submitEmployeeButton").style.display = "none";
        const row = event.target.closest('tr');
        const id = row.firstChild.textContent;

        // pass the rowIndex into delete method.
        fetch(`/delete/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    row.remove();
                    document.getElementById("createEmployeeForm").style.display = "none";
                    document.getElementById("message").style.display = "block";
                    document.getElementById("message").innerText = "Employee deleted!";
                    setTimeout(() => {
                        document.getElementById("message").style.display = "none";
                    }, 4000);
                } else {
                    console.error('Error deleting employee');
                }
            })
            .catch((error) => {
                console.error('Network error:', error);
            });
    })

    updateButton.addEventListener('click', (event) => {
        document.getElementById("createEmployeeForm").style.display = "none";
        document.getElementById("form-container").style.display = "none";
        createNewEmployeeButton.style.display = "inline";
        document.getElementById("submitEmployeeButton").style.display = "none";
        const row = event.target.closest('tr');
        const id = row.firstChild.textContent;

        // open up the modal
        modal.style.display = "block";

        //fill in the current employees data that the user is trying to modify
        const currentName = document.getElementById("currentName");
        const currentOccupation = document.getElementById("currentOccupation");
        const currentSalary = document.getElementById("currentSalary");

        currentName.textContent = row.children[1].textContent;
        currentOccupation.textContent = row.children[2].textContent;
        currentSalary.textContent = row.children[3].textContent;

        const submitUpdateButton = document.getElementById("submitUpdateButton");
        submitUpdateButton.addEventListener('click', (event) => {
            if (validateModalForm()) {
                const name = document.getElementById("modalNameInput").value;
                const occupation = document.getElementById("modalOccupationInput").value;
                const salary = document.getElementById("modalSalaryInput").value;
                const dataToUpdate = {
                    employeeName: name,
                    occupation: occupation,
                    salary: salary,
                }
                fetch(`/update/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToUpdate),
                })
                    .then((response) => {
                        if (response.ok) {
                            row.children[1].textContent = name;
                            row.children[2].textContent = occupation;
                            row.children[3].textContent = salary;
                            modal.style.display = "none";
                            document.getElementById("createEmployeeForm").style.display = "none";
                            document.getElementById("message").style.display = "block";
                            document.getElementById("message").innerText = "Employee updated!";
                            setTimeout(() => {
                                document.getElementById("message").style.display = "none";
                            }, 4000);
                        } else {
                            console.error('Error updating employee');
                        }
                    })
                    .catch((error) => {
                        console.error('Network error:', error);
                    });
            }
        })
    })

    // Append the cells to the row and the buttons to the action cell
    newRow.appendChild(idCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(occupationCell);
    newRow.appendChild(salaryCell);
    actionCell.appendChild(updateButton);
    actionCell.appendChild(deleteButton);
    newRow.appendChild(actionCell);

    // Append the new row to the table body
    tableBody.appendChild(newRow);
}

function getEmployees() {
    fetch ("/employees")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Parse the response body as JSON
            return response.json();
        })
        .then(data => {
            // Handle the JSON data
            // console.log(`do something with the data: ${data}`);
            data.forEach(addEmployee);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

const extractUserInformation = function() {
    let name = document.getElementById('nameInput').value;
    let occupation = document.getElementById('occupationInput').value;
    let salary = document.getElementById('salaryInput').value;
    return {name: name, occupation: occupation, salary: salary};
}

const validateForm = function() {
    return validateName() && validateOccupation() && validateSalary();
}

const validateModalForm = function() {
    return validateModalName() && validateModalOccupation() && validateModalSalary();
}

function validateName() {
    const nameInput = document.getElementById('nameInput');
    if (!nameInput.value.match(/^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/)) {
        let nameErrorMessage = document.getElementById("nameErrorMessage");
        nameErrorMessage.innerHTML = "Please enter a valid name.";
        nameInput.style.border = "1px solid red";
        nameErrorMessage.style.display = "block";
        return false;
    } else {
        let nameErrorMessage = document.getElementById("nameErrorMessage");
        nameInput.style.border = "1px solid green";
        nameErrorMessage.style.display = "none";
        return true;
    }
}

function validateOccupation() {
    const occupationInput = document.getElementById('occupationInput');
    if (!occupationInput.value.match(/^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/)) {
        let occupationErrorMessage = document.getElementById("occupationErrorMessage");
        occupationErrorMessage.innerHTML = "Please enter a valid occupation.";
        occupationInput.style.border = "1px solid red";
        occupationErrorMessage.style.display = "block";
        return false;
    } else {
        let occupationErrorMessage = document.getElementById("occupationErrorMessage");
        occupationInput.style.border = "1px solid green";
        occupationErrorMessage.style.display = "none";
        return true;
    }
}

function validateSalary() {
    const salaryInput = document.getElementById('salaryInput');
    if (!salaryInput.value.match(/^\d{1,7}(?:\.\d{0,2})?$/)) {
        let salaryErrorMessage = document.getElementById("salaryErrorMessage");
        salaryErrorMessage.innerHTML = "Please enter a valid salary.";
        salaryInput.style.border = "1px solid red";
        salaryErrorMessage.style.display = "block";
        return false;
    } else {
        let salaryErrorMessage = document.getElementById("salaryErrorMessage");
        salaryInput.style.border = "1px solid green";
        salaryErrorMessage.style.display = "none";
        return true;
    }
}

function validateModalName() {
    const modalNameInput = document.getElementById('modalNameInput');
    const modalNameErrorMessage = document.getElementById("modalNameErrorMessage");
    if (!modalNameInput.value.match(/^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/)) {
        modalNameErrorMessage.innerHTML = "Please enter a valid name.";
        modalNameInput.style.border = "1px solid red";
        modalNameErrorMessage.style.display = "block";
        return false;
    } else {
        modalNameInput.style.border = "1px solid green";
        modalNameErrorMessage.style.display = "none";
        return true;
    }
}

function validateModalOccupation() {
    const modalOccupationInput = document.getElementById('modalOccupationInput');
    const modalOccupationErrorMessage = document.getElementById("modalOccupationErrorMessage");
    if (!modalOccupationInput.value.match(/^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/)) {
        modalOccupationErrorMessage.innerHTML = "Please enter a valid occupation.";
        modalOccupationInput.style.border = "1px solid red";
        modalOccupationErrorMessage.style.display = "block";
        return false;
    } else {
        modalOccupationInput.style.border = "1px solid green";
        modalOccupationErrorMessage.style.display = "none";
        return true;
    }
}

function validateModalSalary() {
    const modalSalaryInput = document.getElementById('modalSalaryInput');
    let modalSalaryErrorMessage = document.getElementById("modalSalaryErrorMessage");
    if (!modalSalaryInput.value.match(/^\d{1,7}(?:\.\d{0,2})?$/)) {
        modalSalaryErrorMessage.innerHTML = "Please enter a valid salary.";
        modalSalaryInput.style.border = "1px solid red";
        modalSalaryErrorMessage.style.display = "block";
        return false;
    } else {
        modalSalaryInput.style.border = "1px solid green";
        modalSalaryErrorMessage.style.display = "none";
        return true;
    }
}

const modal = document.getElementById("myModal");
const modalNameErrorMessage = document.getElementById("modalNameErrorMessage");
const modalSalaryErrorMessage = document.getElementById("modalSalaryErrorMessage");
const modalOccupationErrorMessage = document.getElementById("modalOccupationErrorMessage");
const modalNameInput = document.getElementById('modalNameInput');
const modalOccupationInput = document.getElementById('modalOccupationInput');
const modalSalaryInput = document.getElementById('modalSalaryInput');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    modalNameErrorMessage.style.display = "none";
    modalOccupationErrorMessage.style.display = "none";
    modalSalaryErrorMessage.style.display = "none";
    modalNameInput.style.border = "2px solid grey";
    modalOccupationInput.style.border = "2px solid grey";
    modalSalaryInput.style.border = "2px solid grey";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
        modalNameErrorMessage.style.display = "none";
        modalOccupationErrorMessage.style.display = "none";
        modalSalaryErrorMessage.style.display = "none";
        modalNameInput.style.border = "2px solid grey";
        modalOccupationInput.style.border = "2px solid grey";
        modalSalaryInput.style.border = "2px solid grey";
    }
}