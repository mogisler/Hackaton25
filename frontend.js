document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("eventDescription").value;

    try  {
        // Test commend
        const response = await fetch("http://localhost:3000/api/completion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("response").innerText = data.response;
        } else {
            document.getElementById("response").innerText = "Error: " + data.error;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("response").innerText = "Failed to connect to the server.";
    }
});