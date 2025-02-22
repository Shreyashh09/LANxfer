document.addEventListener("DOMContentLoaded", function () {
    fetchFiles();
});

function fetchFiles() {
    fetch("/get_files") // Fetch file list from Flask backend
        .then(response => response.json())
        .then(files => {
            console.log("Fetched files:", files); // Debugging
            populateFileTable(files);
        })
        .catch(error => console.error("Error fetching files:", error));
}

function populateFileTable(files) {
    const tableBody = document.querySelector("#fileTable tbody");
    tableBody.innerHTML = "";

    if (files.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='3'>No files found</td></tr>";
        return;
    }

    files.forEach((file, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${file}</td>
            <td><a href="/uploads/${file}" download>📥 Download</a></td>
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
    .then(response => response.text())
    .then(result => {
        alert(result);
        fetchFiles(); // Refresh the file list
    })
    .catch(error => console.error("Error uploading file:", error));
}
