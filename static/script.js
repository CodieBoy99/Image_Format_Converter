document.getElementById("convertBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("imageInput");
    const outputBox = document.getElementById("output");
    const selectedFormat = document.querySelector(".format-btn.active");
    const quality = document.getElementById("quality").value;

    if (!fileInput.files.length || !selectedFormat) {
        alert("Please select images and a format.");
        return;
    }

    const formData = new FormData();
    for (const file of fileInput.files) {
        formData.append("images", file);
    }
    formData.append("format", selectedFormat.dataset.format);
    formData.append("quality", quality);

    try {
        const response = await fetch("/convert", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Conversion failed");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        outputBox.innerHTML = `<a href="${url}" download="converted.${selectedFormat.dataset.format}">Download Converted Image</a>`;
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Drag & Drop Upload
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("imageInput");

dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragging");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragging");
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragging");
    fileInput.files = event.dataTransfer.files;
});

// Highlight selected format button
document.querySelectorAll(".format-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".format-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});