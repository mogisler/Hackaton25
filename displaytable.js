// Function to create and display the table
function displayTable(data) {
    const tableContainer = document.getElementById("tableContainer");

    // Clear any existing content in the container
    tableContainer.innerHTML = "";

    // Create a table element
    const table = document.createElement("table");
    table.className = "table table-bordered";

    // Create the table body
    const tbody = document.createElement("tbody");
    for (const key in data) {
        const row = document.createElement("tr");

        const keyCell = document.createElement("td");
        keyCell.textContent = key;
        row.appendChild(keyCell);
        
        const valueCell = document.createElement("td");

        valueCell.contentEditable = true;
        valueCell.classList.add("editable-cell");
        valueCell.textContent = data[key];
        valueCell.addEventListener("blur", () => {
            console.log(`Updated ${key}: ${valueCell.textContent}`);
            data[key] = valueCell.textContent; // Update the data object
        });
        row.appendChild(valueCell);

        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    // Append the table to the container
    tableContainer.appendChild(table);
}

// Fetch the JSON data and display it
fetch("testoutput.json")
    .then((response) => {
        console.log("Fetching JSON...");
        if (!response.ok) {
            throw new Error("Failed to fetch JSON file");
        }
        return response.json();
    })
    .then((data) => {
        console.log("JSON Data:", data);
        displayTable(data);
    })
    .catch((error) => {
        console.error("Error fetching JSON:", error);
    });