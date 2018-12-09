let goalCount = 5;

let currentElement = null;
let wordCountElement = null;

let isStart = true;
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

function parseURLparameters() {
    let url = new URL(window.location.href);
    let goalParameter = url.searchParams.get("goalCount");
    goalCount = goalParameter ? goalParameter : goalCount;
}

function setup() {
    currentElement = document.getElementById("current");
    wordCountElement = document.getElementById("bar");

    currentTextSize = window.getComputedStyle(currentElement).fontSize;
    currentTextSize = Number.parseInt(currentTextSize.slice(0, 3));
    initialTextSize = currentTextSize;

    parseURLparameters();

    document.onkeydown = handle;
}

function handle(event) {
    if (isStart) {
        isStart = false;
        currentElement.innerText = "";
        text.length = 1;
    }

    let chc = event.which;
    let key = event.key;

    if (whitespace[chc] !== undefined) {
        if (!/^\s*$/.test(currentElement.innerText)) {
            newWord()
        }

        currentWhitespace.push(whitespace[chc]);
    } else if (chc === 8) {
        let current = currentElement.innerText;

        if (current === "") {
            if (text.length === 0)
                return;
            current = text.pop();
        }

        currentElement.innerText = current.slice(0, -1);
    } else if (ignored[chc] !== "") {
        updateProgressBar();
        currentElement.innerText += key;
    }

    downsizeToFit();
    upsizeToFit();
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
    text.push(currentWhitespace.join("") + currentElement.innerText);
    window.open('data:application/octet-stream,' + encodeURIComponent(text.join("")), 'SAVE')
    text.pop();
}

function activateDownload() {
    if (!downloadActive && goalCount <= text.length) {
        downloadActive = true;
        document.getElementById("download").style.visibility = "initial";
    }
}