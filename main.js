let goalCount = 1000;

let currentElement = null;
let wordCountElement = null;

let helloActive = true;
let downloadActive = false;

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

function setup() {
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
        }
        // If there is no current and no previous word
        else if (text.length === 1) {
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

    activateDownload()
}

function isCurrentOversize() {
    const top = currentElement.offsetTop;
    const left = currentElement.offsetLeft;
    const width = currentElement.offsetWidth;
    const height = currentElement.offsetHeight;

    return top < window.pageYOffset
        || (top + height) > (window.pageYOffset + window.innerHeight)
        || left < window.pageXOffset
        || (left + width) > (window.pageXOffset + window.innerWidth);
}

function resizeCurrent() {
    while (currentTextSize > 0 && isCurrentOversize()) {
        currentTextSize -= 1;
        currentElement.style.fontSize = currentTextSize + "px";
    }

    while (currentTextSize < initialTextSize && !isCurrentOversize()) {
        currentTextSize += 1;
        currentElement.style.fontSize = currentTextSize + "px";
    }
}

function download() {
    text.push(currentWhitespace.join("") + currentElement.innerText);
    window.open('data:application/octet-stream,' + encodeURIComponent(text.join("")), 'SAVE');
    text.pop();
}

function activateDownload() {
    if (!downloadActive && goalCount <= text.length) {
        downloadActive = true;
        document.getElementById("download").style.visibility = "initial";
    }
}