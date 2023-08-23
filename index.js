//TODO: Color picker, erase board, share drawing, touch compatibility
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

        //Default dark-gray coloring mode
        if(elementOver.classList.contains("colored") && !overrideToggle.checked) return;
        elementOver.style.backgroundColor = "rgba(128, 128, 128, 0.99)"
        elementOver.classList.add("colored")
    }
}

//Disables conflicting toggles/modes
function disableConflictingToggles(toggleName, ...conflictingToggles){
    if(toggleName.checked) conflictingToggles.forEach((toggle) => {
        toggle.checked = false;
    })
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
        squareCount = parseInt(prompt("How many squares for a new grid? <100"))
    }

    for(const oldSquare of document.querySelectorAll(".square")){
        oldSquare.remove()
    }

    let sideSize = `${100/squareCount}%`

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

function shareGrid(){
    alert("Function still in works...")
}

newGrid(16)