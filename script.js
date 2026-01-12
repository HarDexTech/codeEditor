"use strict";
//get all required elements
const inputArea = document.getElementById("input");
const outputArea = document.getElementById("output");
const clearCode = document.getElementById("clear");
const copyCode = document.getElementById("copy");
const exportCode = document.getElementById("export");
const runCode = document.getElementById("run");
const saveToLocalHistory = document.getElementById("save");
const notificationMessages = document.getElementById("notificationMessages");
const themeBtn = document.getElementById("themeBtn");
const importCode = document.getElementById("import");

// event listener to save code to local storage
saveToLocalHistory.addEventListener("click", function () {
  localStorage.setItem("codeEditorHTML", inputArea.value); //save code to local storage
  showNotification("Code saved to local storage!");
});

// event listener to import code from local storage
importCode.addEventListener("click", function () {
  const savedCode = localStorage.getItem("codeEditorHTML"); //get saved code
  inputArea.value = savedCode ? savedCode : ""; //if no code saved, set to empty string
  showNotification("Code imported from local storage!"); //notify user
  runOnLoad(); //rerun code to show in output area
});

//function to toggle between light and dark themes
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}
themeBtn.addEventListener("click", toggleTheme);

// Function to set default HTML code in the textarea
function defCode() {
  // Set default HTML code in the textarea
  input.value = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!--Your HTML code goes here-->
</body>
</html>
`;
}
defCode(); //run on load

/*
function to show notification
shows notification div then removes it after 2 seconds
 */
function showNotification(message) {
  notificationMessages.textContent = message;
  notificationMessages.classList.remove("invisible");
  setTimeout(() => {
    notificationMessages.classList.add("invisible");
  }, 2000);
}

//function to copy code to clipboard
function copyCodeToClipBoard() {
  navigator.clipboard.writeText(input.value);
  showNotification("Code copied to clipboard!");
}
copyCode.addEventListener("click", copyCodeToClipBoard);

/*
uses confirm() to get if user wants to clear input
 */
function clearInputArea() {
  const validateConfirm = confirm(
    "Are you sure you want to clear all input area?"
  );
  if (validateConfirm) {
    defCode(); //return textarea to default code
    outputArea.srcdoc = ""; //clear output area
    showNotification("Input area cleared!");
  }
}
clearCode.addEventListener("click", clearInputArea);

//function to export code as HTML file
exportCode.addEventListener("click", function () {
  const textareaContent = inputArea.value;
  const filename = prompt("Please enter desired filename"); // Desired filename

  if (filename && filename.length !== 0) {
    // Create a Blob object from the textarea content, specifying the MIME type as HTML
    const blob = new Blob([textareaContent], { type: "text/html" });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // Set the download attribute with the desired filename

    // Append the anchor to the body (not strictly necessary for download, but good practice)
    document.body.appendChild(a);

    // Programmatically click the anchor to trigger the download
    a.click();

    // Clean up by revoking the object URL and removing the anchor
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification("File download initiated!");
  } else {
    showNotification("Filename cannot be empty!");
  }
});

/*
functionality to count characters and line count
runs function on page load and adds function to an input event listener
*/
function count() {
  const characterCount = input.value.length;
  const lineCount = input.value.split("\n").length;
  document.getElementById("countChar").innerHTML = `
    Character ${characterCount} | Line ${lineCount}
    `;
}
count();

// Debounce function to limit the rate of function execution
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Debounced version of the runOnLoad function
const debouncedRunOnLoad = debounce(runOnLoad, 300);

// Event listener for the input area
inputArea.addEventListener("input", function () {
  count(); //count characters and lines when typing
  debouncedRunOnLoad(); //run code while typing with debounce
});

// Event listener for the run button
runCode.addEventListener("click", function () {
  runOnLoad();
  showNotification("Code executed!");
});

// Function to run the code and display it in the output area
function runOnLoad() {
  //runs code in output area
  outputArea.srcdoc = inputArea.value;
}
runOnLoad(); //run on page load to show default code