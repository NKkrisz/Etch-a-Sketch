//TODO: ERASER MODE
//Optimized way of coloring the squares and rainbow mode randomization
document.addEventListener("mouseover", (e) => {
    if(e.target.classList.contains("square")){
        if(rainbowToggle.checked){
            if(e.target.classList.contains("colored") && !overrideToggle.checked) return;
            let r = Math.floor(Math.random() * 256)
            let g = Math.floor(Math.random() * 256)
            let b = Math.floor(Math.random() * 256)
            //Set opacity to get value of it later for darkening
            e.target.style.backgroundColor = `rgba(${r},${g},${b}, ${0.99})`
            e.target.classList.add("colored")
            return;
        }

        if(darkeningToggle.checked){
            //Get RGB and opacity values
            let colors = e.target.style.backgroundColor.slice(5, e.target.style.backgroundColor.length-1).split(", ")
            //Make it darker
            e.target.style.backgroundColor = `rgba(${colors[0]},${colors[1]},${colors[2]},${colors[3] - 0.1})`
            e.target.classList.add("colored")
            return;
        }
        //Default gray coloring
        if(e.target.classList.contains("colored") && !overrideToggle.checked) return;
        e.target.style.backgroundColor = "rgba(128, 128, 128, 0.99)"
        e.target.classList.add("colored")
    }
})

//Disables conflicting checkbox and mode
function disableConflictingToggle(otherCheckbox){
    if(otherCheckbox.checked) otherCheckbox.checked = false
}

const rainbowToggle = document.querySelector("#rainbowToggle");
rainbowToggle.addEventListener("click", () => {
    if(rainbowToggle.checked) disableConflictingToggle(darkeningToggle)
})

const darkeningToggle = document.querySelector("#darkeningToggle");
darkeningToggle.addEventListener("click", () => {
    if(darkeningToggle.checked) disableConflictingToggle(rainbowToggle)
})

const overrideToggle = document.querySelector("#overrideToggle");

//Grid creation
const drawingBoard = document.querySelector(".drawingBoard")

function createGrid(squareCount){
    let sideSize = `${100/squareCount}%`

    for(let i = 0; i < squareCount; i++){
        for(let j = 0; j < squareCount; j++){
            let square = document.createElement("div");
            square.classList.add("square")
            square.style.width = sideSize
            square.style.height = sideSize
            square.style.backgroundColor = "rgba(211, 211, 211, 0.99)"
            drawingBoard.appendChild(square)
        }
    }
}

function newGrid(){
    let squareCount = "";
    //Limit input to 100 and below for performance reasons
    while(!(Number.isInteger(squareCount)) || squareCount > 100){
        squareCount = parseInt(prompt("How many squares for a new grid? <100"))
    }

    for(const square of document.querySelectorAll(".square")){
        square.remove()
    }

    createGrid(squareCount)
}

createGrid(16)