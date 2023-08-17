const container = document.querySelector(".container")

function createGrid(squareCount){
    for(let i = 0; i < squareCount; i++){
        let square = document.createElement("div");
        square.classList.add("square")
        container.appendChild(square)
    }
}

function newGrid(){
    let squareCount = prompt("How many squares for a new grid?")

    for(const square of document.querySelectorAll(".square")){
        square.remove()
    }

    createGrid(squareCount)
}

createGrid(16)