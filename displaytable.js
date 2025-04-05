// Fetch data from testoutput.json and populate the table
// fetch("testoutput.json")
//     .then((response) => {
//         if (!response.ok) {
//             throw new Error("Failed to fetch JSON file");
//         }
//         return response.json();
//     })
//     .then((data) => {
//         const tableBody = document.getElementById("tableBody");

//         // Populate the table with data
//         for (const key in data) {
//             const row = document.createElement("tr");

//             const keyCell = document.createElement("td");
//             keyCell.textContent = key;
//             row.appendChild(keyCell);

//             const valueCell = document.createElement("td");
//             if (typeof data[key] === "boolean") {
//                 // Create a checkbox for boolean values
//                 const checkbox = document.createElement("input");
//                 checkbox.type = "checkbox";
//                 checkbox.checked = data[key];
//                 checkbox.id = `${key}Checkbox`;
//                 valueCell.appendChild(checkbox);
//             } else if (typeof data[key] === "number") {
//                 // Create a number input for numeric values
//                 const numberInput = document.createElement("input");
//                 numberInput.type = "number";
//                 numberInput.value = data[key];
//                 numberInput.min = "0";
//                 numberInput.step = "1";
//                 numberInput.id = `${key}Input`;
//                 valueCell.appendChild(numberInput);
//             } else if (key === "Datum") {
//                 // Create a date picker for the Datum field
//                 const dateInput = document.createElement("input");
//                 dateInput.type = "date";
//                 dateInput.value = data[key] ? data[key].split(".").reverse().join("-") : ""; // Convert DD.MM.YYYY to YYYY-MM-DD
//                 dateInput.id = `${key}DatePicker`;
//                 valueCell.appendChild(dateInput);
//             } else if (key === "Zeit") {
//                 // Create a time picker for the Zeit field
//                 const timeInput = document.createElement("input");
//                 timeInput.type = "time";
//                 timeInput.value = data[key] || ""; // Use the value from JSON or leave empty
//                 timeInput.id = `${key}TimePicker`;
//                 valueCell.appendChild(timeInput);
//             } else {
//                 // Handle null values and make text fields editable
//                 valueCell.contentEditable = true;
//                 valueCell.textContent = data[key] === null ? "" : data[key];
//             }
//             row.appendChild(valueCell);

//             tableBody.appendChild(row);
//         }
//     })
//     .catch((error) => {
//         console.error("Error fetching JSON:", error);
//     });

// Handle the submit button click
document.getElementById("submitDetails").addEventListener("click", () => {
    const rows = document.querySelectorAll("table tbody tr");
    const updatedData = {};

    rows.forEach((row) => {
        const key = row.children[0].textContent.trim();
        const valueCell = row.children[1];

        // Check if the value is a checkbox
        if (valueCell.querySelector("input[type='checkbox']")) {
            updatedData[key] = valueCell.querySelector("input[type='checkbox']").checked;
        }
        // Check if the value is a number input
        else if (valueCell.querySelector("input[type='number']")) {
            updatedData[key] = parseInt(valueCell.querySelector("input[type='number']").value, 10);
        }
        // Check if the value is a date picker
        else if (valueCell.querySelector("input[type='date']")) {
            const dateValue = valueCell.querySelector("input[type='date']").value;
            updatedData[key] = dateValue ? dateValue.split("-").reverse().join(".") : null; // Convert YYYY-MM-DD to DD.MM.YYYY
        }
        // Check if the value is a time picker
        else if (valueCell.querySelector("input[type='time']")) {
            updatedData[key] = valueCell.querySelector("input[type='time']").value || null;
        }
        // Otherwise, treat it as editable text
        else {
            const textValue = valueCell.textContent.trim();
            updatedData[key] = textValue === "" ? null : textValue; // Convert empty fields back to null
        }
    });

    console.log("Updated Data:", updatedData); // Log the updated data
    window.location.href = "antwort.html"; // Redirect to antwort.html
});