// Function to get the current date on click
function getDateOnClick() {
    const button = document.getElementById('getDateButton');
    button.addEventListener('click', () => {
        const currentDate = new Date();
        console.log(currentDate.toString());
        alert(`Current Date: ${currentDate.toString()}`);
    });
}

// Call the function to attach the event listener
getDateOnClick();


