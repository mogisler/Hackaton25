document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("eventDescription").value;

    try  {
        const request = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:  JSON.stringify({ prompt : prompt }),
        };

        const response = await fetch("http://localhost:3000/trainedAPI", request);

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.error(error);
        document.getElementById("response").innerText = "Failed to connect to the server.";
    }
    //window.location.href = "eventdetails.html";
});