document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("eventDescription").value;

    try  {
        const request = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:  JSON.stringify({ inputPrompt : prompt }),
        };

        const response = await fetch("http://localhost:3000/openAPI", request);

        if (!response.ok) {
            throw new Error("Failed to fetch JSON file");
        }

        const data = await response.json();
        console.log(data);
        const tableBody = document.getElementById("tableBody");

        // Populate the table with data
        for (const key in data) {
            const row = document.createElement("tr");

            const keyCell = document.createElement("td");
            keyCell.textContent = key;
            row.appendChild(keyCell);

            const valueCell = document.createElement("td");
            if (typeof data[key] === "boolean") {
                // Create a checkbox for boolean values
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = data[key];
                checkbox.id = `${key}Checkbox`;
                valueCell.appendChild(checkbox);
            } else if (typeof data[key] === "number") {
                // Create a number input for numeric values
                const numberInput = document.createElement("input");
                numberInput.type = "number";
                numberInput.value = data[key];
                numberInput.min = "0";
                numberInput.step = "1";
                numberInput.id = `${key}Input`;
                valueCell.appendChild(numberInput);
            } else if (key === "Datum") {
                // Create a date picker for the Datum field
                const dateInput = document.createElement("input");
                dateInput.type = "date";
                dateInput.value = data[key] ? data[key].split(".").reverse().join("-") : ""; // Convert DD.MM.YYYY to YYYY-MM-DD
                dateInput.id = `${key}DatePicker`;
                valueCell.appendChild(dateInput);
            } else if (key === "Zeit") {
                // Create a time picker for the Zeit field
                const timeInput = document.createElement("input");
                timeInput.type = "time";
                timeInput.value = data[key] || ""; // Use the value from JSON or leave empty
                timeInput.id = `${key}TimePicker`;
                valueCell.appendChild(timeInput);
            } else {
                // Handle null values and make text fields editable
                valueCell.contentEditable = true;
                valueCell.textContent = data[key] === null ? "" : data[key];
            }
            row.appendChild(valueCell);

            tableBody.appendChild(row);
        
        }
        
    } catch (error) {
        console.error(error);
        document.getElementById("response").innerText = "Failed to connect to the server.";
    }
    //window.location.href = "eventdetails.html";
});