document.addEventListener("DOMContentLoaded", function () {
  // Recupero degli elementi del DOM
  const textArea = document.getElementById("notepad");
  const newFileBtn = document.getElementById("newFile");
  const openFileBtn = document.getElementById("openFile");
  const saveFileBtn = document.getElementById("saveFile");
  const saveAsFileBtn = document.getElementById("saveAsFile");
  const fontFamilySelect = document.getElementById("fontFamily");
  const fontSizeSelect = document.getElementById("fontSize");
  const fontColorInput = document.getElementById("fontColor");
  const hiddenFileInput = document.getElementById("hiddenFileInput");

  // Variabile per tenere traccia del nome del file corrente
  let currentFileName = null;

  // ==========================================================
  // Funzione: Aggiornamento Dinamico dello Stile del Testo
  // ==========================================================
  function updateTextStyle() {
    textArea.style.fontFamily = fontFamilySelect.value;
    textArea.style.fontSize = fontSizeSelect.value;
    textArea.style.color = fontColorInput.value;
  }
  // Eventi per la toolbar
  fontFamilySelect.addEventListener("change", updateTextStyle);
  fontSizeSelect.addEventListener("change", updateTextStyle);
  fontColorInput.addEventListener("change", updateTextStyle);
  // Inizializza lo stile
  updateTextStyle();

  // ==========================================================
  // Funzioni di Gestione File
  // ==========================================================

  // New Note: Pulisce l'editor dopo una conferma e resetta currentFileName.
  newFileBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to create a new note? Unsaved changes will be lost.")) {
      textArea.value = "";
      currentFileName = null;
    }
  });

  // Open Note: Utilizzo dell'input file nascosto.
  openFileBtn.addEventListener("click", function () {
    hiddenFileInput.value = ""; // Ripulire la selezione precedente
    hiddenFileInput.click();
  });

  // Gestione del file input: Legge il file e carica il contenuto.
  hiddenFileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      textArea.value = evt.target.result;
      currentFileName = file.name;
    };
    reader.onerror = function () {
      alert("Error reading file.");
    };
    reader.readAsText(file);
  });

  // Funzione helper: Forza il download del contenuto nel file.
  function downloadTextFile(fileName) {
    const content = textArea.value;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      document.body.removeChild(downloadLink);
    }, 100);
  }

  // Save Note: Se currentFileName è definito, salva; altrimenti usa Save As.
  saveFileBtn.addEventListener("click", function () {
    if (currentFileName) {
      downloadTextFile(currentFileName);
    } else {
      saveAsFunction();
    }
  });

  // Save As: Chiede un nome file all'utente e salva il file.
  saveAsFileBtn.addEventListener("click", function () {
    saveAsFunction();
  });

  function saveAsFunction() {
    const defaultName = currentFileName ? currentFileName : "note.txt";
    let fileName = prompt("Enter the file name to save (include extension, e.g., note.txt):", defaultName);
    if (fileName && fileName.trim() !== "") {
      currentFileName = fileName.trim();
      downloadTextFile(currentFileName);
    } else {
      alert("Invalid file name. Please try again.");
    }
  }

  console.log("Notepad‑JS initialized successfully.");
});
