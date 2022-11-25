const input = document.querySelector("input");
const days = document.querySelectorAll(".day");
const overlayButtons = document.querySelectorAll(".overlay");
const resetButton = document.querySelector(".reset-btn");
const userHistory = JSON.parse(localStorage.getItem("userHistory")) || newLocalStorage();

function revealTile(tile){
    tile.classList.toggle("revealed");

    const date = tile.parentElement.id;
    const selectedTile = userHistory.find(element => element.date === date);
    if (selectedTile.revealed === false) selectedTile.revealed = true;
    else selectedTile.revealed = false;
    updateLocalStorage();
}

function resetAllTiles(){
    overlayButtons.forEach(button => {
        button.classList.remove("revealed");
    })

    userHistory.forEach(item => item.revealed = false);
    updateLocalStorage();
}

function newLocalStorage(){
    const localStorage = [];
    days.forEach(day => {
        const date = day.id;
        const revealed = false;
        const entry = {date, revealed}
        localStorage.push(entry)
    })
    return localStorage
}

function updateLocalStorage(){
    localStorage.setItem("userHistory", JSON.stringify(userHistory))
}

function restoreLastSession(){
    userHistory.forEach(item => {
        if (item.revealed){
            const tileToReveal = document.getElementById(item.date).querySelector(".overlay")
            tileToReveal.classList.add("revealed")
        }
    })
}

document.addEventListener("DOMContentLoaded", restoreLastSession);

overlayButtons.forEach(button => button.addEventListener("click", (event) => {
    revealTile(event.target);
}))
resetButton.addEventListener("click", resetAllTiles);