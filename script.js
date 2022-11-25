const input = document.querySelector("input");
const days = document.querySelectorAll(".day");
const overlayButtons = document.querySelectorAll(".overlay");
const resetButton = document.querySelector(".reset-btn");
const userHistory = JSON.parse(localStorage.getItem("userHistory")) || newLocalStorage();

// <========== Function reveals the hidden image or video ==========>
function revealTile(tile){
    // toggles the .revealed class which triggers the overlay animation
    tile.classList.toggle("revealed");

    // update local storage track whether a tile is revealed or not
    // get the id of the day clicked on through the parent day.div's id name 
    const date = tile.parentElement.id;
    // use the id to find the same date in the userHistory array
    const selectedTile = userHistory.find(element => element.date === date);
    // toggle the element's revealed status from true to false or false to true
    if (selectedTile.revealed === false) selectedTile.revealed = true;
    else selectedTile.revealed = false;
    // call updateLocalStorage() to replace the current local storage with the updated UserHistory array
    updateLocalStorage();

    // call handleVideo() deal with videos
    handleVideo(tile);
}


// <========== Function plays videos ==========>
function handleVideo(tile){
    // get the closest div.media
    mediaContainer = tile.nextElementSibling;
    // check if the media is video or image through data attribute
    mediaType = mediaContainer.dataset.media;

    // if video, play video/pause video depending on revealed status
    if (mediaType === "video" ){
        const video = mediaContainer.querySelector("video");
        if (tile.classList.contains("revealed")) video.play();
        else video.pause();
    } 
}


// <========== Function closes all tiles on the page ==========>
function resetAllTiles(){
    // loop through the each tile and remove .revealed to make overlay cover image/video
    overlayButtons.forEach(button => {
        button.classList.remove("revealed");
    })

    // update local storage because every tile is now closed
    userHistory.forEach(item => item.revealed = false);
    updateLocalStorage();

    // stop any currently playing videos and put the timer back to the start
    const videos = document.querySelectorAll("video");
    videos.forEach(video => {
        video.load();
        video.currentTime = 0;
    })
}


// <========== Function creates an array to be used for local storage purposes ==========>
function newLocalStorage(){
    // create empty array;
    const localStorage = [];
    // loop through each tile and get each one's id; set the revealed key to false and push into array
    days.forEach(day => {
        const date = day.id;
        const revealed = false;
        const entry = {date, revealed}
        localStorage.push(entry)
    })
    // returns the array that can be used to keep track of each tile
    return localStorage
}

// <========== Function stores userHistory array into local storage to keep it updated ==========>
function updateLocalStorage(){
    localStorage.setItem("userHistory", JSON.stringify(userHistory))
}

// <========== Function stores userHistory array into local storage to keep it updated ==========>
function restoreLastSession(){
    // loops through the userHistory array (stored in local storage) and reveals every tile that was revealed last time user used app
    userHistory.forEach(item => {
        if (item.revealed){
            const tileToReveal = document.getElementById(item.date).querySelector(".overlay")
            tileToReveal.classList.add("revealed")
        }
    })
}

// <====== Function to make sure user can only open dates earlier or equal to today's date ======>
function checkDate(today, selectedDay){
    // convert the date input into a date object
    today = new Date(today);
    // get the date user clicked on through the id an convert into date object
    dayClicked = new Date(selectedDay.parentElement.id);

    // Compares the date user clicked on with today's date to decide what happens
    // if today's date is later or the same as the day user clicked on, reveal tile
    // if today's date is before the day clicked on, create a pop up message
    // if user has not selected a date, create a pop up message
    if (today > dayClicked || today.getTime() === dayClicked.getTime()){
        revealTile(selectedDay);
    }
    else if (today < dayClicked){
        createModal("It's too early to open this one!")
    }
    else createModal("Please select a date first!")
}


// <========== Function creates a pop up box with customizable message ==========>
function createModal(message){
    // create modal container that covers entire screen
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // create modal content container which is the pop up box user sees
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // add message to content container;
    const modalContentText = document.createElement("p");
    modalContentText.classList.add("modal-content-text")
    modalContentText.textContent = message;
    modalContent.appendChild(modalContentText);

    // add button to close modal to content container
    const modalContentButton = document.createElement("button");
    modalContentButton.classList.add("modal-content-button");
    modalContentButton.textContent = "Ok!";
    modalContentButton.addEventListener("click", closeModal);
    modalContent.appendChild(modalContentButton);

    // append to page
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // set tab indexes to -1 so users can't focus on anything other than close button
    input.tabIndex = "-1";
    overlayButtons.forEach(button => button.tabIndex = "-1");
    resetButton.tabIndex = "-1";
    const videos = document.querySelectorAll("video");
    videos.forEach(video => video.tabIndex = "-1");
}


// <========== Function creates a pop up box with customizable message ==========>
function closeModal(){
    // select the modal and remove it
    const modal = document.querySelector(".modal");
    modal.remove();

    // reset tab indexes to 0 to they can be focused on again;
    input.tabIndex = "0";
    overlayButtons.forEach(button => button.tabIndex = "0");
    resetButton.tabIndex = "0";
    const videos = document.querySelectorAll("videos");
    videos.forEach(video => video.tabIndex = "0");
}


// <========== Event listeners ==========>
document.addEventListener("DOMContentLoaded", restoreLastSession);

overlayButtons.forEach(button => button.addEventListener("click", (event) => {
    checkDate(input.value, event.target);
}))

resetButton.addEventListener("click", resetAllTiles);