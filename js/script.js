const BRUSH_TIME = 1500;
const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");

const body = document.querySelector("body");

const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");

let currentSize = 10;

let bucketColor = "#ffffff";
let currentColor = "#A51DAB";
let isEraser = false;
let isMouseDown = false;
let drawArray = [];

//Show Brush size
function displayBrushSize(){
    if(brushSlider.value < 10){
        brushSize.textContent = `0${brushSlider.value}`;
    }else{
        brushSize.textContent = brushSlider.value;
    }
}

/* Setting brush size */
brushSlider.addEventListener("change",() =>{
    currentSize = brushSlider.value;
    displayBrushSize();
});

/* Setting brush color */
brushColorBtn.addEventListener("change",() =>{
    isEraser = false;
    currentColor = `#${brushColorBtn.value}`;
});

let previousColor = currentColor;
let previousSize = currentSize;

/* Setting brush color */
brushColorBtn.addEventListener("change", () => {
    if (!isEraser) {
        previousColor = currentColor; // Store previous color
        currentColor = `#${brushColorBtn.value}`;
    }
});

/* Setting eraser */
eraser.addEventListener("click", () => {
    isEraser = !isEraser; // Toggle eraser state

    if (isEraser) {
        previousColor = currentColor; // Store previous color
        previousSize = currentSize; // Store previous size
        brushIcon.style.color = "white";
        eraser.style.color = "black";
        canvas.style.cursor = 'url("https://assets.dryicons.com/uploads/icon/svg/2338/remove_link.svg") 30 30, auto';
        activeToolEl.textContent = "Eraser";
        currentColor = bucketColor;
        currentSize = 50;
    } else {
        brushIcon.style.color = "black";
        eraser.style.color = "white";
        canvas.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"><path fill=\"%23000000\" d=\"M4.5 2.5l-3 3 1 1 3-3-1-1zm7.5-2.5h-2c-.1 0-.1 0-.2.1l-8.5 8.5c-.1.1-.1.1-.1.2v2c0 1.1.9 2 2 2h2c.1 0 .1 0 .2-.1l8.5-8.5c.1-.1.1-.1.1-.2v-2c0-1.1-.9-2-2-2zM4.85 8.15l-1.15 1.15 6 6 1.15-1.15-6-6z\"/></svg>'), auto";
        activeToolEl.textContent = "Brush";
        currentColor = previousColor; // Restore previous color
        currentSize = previousSize; // Restore previous size
        brushSlider.value = previousSize;
        displayBrushSize();
    }
});

/* Setting brush */
brushIcon.addEventListener("click", () => {
    switchToBrush();
    previousColor = currentColor; // Update previous color when switching to brush
    previousSize = currentSize; // Update previous size when switching to brush
    currentColor = `#${brushColorBtn.value}`; // Update to use brushColorBtn
    displayBrushSize();
});

// switch to brush
function switchToBrush(){
    isEraser = false;
    brushIcon.style.color = "black";
    eraser.style.color = "white";
    canvas.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"><path fill=\"%23000000\" d=\"M4.5 2.5l-3 3 1 1 3-3-1-1zm7.5-2.5h-2c-.1 0-.1 0-.2.1l-8.5 8.5c-.1.1-.1.1-.1.2v2c0 1.1.9 2 2 2h2c.1 0 .1 0 .2-.1l8.5-8.5c.1-.1.1-.1.1-.2v-2c0-1.1-.9-2-2-2zM4.85 8.15l-1.15 1.15 6 6 1.15-1.15-6-6z\"/></svg>'), auto";
    activeToolEl.textContent = "Brush";
    currentColor = `#${brushColorBtn.value}`;
    currentSize = 10;
    brushSlider.value = 10;
    displayBrushSize();
}

function brushTimeSetTimeout(ms){
    setTimeout(switchToBrush, ms);
}

//draw what is stored in drawnArray
function restoreCanvas(){
    for(let i = 1; i < drawArray.length; i++){
        context.beginPath();
        context.moveTo(drawArray[i-1].x, drawArray[i-1].y);
        context.lineWidth = drawArray[i].size;
        context.lineCap = 'round';
        if(drawArray[i].eraser){
            context.strokeStyle = bucketColor;
        }else{
            context.strokeStyle = drawArray[i].color;
        }
        context.lineTo(drawArray[i].x,drawArray[i].y);
        context.stroke();
    }
}

// store drawing lines in drawnArray
function storeDrawn(x, y, size, color, erase){
    const line = {
        x,
        y,
        size,
        color,
        erase,
    };
    console.log(line);
    drawArray.push(line);
}

//get mouse position
function getMousePosition(event){
    const boundaries = canvas.getBoundingClientRect();
    return{
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top,
    };
}

// mouse down
canvas.addEventListener("mousedown",(event)=>{
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    context.moveTo(currentPosition.x,currentPosition.y);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
});

//mouse move
canvas.addEventListener("mousemove",(event) =>{
    if(isMouseDown){
        const currentPosition = getMousePosition(event);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentSize,
            currentColor,
            isEraser,
        );
    }else{
        storeDrawn(undefined);
    }
});

//mouse up
canvas.addEventListener("mouseup",()=>{
    isMouseDown = false;
});


// download image
downloadBtn.addEventListener("click",()=>{
    downloadBtn.href = canvas.toDataURL("image/jpeg",1);
    downloadBtn.download = "Draw-example.jpeg";
    activeToolEl.textContent = "Image file saved";
    brushTimeSetTimeout(BRUSH_TIME);
});

function createCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    context.fillStyle = bucketColor;
    context.fillRect(0, 0, canvas.width,canvas.height);
    body.appendChild(canvas);
    switchToBrush();
}

// clear canvas
clearCanvasBtn.addEventListener("click",()=>{
    createCanvas();
    drawArray = [];
    activeToolEl.textContent = "Canvas cleared";
    brushTimeSetTimeout(BRUSH_TIME);
});

createCanvas();

// Touch events
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const currentPosition = getTouchPosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const currentPosition = getTouchPosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
        currentPosition.x,
        currentPosition.y,
        currentSize,
        currentColor,
        isEraser,
    );
});

canvas.addEventListener("touchend", (event) => {
    event.preventDefault();
    isMouseDown = false;
});

function getTouchPosition(touchEvent) {
    const boundaries = canvas.getBoundingClientRect();
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    return {
        x: touch.clientX - boundaries.left,
        y: touch.clientY - boundaries.top,
    };
}
