function createCell(text, isHeader = false, colspan = 1) {
    const cell = document.createElement(isHeader ? 'th' : 'td');
    cell.textContent = text;
    if (colspan > 1) {
        cell.colSpan = colspan;
    }
    return cell;
}


function createNestedTable(array) {
    const nestedTable = document.createElement('table');
    nestedTable.className = 'table table-bordered table-striped table-responsive-sm';
    array.forEach((item, index) => {
        const headerRow = document.createElement('tr');
        const headerCell = createCell(`➜ ${index + 1}:`, true, 2);
        headerRow.appendChild(headerCell);
        nestedTable.appendChild(headerRow);
        for (let key in item) {
            const row = document.createElement('tr');
            row.appendChild(createCell(key));
            row.appendChild(createCell(item[key] || ''));
            nestedTable.appendChild(row);
        }
    });
    return nestedTable;
}


document.getElementById("submitDetails").addEventListener("click", async() => {
    const rows = document.querySelectorAll("table tbody tr");
    const updatedData = {};

    rows.forEach((row) => {
        const key = row.children[0].textContent.trim();
        const valueCell = row.children[1];

        // Check if the value is a checkbox
        /*
        if (valueCell.querySelector("input[type='checkbox']")) {
            updatedData[key] = valueCell.querySelector("input[type='checkbox']").checked;
        }
            */
        if (valueCell == undefined){
            updatedData[key] = true;
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

    try  {
        console.log("Updated Data:", updatedData); // Log the updated data
        const inputPrompt = document.getElementById("eventDescription").value;
        const request = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:   JSON.stringify({inputPrompt: inputPrompt  , parameters :updatedData}),
        };
        
        const response = await fetch("http://localhost:3000/trainedAPI", request);

        if (!response.ok) {
            throw new Error("Failed to fetch JSON file");
        }

        const data = await response.json();
        console.log(data);
        const tbody = document.getElementById('letzteTabelle');
            // Durchlaufen der Eigenschaften in data
        for (let property in data) {
            const row = document.createElement('tr');
            row.appendChild(createCell(property, true));

            const value = data[property];
            // Wenn der Wert ein Array ist, erstelle verschachtelte Tabellen
            if (Array.isArray(value)) {
                const cell = document.createElement('td');
                cell.colSpan = 1;
                cell.appendChild(createNestedTable(value));
                row.appendChild(cell);
            } else {
                // Bei einfachen Textwerten
                row.appendChild(createCell(value, false, 1));
            }
            tbody.appendChild(row);
        }

    // window.location.href = "antwort.html"; // Redirect to antwort.html
    } catch (error) {
        console.error(error);
    }
});