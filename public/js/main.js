const createNewEmployeeButton = document.getElementById("createEmployeeButton");
createNewEmployeeButton.addEventListener('click', () => {
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
                console.log(data);
            })
    }
})

const extractUserInformation = function() {
    let name = document.getElementById('nameInput').value;
    let occupation = document.getElementById('occupationInput').value;
    let salary = document.getElementById('salaryInput').value;
    return {name: name, occupation: occupation, salary: salary};
}

const validateForm = function() {
    return validateName() && validateOccupation() && validateSalary();
}


const deleteButtons = document.querySelectorAll('.deleteButton');

deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        const id = row.rowIndex;

        // pass the rowIndex into delete method.
        fetch(`/delete/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Row deleted successfully');
                } else {
                    console.error('Error deleting row');
                }
            })
            .catch((error) => {
                console.error('Network error:', error);
            });
    })
});

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


