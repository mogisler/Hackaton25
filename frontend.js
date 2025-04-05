document.getElementById("submit").addEventListener("click", async () => {
    const prompt = document.getElementById("eventDescription").value;

    // Test commend
    const request = {
        method: "GET",
    };
    
    await fetch("http://localhost:3000/test")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });


    // try  {
    //     // Test commend
    //     const request = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "test",
    //         },
    //         body: JSON.stringify({ prompt }),
    //     };

    //     const response = await fetch("http://localhost:3000/test", request);

    //     const data = await response.json();
    //     if (response.ok) {
    //         document.getElementById("response").innerText = data.response;
    //     } else {
    //         document.getElementById("response").innerText = "Error: " + data.error;
    //     }

    //     console.log(data);
    // } catch (error) {
    //     console.error(error);
    //     document.getElementById("response").innerText = "Failed to connect to the server.";
    // }
});

document.getElementById("submit").addEventListener("click", async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(100);
    const response = fetch("http://localhost:3000/test", ); 

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    // Display the response in an element with ID 'response' (if it exists)
    document.getElementById("response").innerText = JSON.stringify(data, null, 2);
});