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

function checkDate(today, selectedDay){
    today = new Date(today);
    dayClicked = new Date(selectedDay.parentElement.id);

    if (today > dayClicked || today.getTime() === dayClicked.getTime()){
        revealTile(selectedDay);
    }
    else if (today < dayClicked){
        createModal("It's too early to open this one!")
    }
    else createModal("Please select a date first!")
}

function createModal(message){
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalContentText = document.createElement("p");
    modalContentText.classList.add("modal-content-text")
    modalContentText.textContent = message;
    modalContent.appendChild(modalContentText);

    const modalContentButton = document.createElement("button");
    modalContentButton.classList.add("modal-content-button");
    modalContentButton.textContent = "Ok!";
    modalContentButton.addEventListener("click", closeModal);
    modalContent.appendChild(modalContentButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);


    input.tabIndex = "-1";
    overlayButtons.forEach(button => button.tabIndex = "-1");
    resetButton.tabIndex = "-1";
}

function closeModal(){
    const modal = document.querySelector(".modal");
    modal.remove();

    input.tabIndex = "0";
    overlayButtons.forEach(button => button.tabIndex = "0");
    resetButton.tabIndex = "0";
}

document.addEventListener("DOMContentLoaded", restoreLastSession);

overlayButtons.forEach(button => button.addEventListener("click", (event) => {
    checkDate(input.value, event.target);
}))
resetButton.addEventListener("click", resetAllTiles);