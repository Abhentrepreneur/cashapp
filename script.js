import { Analytics } from "@vercel/analytics/react"
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
    const resumeContent = this.generateResumeContent();

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
    html2pdf(resumeElement, options);
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
