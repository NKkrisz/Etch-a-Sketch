//TODO: share and import drawing, touch compatibility
//Coloring, darkening, erasing or overriding squares' colors on mouse/touch-movement
document.addEventListener("mouseover", (e) => {sketching(e, "mouse")})
document.addEventListener("mousedown", (e) => {sketching(e, "mouse")})

function sketching(e, inputType) {
    let elementOver;
    if(inputType === "mouse"){
        //Only work when left mouse button (1) is held down
        if(e.buttons !== 1) return;
        elementOver = e.target;
    }

    if(elementOver.classList.contains("square")){
        if(rainbowToggle.checked){
            if(elementOver.classList.contains("colored") && !overrideToggle.checked) return;
            
            let r = Math.floor(Math.random() * 256)
            let g = Math.floor(Math.random() * 256)
            let b = Math.floor(Math.random() * 256)

            //Set opacity to get value of it later for darkening
            elementOver.style.backgroundColor = `rgba(${r},${g},${b}, ${0.99})`
            elementOver.classList.add("colored")
            return;
        }

        if(darkeningToggle.checked){
            //Get RGB and opacity values
            let colors = elementOver.style.backgroundColor.slice(5, elementOver.style.backgroundColor.length-1).split(", ")
            
            //Make it darker by making opacity smaller
            elementOver.style.backgroundColor = `rgba(${colors[0]},${colors[1]},${colors[2]},${colors[3] - 0.1})`
            elementOver.classList.add("colored")
            return;
        }

        if(eraserToggle.checked){
            //Set back color to default light-gray and make it colorable again if override isn't enabled
            elementOver.style.backgroundColor = "rgba(211, 211, 211, 0.99)"
            elementOver.classList.remove("colored")
            return;
        }

        //Default (dark-gray) pencil coloring mode
        if(elementOver.classList.contains("colored") && !overrideToggle.checked) return;
        elementOver.style.backgroundColor = currentPencilColor;
        elementOver.classList.add("colored")
    }
}

function hexToRGB(hex){
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.99)`;
}

//Disables conflicting toggles/modes
function disableConflictingToggles(toggleName, ...conflictingToggles){
    //Works with color chooser as well
    if(toggleName.checked || toggleName.id === "chooseColor") conflictingToggles.forEach((toggle) => {
        toggle.checked = false;
    })
}

const chooseColor = document.querySelector("#chooseColor");

//Default dark-gray coloring --> rgb(128, 128, 128)
chooseColor.value = "#808080"
let currentPencilColor = "rgba(128, 128, 128, 0.99)"

chooseColor.addEventListener("input", () => {
    currentPencilColor = hexToRGB(chooseColor.value);
    disableConflictingToggles(chooseColor, rainbowToggle, darkeningToggle, eraserToggle)
})

function backToDefaultPencilColor(){
    currentPencilColor = "rgba(128, 128, 128, 0.99)"
    chooseColor.value = "#808080"
}

const rainbowToggle = document.querySelector("#rainbowToggle");
const darkeningToggle = document.querySelector("#darkeningToggle");
const eraserToggle = document.querySelector("#eraserToggle");
const overrideToggle = document.querySelector("#overrideToggle");

rainbowToggle.addEventListener("click", () => {
    disableConflictingToggles(rainbowToggle, darkeningToggle, eraserToggle)
})

darkeningToggle.addEventListener("click", () => {
    disableConflictingToggles(darkeningToggle, rainbowToggle, eraserToggle)
})

eraserToggle.addEventListener("click", () => {
    disableConflictingToggles(eraserToggle, rainbowToggle, darkeningToggle, overrideToggle)
})

overrideToggle.addEventListener("click", () => {
    disableConflictingToggles(overrideToggle, eraserToggle)
})

//Grid creation
const drawingGrid = document.querySelector(".drawingGrid")

function newGrid(squareCount){

    //Limit input to 100 and below for performance limitations
    while(!(Number.isInteger(squareCount)) || squareCount > 100){
        squareCount = prompt("How many squares for a new grid? <100")
        //Cancel new grid creation if user inputs nothing or presses cancel/escape
        if(squareCount === null || squareCount === "") return;
        squareCount = parseInt(squareCount)
    }

    for(const oldSquare of document.querySelectorAll(".square")){
        oldSquare.remove()
    }

    const sideSize = `${100/squareCount}%`

    for(let i = 0; i < squareCount; i++){
        for(let j = 0; j < squareCount; j++){
            let square = document.createElement("div");
            square.classList.add("square")
            square.style.width = sideSize
            square.style.height = sideSize
            //Default light-gray
            square.style.backgroundColor = "rgba(211, 211, 211, 0.99)"
            drawingGrid.appendChild(square)
        }
    }
}

function clearGrid(){
    for(const oldSquare of document.querySelectorAll(".square")){
        oldSquare.style.backgroundColor = "rgba(211, 211, 211, 0.99)"
        oldSquare.classList.remove("colored")
    }
}

function copyGrid(){
    const squareCount = Math.floor(100 / (document.querySelector(".square").style.width).replace("%", ""))
    let bgColors = "";

    for(const square of document.querySelectorAll(".square")){
        bgColors += square.style.backgroundColor + ";"
    }

    navigator.clipboard.writeText(`${squareCount};${bgColors}`);
    alert("Saved grid to clipboard")
}

function pasteGrid(){
    const copyOfGrid = prompt("Paste grid here \nIf you see whitespace or not the full code don't worry")

    if(copyOfGrid === null){
        alert("Make sure you have copied the grid correctly!")
        return;
    }
    
    //Make copied data into an array for easier grid recreation
    arrayCopyOfGrid = copyOfGrid.split(";")
    
    const squareCount = arrayCopyOfGrid[0];

    for(const oldSquare of document.querySelectorAll(".square")){
        oldSquare.remove()
    }

    const sideSize = `${100/squareCount}%`
    
    let currentBg = 1;

    for(let i = 0; i < squareCount; i++){
        for(let j = 0; j < squareCount; j++){
            let square = document.createElement("div");
            square.classList.add("square")
            square.style.width = sideSize
            square.style.height = sideSize
            square.style.backgroundColor = arrayCopyOfGrid[currentBg]
            drawingGrid.appendChild(square)
            currentBg++;
        }
    }
}

newGrid(16)