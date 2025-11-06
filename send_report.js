// ===================================================================
// HELPER FUNCTIONS (Copied from PDF_Generation.js)
// We need these here so this script can find the trace calculator values.
// ===================================================================

/**
 * Gets all input values from the Trace Width calculator.
 */
function getTraceInputs() {
    try {
        return {
            current: document.getElementById('tw_current').value + ' A',
            rise: document.getElementById('tw_rise').value + ' ' + document.getElementById('tw_riseUnit').value,
            ambient: document.getElementById('tw_ambient').value + ' ' + document.getElementById('tw_ambientUnit').value,
            thickness: document.getElementById('tw_thickness').value + ' ' + document.getElementById('tw_thicknessUnit').value,
            trace: document.getElementById('tw_trace').value + ' ' + document.getElementById('tw_traceUnit').value,
        };
    } catch (e) {
        console.error("Error getting trace inputs:", e);
        return { error: "Could not read trace inputs" };
    }
}

/**
 * Gets all result values from the Trace Width calculator.
 */
function getTraceResults() {
    const getElemText = (id) => {
        const elem = document.getElementById(id);
        // .innerText se multiline text (jaise width) mil jaata hai
        return elem ? elem.innerText.replace(/\n/g, ' ') : 'Error: N/A'; // Replace newlines with a space
    };
    
    try {
        return {
            internalWidth: getElemText('tw_internalWidth'),
            internalResistance: getElemText('tw_internalResistance'),
            internalVoltage: getElemText('tw_internalVoltage'),
            internalPower: getElemText('tw_internalPower'),
            externalWidth: getElemText('tw_externalWidth'),
            externalResistance: getElemText('tw_externalResistance'),
            externalVoltage: getElemText('tw_externalVoltage'),
            externalPower: getElemText('tw_externalPower'),
        };
    } catch (e) {
        console.error("Error getting trace results:", e);
        return { error: "Could not read trace results" };
    }
}


// ===================================================================
// MAIN SCRIPT LOGIC
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // -------------------------------------------------------------------------
    // ❗ IMPORTANT: REPLACE THIS URL
    // Get this from Google Apps Script after you Deploy
    // -------------------------------------------------------------------------
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDiS5ITkGzLMXmjCJUZItLn2kz0mOvzpYsHRDCaFc9UPvGxaN3wqox3bRn2gGyO7yIsw/exec';
    
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
            mode: 'no-cors', // <-- THIS IS THE CRITICAL FIX
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