const createNewEmployeeButton = document.getElementById("createEmployeeButton");
createNewEmployeeButton.addEventListener('click', () => {
    document.getElementById("form-container").style.display = "block";
    createNewEmployeeButton.style.display = "none";
    document.getElementById("submitEmployeeButton").style.display = "inline";
})

const submitEmployeeButton = document.getElementById("submitEmployeeButton");
submitEmployeeButton.addEventListener('click', () => {
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
})

const extractUserInformation = function() {
    let name = document.getElementById('nameInput').value;
    let occupation = document.getElementById('occupationInput').value;
    let salary = document.getElementById('salaryInput').value;
    return {name: name, occupation: occupation, salary: salary};
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


