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

// function getEmployees() {
//     const options = {
//         method: 'GET',
//         headers: {
//             'Content-Type': "application/json"
//         },
//     };
//     fetch('/employees', options)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data);
//
//
//         })
//         .catch((error) => {
//             console.error("Error: ", error);
//         });
// }


