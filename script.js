const roleInput = document.getElementById('role-input');
const generateBtn = document.getElementById('generate-btn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const error = document.getElementById('error');
const technicalQA = document.getElementById('technical-qa');
const personalQA = document.getElementById('personal-qa');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');

let currentData = null;

generateBtn.addEventListener('click', generateQA);
roleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateQA();
});
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadPDF);

async function generateQA() {
    const role = roleInput.value.trim();
    
    if (!role) {
        showError('Please enter a role or topic');
        return;
    }

    hideError();
    hideResults();
    showLoading();
    generateBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate Q&A');
        }

        const data = await response.json();
        currentData = { role, ...data };
        displayResults(data);
        
    } catch (err) {
        showError(err.message || 'Failed to connect to backend. Make sure the Flask server is running.');
    } finally {
        hideLoading();
        generateBtn.disabled = false;
    }
}

function displayResults(data) {
    technicalQA.innerHTML = '';
    personalQA.innerHTML = '';

    data.technical.forEach((item, index) => {
        technicalQA.appendChild(createQAElement(index + 1, item));
    });

    data.personal.forEach((item, index) => {
        personalQA.appendChild(createQAElement(index + 1, item));
    });

    showResults();
}

function createQAElement(number, item) {
    const div = document.createElement('div');
    div.className = 'qa-item';
    div.innerHTML = `
        <div class="question">Q${number}: ${item.question}</div>
        <div class="answer"><strong>A:</strong> ${item.answer}</div>
    `;
    return div;
}

function copyToClipboard() {
    if (!currentData) return;

    let text = `Interview Q&A for: ${currentData.role}\n\n`;
    text += '='.repeat(50) + '\n';
    text += 'TECHNICAL QUESTIONS\n';
    text += '='.repeat(50) + '\n\n';

    currentData.technical.forEach((item, index) => {
        text += `Q${index + 1}: ${item.question}\n`;
        text += `A: ${item.answer}\n\n`;
    });

    text += '\n' + '='.repeat(50) + '\n';
    text += 'PERSONAL QUESTIONS\n';
    text += '='.repeat(50) + '\n\n';

    currentData.personal.forEach((item, index) => {
        text += `Q${index + 1}: ${item.question}\n`;
        text += `A: ${item.answer}\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}

function downloadPDF() {
    if (!currentData) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let y = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    doc.setFontSize(18);
    doc.text(`Interview Q&A: ${currentData.role}`, margin, y);
    y += 15;

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Questions', margin, y);
    y += 10;

    doc.setFontSize(10);
    currentData.technical.forEach((item, index) => {
        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }

        doc.setFont(undefined, 'bold');
        const question = `Q${index + 1}: ${item.question}`;
        const questionLines = doc.splitTextToSize(question, 170);
        doc.text(questionLines, margin, y);
        y += questionLines.length * lineHeight;

        doc.setFont(undefined, 'normal');
        const answer = `A: ${item.answer}`;
        const answerLines = doc.splitTextToSize(answer, 170);
        doc.text(answerLines, margin, y);
        y += answerLines.length * lineHeight + 5;
    });

    y += 10;
    if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Personal Questions', margin, y);
    y += 10;

    doc.setFontSize(10);
    currentData.personal.forEach((item, index) => {
        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }

        doc.setFont(undefined, 'bold');
        const question = `Q${index + 1}: ${item.question}`;
        const questionLines = doc.splitTextToSize(question, 170);
        doc.text(questionLines, margin, y);
        y += questionLines.length * lineHeight;

        doc.setFont(undefined, 'normal');
        const answer = `A: ${item.answer}`;
        const answerLines = doc.splitTextToSize(answer, 170);
        doc.text(answerLines, margin, y);
        y += answerLines.length * lineHeight + 5;
    });

    doc.save(`interview-qa-${currentData.role.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showResults() {
    results.classList.remove('hidden');
}

function hideResults() {
    results.classList.add('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}
