// ===================================================================
// MAIN SCRIPT LOGIC
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // -------------------------------------------------------------------------
    // ❗ IMPORTANT: REPLACE THIS URL
    // Get this from Google Apps Script after you Deploy
    // -------------------------------------------------------------------------
    const GOOGLE_SCRIPT_URL = CONFIG.GOOGLE_SCRIPT_URL;
    
    // Get all the modal elements
    const modal = document.getElementById('reportModal');
    const sendRequestBtn = document.getElementById('sendRequestBtn');
    const closeModalBtn = document.querySelector('.modal-close');
    const reportForm = document.getElementById('reportForm');
    const formStatus = document.getElementById('formStatus');
    const sendSubmitBtn = document.getElementById('sendReportSubmit');

    // Show the modal when "Send Request" is clicked
    sendRequestBtn.addEventListener('click', () => {
        // First, check if a calculation has been run
        if (!window.motorResults || typeof getMotorInputs === 'undefined') {
            const originalText = sendRequestBtn.textContent;
            sendRequestBtn.textContent = 'Run Calculation First!';
            sendRequestBtn.disabled = true;
            
            // Reset the button after 3 seconds
            setTimeout(() => {
                sendRequestBtn.textContent = originalText;
                sendRequestBtn.disabled = false;
            }, 3000);
            return; // Stop and don't open the modal
        }

        // If calculation exists, open the modal
        modal.style.display = 'block';
        formStatus.textContent = '';
        reportForm.reset();
        sendSubmitBtn.disabled = false; // Make sure button is enabled
    });

    // Hide the modal when the 'x' is clicked
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Hide the modal if the user clicks outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    reportForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Stop the form from submitting normally
        
        sendSubmitBtn.disabled = true;
        formStatus.textContent = 'Sending...';
        formStatus.style.color = '#333';

        // 1. Get user data from the form
        const userName = document.getElementById('userName').value;
        const userMobile = document.getElementById('userMobile').value;
        const userEmail = document.getElementById('userEmail').value;
        
        // 2. Combine all data to send
        const dataToSend = {
            timestamp: new Date().toLocaleString(),
            name: userName,
            mobile: userMobile,
            email: userEmail,
            userAgent: navigator.userAgent,
            inputs: getMotorInputs(),      // This function is in main.js
            results: window.motorResults,  // This variable is set in main.js
            
            // --- ⬇️ THIS IS THE NEW PART ⬇️ ---
            traceInputs: getTraceInputs(),   // From helper function
            traceResults: getTraceResults()  // From helper function
        };

        // 4. Send the data to the Google Script
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
        .then(() => {
            // Because of 'no-cors', we can't read the response.
            // We just assume it worked and show success.
            formStatus.textContent = 'Success! Your report has been sent.';
            formStatus.style.color = 'green';
            
            // Close the modal after 2 seconds
            setTimeout(() => {
                modal.style.display = 'none';
            }, 2000);
        })
        .catch((error) => {
            // This will now only catch network errors (e.g., no internet)
            formStatus.textContent = 'Error: A network error occurred.';
            formStatus.style.color = 'red';
            console.error('Error sending report:', error);
        })
        .finally(() => {
            // Re-enable the button *unless* we are in the success state
            if (formStatus.style.color !== 'green') {
                 sendSubmitBtn.disabled = false;
            }
        });
    });
});
