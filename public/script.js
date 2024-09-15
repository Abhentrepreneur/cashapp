// Signup function
async function signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });

        if (response.ok) {
            alert('Signup successful!');
        } else {
            const error = await response.text();
            alert('Signup failed: ' + error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Signup failed: Server error');
    }
}

// Login function
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            alert('Login successful!');
        } else {
            const error = await response.text();
            alert('Login failed: ' + error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Login failed: Server error');
    }
}

// Load saved data on page load
$(document).ready(function () {
    const savedData = JSON.parse(localStorage.getItem('resumeData'));
    if (savedData) {
        loadSavedData(savedData);
    }
});

// Define input fields for the resume
const resumeFields = [
    { label: 'Name', type: 'text' },
    { label: 'Email', type: 'email' },
    { label: 'Phone', type: 'tel' },
    { label: 'Address', type: 'text' },
    // Add more fields as needed
];

// Dynamically generate form fields based on the resumeFields array
const form = document.getElementById('resumeForm');
resumeFields.forEach(field => {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'form-group';

    const label = document.createElement('label');
    label.textContent = field.label;
    
    const input = document.createElement('input');
    input.type = field.type;
    input.className = 'form-control';
    input.placeholder = `Enter your ${field.label}`;
    input.required = true;

    inputGroup.appendChild(label);
    inputGroup.appendChild(input);
    form.appendChild(inputGroup);
});

function generateResume() {
    const resumeContent = generateResumeContent();
    $('#resume').html(resumeContent);
    $('#resume').removeClass('hidden');

    // Save data to localStorage
    const resumeData = getFormData();
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

function downloadPDF() {
    const resumeContent = generateResumeContent();

    if (!resumeContent) {
        alert("Generate a resume first.");
        return;
    }

    // Create an element to hold the resume content
    const resumeElement = document.createElement('div');
    resumeElement.innerHTML = resumeContent;

    // Options for html2pdf
    const options = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().from(resumeElement).set(options).save();
}

function generateResumeContent() {
    let resumeContent = '';

    // Loop through form fields to construct the resume content
    resumeFields.forEach(field => {
        const inputValue = $(`input[placeholder="Enter your ${field.label}"]`).val();
        resumeContent += `<p><strong>${field.label}:</strong> ${inputValue}</p>`;
    });

    // Add more details to the resumeContent as needed

    return resumeContent;
}

function getFormData() {
    const formData = {};

    // Loop through form fields to collect user input
    resumeFields.forEach(field => {
        const inputValue = $(`input[placeholder="Enter your ${field.label}"]`).val();
        formData[field.label.toLowerCase()] = inputValue;
    });

    return formData;
}

// Load saved data into the form
function loadSavedData(data) {
    resumeFields.forEach(field => {
        const input = $(`input[placeholder="Enter your ${field.label}"]`);
        if (input.length > 0) {
            input.val(data[field.label.toLowerCase()]);
        }
    });
}
