async function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        let response = await fetch("/upload", { method: "POST", body: formData });
        let result = await response.text();
        console.log("Server Response:", result);
    } catch (error) {
        console.error("Upload failed:", error);
    }
    loadFiles();  // Refresh file list
}


async function loadFiles() {
    let response = await fetch("/files");
    let data = await response.json();
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    data.files.forEach(file => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<a href="/download/${file}" download>${file}</a>`;
        fileList.appendChild(listItem);
    });
}

window.onload = loadFiles;  // Load files when page loads

