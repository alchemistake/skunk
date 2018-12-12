let goalCount = 1;

let currentElement = null;
let wordCountElement = null;

let helloActive = true;
let finishActive = false;

let currentWhitespace = [];
let text = [];

let currentTextSize;
let initialTextSize;

const whitespace =
    {
        9: "\t",
        13: "\n",
        32: " "
    };

const ignored =
    {
        16: "",
        17: "",
        18: "",
        20: "",
        27: "",
        37: "",
        38: "",
        39: "",
        40: "",
        91: "",
        93: "",
        112: "",
        113: "",
        114: "",
        115: "",
        116: "",
        117: "",
        118: "",
        119: "",
        120: "",
        121: "",
        122: "",
        123: "",
    };

function startWriting() {
    document.getElementById("writing").style.display = "block";

    // Delete entry div
    goalCount = document.getElementById("goalCount").value;
    document.getElementById("entry").remove();

    // Setting up element references.
    currentElement = document.getElementById("current");
    wordCountElement = document.getElementById("bar");

    // Getting text size
    currentTextSize = window.getComputedStyle(currentElement).fontSize;
    currentTextSize = Number.parseInt(currentTextSize.slice(0, 3));
    initialTextSize = currentTextSize;

    // Setting up listener
    document.onkeydown = onKeyDown;
}

function onKeyDown(event) {
    // "Hello!" handler
    if (helloActive) {
        helloActive = false;
        currentElement.innerText = "";
    }

    let charCode = event.which;

    // Whitespace handler
    if (whitespace[charCode] !== undefined) {
        // The current is not empty go to new word.
        if (currentElement.innerText !== "") {
            newWord()
        }

        currentWhitespace.push(whitespace[charCode]);
    }
    // Backspace Handler
    else if (charCode === 8) {
        let current = currentElement.innerText;

        // If there is no current and previous word
        if (current === "" && text.length > 1) {
            current = text.pop();
            currentWhitespace = [];

            currentWhitespace.push(current.slice(0, whitespaceIndex(current)));
            current = current.trim()
        }

        // If there is no current and no previous word
        else if (current === "" && text.length === 1) {
            text.length = 0;
            current = "";
        }
        // Delete 1 Char from current
        else {
            current = current.slice(0, -1);
        }

        currentElement.innerText = current;
        updateProgressBar();
    }
    // Text input handler
    else if (ignored[charCode] === undefined) {
        if (text.length === 0) {
            text.length = 1;
        }
        updateProgressBar();
        currentElement.innerText += event.key;
    }

    resizeCurrent();
}

function newWord() {
    text.push(currentWhitespace.join("") + currentElement.innerText);
    currentWhitespace = [];

    currentElement.innerText = "";
    currentTextSize = initialTextSize;
    currentElement.style.fontSize = currentTextSize + "px";
}

function updateProgressBar() {
    wordCountElement.innerText = text.length;
    let percentage = (100. * text.length) / goalCount;
    wordCountElement.style.width = percentage > 100 ? 100 : percentage + '%';

    activateFinish()
}

function resizeCurrent() {
    let elementWidth = currentElement.offsetWidth;
    let windowWidth = window.innerWidth;
    let widthBound = Math.floor(windowWidth * currentTextSize / elementWidth);

    currentTextSize = Math.min(widthBound, initialTextSize);
    currentElement.style.fontSize = currentTextSize + "px";
}

function download() {
    let hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(document.getElementById("editor").innerText);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'skunk.txt';
    hiddenElement.click();
}

function finish() {
    document.getElementById("download").style.visibility = "initial";

    document.getElementById("writing").remove();
    let editor = document.createElement("div");
    editor.className = "full-size";
    editor.id = "editor";
    editor.contentEditable = true;

    text.push(currentWhitespace.join("") + currentElement.innerText);
    editor.innerText = text.join("");
    document.body.append(editor);
}

function whitespaceIndex(string) {
    for (let i = 0; i < string.length; i++) {
        if (!/\s/.test(string.charAt(i)))
            return i;
    }
}

function activateFinish() {
    if (!finishActive && goalCount <= text.length) {
        finishActive = true;
        document.getElementById("finish").style.visibility = "initial";
    }
}