const input = document.querySelector("input");
const days = document.querySelectorAll(".day");
const overlayButtons = document.querySelectorAll(".overlay");
const resetButton = document.querySelector(".reset-btn");
const userHistory = {};

function revealTile(tile){
    tile.classList.toggle("revealed");
}

function resetAllTiles(){
    overlayButtons.forEach(button => {
        button.classList.remove("revealed")
    })
}

overlayButtons.forEach(button => button.addEventListener("click", (event) => {
    revealTile(event.target);
}))
resetButton.addEventListener("click", resetAllTiles)