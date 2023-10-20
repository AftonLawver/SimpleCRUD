const createNewEmployeeButton = document.getElementById("createEmployeeButton");
createNewEmployeeButton.addEventListener('click', () => {
    document.getElementById("form-container").style.display = "block";
    createNewEmployeeButton.style.display = "none";
    document.getElementById("submitEmployeeButton").style.display = "block";
})

function getEmployees() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        },
    };
    fetch('/', options)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

        })
}

getEmployees();


