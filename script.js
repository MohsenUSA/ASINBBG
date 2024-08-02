let inputValues = [];
let selectedType = 'barcode';
let generatedCodes = [];

function handleInputChange() {
    const value = document.getElementById('inputField').value;
    const matches = value.match(/\bB[A-Z0-9]{9}\b/g); // Only match uppercase B followed by 9 alphanumeric characters
    if (matches) {
        inputValues = [...new Set(matches)]; // Remove duplicates
        document.getElementById('inputField').value = inputValues.join(' '); // Display ASINs separated by spaces
    } else {
        inputValues = [];
        document.getElementById('inputField').value = ''; // Clear the textarea if no ASINs are found
    }
    if (value.trim() === '') {
        generatedCodes = [];
        renderGeneratedCodes();
    }
}

function handleTypeChange() {
    selectedType = document.getElementById('typeSelect').value;
}

function handleGenerate() {
    if (inputValues.length > 0) {
        generatedCodes = inputValues.map((value, index) => {
            return { value, type: selectedType, index: index + 1 };
        });
        renderGeneratedCodes();
    } else {
        generatedCodes = [];
        renderGeneratedCodes();
    }
}

function handleClear() {
    inputValues = [];
    generatedCodes = [];
    document.getElementById('inputField').value = '';
    document.getElementById('inputField').focus(); // Set focus to the input field
    renderGeneratedCodes();
}

function renderGeneratedCodes() {
    const container = document.getElementById('generatedCodes');
    container.innerHTML = '';
    generatedCodes.forEach((code, index) => {
        const div = document.createElement('div');
        div.className = 'border';
        div.innerHTML = `<p style="text-align: center; margin: 0;">${code.index}</p><br/><br/>`;
        if (code.type === 'barcode') {
            const canvas = document.createElement('canvas');
            canvas.className = 'canvas-center';
            JsBarcode(canvas, code.value, { width: 2, height: 50, background: 'white' });
            div.appendChild(canvas);
        } else if (code.type === 'qr') {
            const qr = document.createElement('canvas');
            qr.className = 'canvas-center';
            const qrCode = new QRious({ element: qr, value: code.value, size: 128 });
            div.appendChild(qr);
            const text = document.createElement('p');
            text.innerText = code.value;
            text.style.textAlign = 'center';
            text.style.color = 'black';
            div.appendChild(text);
        }
        container.appendChild(div);
    });
}

// Event listener for pasting
document.getElementById('inputField').addEventListener('paste', function(event) {
    event.preventDefault();
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    document.getElementById('inputField').value = paste;
    handleInputChange();
});

// Event listeners for input and change to handle other input methods
document.getElementById('inputField').addEventListener('input', handleInputChange);
document.getElementById('inputField').addEventListener('change', handleInputChange);
