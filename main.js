// TODO: chrome backspace fix
// TODO: Tab?

let goalCount = 150;

let currentElement = null;
let wordCountElement = null;

let isStart = true;
let downloadActive = false;

let currentWhitespace = [];
let text = [];

let currentTextSize;
let initialTextSize;

function parseURLparameters() {
    let url = new URL(window.location.href);
    let goalParameter = url.searchParams.get("goalCount");
    goalCount = goalParameter ? goalParameter : goalCount;
}

function isWhitespace(code) {
    return code === 32 || code === 13;
}

function toWhitespace(code) {
    if (code === 13)
        code = 10;
    return String.fromCharCode(code);
}

function setup() {
    currentElement = document.getElementById("current");
    wordCountElement = document.getElementById("bar");

    currentTextSize = window.getComputedStyle(currentElement).fontSize;
    currentTextSize = Number.parseInt(currentTextSize.slice(0, 3));
    initialTextSize = currentTextSize;

    parseURLparameters();

    document.onkeypress = handle;
}

function handle(event) {
    if (isStart) {
        isStart = false;
        currentElement.innerText = "";
    }

    let chc = event.charCode;
    let key = event.key;

    if (isWhitespace(chc)) {
        if (/^\s*$/.test(currentElement.innerText)) {
            currentWhitespace.push(toWhitespace(chc));
        } else {
            newWord();
        }
    } else if (chc === 8) {
        let current = currentElement.innerText;

        if (current === "") {
            if (text.length === 0)
                return;
            current = text.pop();
        }

        currentElement.innerText = current.slice(0, -1);
    } else {
        currentElement.innerText += key;
    }

    downsizeToFit();
    upsizeToFit();
}

function newWord() {
    text.push(currentWhitespace.join("") + currentElement.innerText);
    currentWhitespace = [];

    updateProgressBar();
    activateDownload();

    currentElement.innerText = "";
    currentTextSize = initialTextSize;
    currentElement.style.fontSize = currentTextSize + "px";

    wordCountElement.innerText = text.length;
}

function updateProgressBar() {
    wordCountElement.innerText = text.length;
    let percentage = (100. * text.length) / goalCount;
    wordCountElement.style.width = percentage > 100 ? 100 : percentage + '%';
}

function bleeding() {
    const top = currentElement.offsetTop;
    const left = currentElement.offsetLeft;
    const width = currentElement.offsetWidth;
    const height = currentElement.offsetHeight;

    return top < window.pageYOffset
        || (top + height) > (window.pageYOffset + window.innerHeight)
        || left < window.pageXOffset
        || (left + width) > (window.pageXOffset + window.innerWidth);
}

function downsizeToFit() {
    while (currentTextSize > 0 && bleeding()) {
        currentTextSize -= 1;
        currentElement.style.fontSize = currentTextSize + "px";
    }
}

function upsizeToFit() {
    while (currentTextSize < initialTextSize && !bleeding()) {
        currentTextSize += 1;
        currentElement.style.fontSize = currentTextSize + "px";
    }
}

function download() {
    text.push(currentElement.innerText);
    window.open('data:application/octet-stream,' + text.join(""), 'SAVE')
    text.pop();
}

function activateDownload() {
    if (!downloadActive && goalCount <= text.length) {
        downloadActive = true;
        document.getElementById("download").style.visibility = "initial";
    }
}