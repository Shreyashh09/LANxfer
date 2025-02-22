// Global variables for sorting
let currentSort = {
    column: 'name',
    direction: 'asc'
};

document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectedFileDiv = document.getElementById('selectedFile');
    
    // File input change handler
    fileInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files[0]);
    });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    // Add click handlers for sortable headers
    document.querySelectorAll('th.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            
            // Update sort direction
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }
            
            // Update header classes
            document.querySelectorAll('th.sortable').forEach(th => {
                th.classList.remove('asc', 'desc');
            });
            header.classList.add(currentSort.direction);

            // Fetch files with new sort parameters
            fetchFiles();
        });
    });

    // Initial file fetch
    fetchFiles();
});

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    document.getElementById('dropZone').classList.add('drag-over');
}

function unhighlight(e) {
    document.getElementById('dropZone').classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    handleFileSelect(file);
}

function handleFileSelect(file) {
    if (file) {
        // Create a new FileList object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        // Set the file input's files
        const fileInput = document.getElementById('fileInput');
        fileInput.files = dataTransfer.files;
        
        // Update UI
        const selectedFileDiv = document.getElementById('selectedFile');
        selectedFileDiv.style.display = 'block';
        selectedFileDiv.textContent = `Selected: ${file.name}`;
    }
}

function fetchFiles() {
    // Build the query string with sort parameters
    const queryParams = new URLSearchParams({
        sort: currentSort.column,
        order: currentSort.direction
    });

    fetch(`/get_files?${queryParams}`)
        .then(response => response.json())
        .then(files => {
            populateFileTable(files);
        })
        .catch(error => {
            console.error("Error fetching files:", error);
            // Show error in table
            const tableBody = document.querySelector("#fileTable tbody");
            tableBody.innerHTML = `<tr><td colspan="5">Error loading files: ${error.message}</td></tr>`;
        });
}

function populateFileTable(files) {
    const tableBody = document.querySelector("#fileTable tbody");
    tableBody.innerHTML = "";

    if (!Array.isArray(files) || files.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No files found</td></tr>";
        return;
    }

    files.forEach((file, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${file.name}</td>
            <td>${file.size_fmt}</td>
            <td>${file.modified_fmt}</td>
            <td><a href="/uploads/${file.name}" download>📥 Download</a></td>
        `;
        tableBody.appendChild(row);
    });
}

function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())  // Changed from text() to json()
    .then(result => {
        if (result.error) {
            throw new Error(result.error);
        }
        alert(result.message || "File uploaded successfully!");
        fetchFiles();
        // Reset the upload interface
        document.getElementById('selectedFile').style.display = 'none';
        fileInput.value = '';
    })
    .catch(error => {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + error.message);
    });
}

// Matrix background animation
// const canvas = document.getElementById('matrixBackground');
// const ctx = canvas.getContext('2d');

// // Set canvas size
// function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }

// // Initial resize
// resizeCanvas();

// // Resize canvas when window is resized
// window.addEventListener('resize', resizeCanvas);

// // Characters to use in the animation
// const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const charArray = chars.split('');
// const fontSize = 14;
// const columns = Math.floor(canvas.width / fontSize);

// // Array to track y position of each column
// const drops = [];
// for (let i = 0; i < columns; i++) {
//     drops[i] = 1;
// }

// // Drawing function
// function draw() {
//     // Semi-transparent black background to create fade effect
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Green text
//     ctx.fillStyle = '#33ff33';
//     ctx.font = `${fontSize}px monospace`;

//     // Loop over drops
//     for (let i = 0; i < drops.length; i++) {
//         // Random character
//         const char = charArray[Math.floor(Math.random() * charArray.length)];
//         // Draw character
//         ctx.fillText(char, i * fontSize, drops[i] * fontSize);

//         // Reset drop if it reaches bottom or randomly
//         if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
//             drops[i] = 0;
//         }

//         // Move drop
//         drops[i]++;
//     }
// }

// // Animation loop
// setInterval(draw, 33);