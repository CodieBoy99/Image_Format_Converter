const convertBtn = document.getElementById("convertBtn");
const spinner = convertBtn.querySelector(".spinner");
const btnText = convertBtn.querySelector(".btn-text");

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

  convertBtn.disabled = true;
  spinner.classList.remove("hidden");
  btnText.textContent = "Converting...";

  try {
    const response = await fetch("/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Conversion failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    outputBox.innerHTML = `<a href="${url}" download="converted.${selectedFormat.dataset.format}" class="download-link">Download Converted Image</a>`;
  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    convertBtn.disabled = false;
    spinner.classList.add("hidden");
    btnText.textContent = "Convert";
  }
});

// Format buttons
document.querySelectorAll(".format-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".format-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Drag & drop
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("imageInput");

dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragging");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragging");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  dropArea.classList.remove("dragging");
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
});
