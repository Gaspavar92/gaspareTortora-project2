
// Creating namespace for web application
const findTvShowApp = {};

// Creating variables to target DOM elements

findTvShowApp.$search = $(".submit-search");
findTvShowApp.$searchBar = $(".search-bar");
findTvShowApp.$showName = ""; //User Input
findTvShowApp.$showTitle = ""; // Show title that is clicked
findTvShowApp.$tvShowList = $(".tv-show-container");
findTvShowApp.$noImage = "./assets/No-image-found.jpg";
findTvShowApp.$tvShowSummary = $(".tv-show-summary");
findTvShowApp.$showID = "";
findTvShowApp.$tvShowInformation = $(".tv-show-information");
findTvShowApp.$genres = [];
findTvShowApp.$xButton = $(".close-button");


// Creating function to get the show and display results
findTvShowApp.getShowTitle = () => {
    $.ajax({
        url: `https://api.tvmaze.com/search/shows?q=${findTvShowApp.$showName}`,
        dataType: "json",
        method: "GET"
    }).then((response) => {
        findTvShowApp.$tvShowList.empty();
        for (let i = 0; i < response.length; i++) {
            if (response[i].show.image === null && response[i].show.rating.average !== null) {
                findTvShowApp.displayTvShows(response[i].show.name, findTvShowApp.$noImage, response[i].show.rating.average, response[i].show.id);
            } else if (response[i].show.rating.average === null && response[i].show.image !== null) {
                findTvShowApp.displayTvShows(response[i].show.name, response[i].show.image.original, "No rating", response[i].show.id)
            } else if (response[i].show.image === null && response[i].show.rating.average == null) {
                findTvShowApp.displayTvShows(response[i].show.name, findTvShowApp.$noImage, "No rating", response[i].show.id)
            } else {
                findTvShowApp.displayTvShows(response[i].show.name, response[i].show.image.original, response[i].show.rating.average, response[i].show.id);
            }
        }
    }).catch(() => {
        alert("Something went wrong...");
    });
}

//Creating function to retrieve show title from user

findTvShowApp.getUserInput = () => {
    findTvShowApp.$search.on("click", (event) => {
        event.preventDefault();
        findTvShowApp.$tvShowList.removeClass("hide");
        findTvShowApp.$tvShowSummary.addClass("hide");
        findTvShowApp.$showName = findTvShowApp.$searchBar[0].value;
        findTvShowApp.getShowTitle();
        findTvShowApp.$xButton.empty();
    })
}

// Creating a function to dynamically display the results on the page

findTvShowApp.displayTvShows = (title, image, rating, id) => {
    findTvShowApp.$tvShowList.append(
        `<div class="tv-show" id="${id}">
            <h2>${title}</h2><p class="rating">${rating}</p>
            <img src="${image}">
        </div>`
    );
}

// Creating a function to get more information about the show and display them in a new window

findTvShowApp.displayTvShowInfo = () => {
    $.ajax({
        url: `https://api.tvmaze.com/search/shows?q=${findTvShowApp.$showTitle}`,
        dataType: "json",
        method: "GET"
    }).then((response) => {
        for (let index = 0; index < response.length; index++) {
            if (response[index].show.id == findTvShowApp.$showID) {
                    response[index].show.genres.forEach((result) => {
                        if (result != undefined) {
                            findTvShowApp.$genres.push(result);
                        }
                })
                findTvShowApp.$tvShowInformation.empty();
                if (findTvShowApp.$genres.length > 0 && response[index].show.rating.average !== null && response[index].show.image === null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, response[index].show.rating.average, response[index].show.summary, findTvShowApp.$genres, findTvShowApp.$noImage);
                } else if (findTvShowApp.$genres.length == 0 && response[index].show.rating.average !== null && response[index].show.image === null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, response[index].show.rating.average, response[index].show.summary, "N/A", findTvShowApp.$noImage);
                } else if (findTvShowApp.$genres.length == 0 && response[index].show.rating.average === null && response[index].show.image === null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, "No rating", response[index].show.summary, "N/A", findTvShowApp.$noImage);
                } else if (findTvShowApp.$genres.length > 0 && response[index].show.rating.average === null && response[index].show.image === null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, "No rating", response[index].show.summary, findTvShowApp.$genres, findTvShowApp.$noImage);
                } else if (findTvShowApp.$genres.length > 0 && response[index].show.rating.average !== null && response[index].show.image !== null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, response[index].show.rating.average, response[index].show.summary, findTvShowApp.$genres, response[index].show.image.original);
                } else if (findTvShowApp.$genres.length == 0 && response[index].show.rating.average !== null && response[index].show.image !== null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, response[index].show.rating.average, response[index].show.summary, "N/A", response[index].show.image.original);
                } else if (findTvShowApp.$genres.length == 0 && response[index].show.rating.average === null && response[index].show.image !== null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, "No rating", response[index].show.summary, "N/A", response[index].show.image.original);
                } else if (findTvShowApp.$genres.length > 0 && response[index].show.rating.average === null && response[index].show.image !== null) {
                    findTvShowApp.displaySelectedShow(response[index].show.name, response[index].show.language, "No rating", response[index].show.summary, findTvShowApp.$genres, response[index].show.image.original);
                }
                findTvShowApp.$genres = [];
            }
        }
    }).catch("Something went wrong...")
}

// Creating a function to grab more information about the show and dynamically show them in a new window

findTvShowApp.displaySelectedShow = (name, language, rating, summary, genres, image) => {
    findTvShowApp.$tvShowInformation.append(
        `<div class="tile-container">
        <img src="${image}" class="show-image">
        <div class="trg">
            <div class="title">Name of the show: ${name}</div>
            <div class="rating">Rating: ${rating}</div>
            <div class="genres">Genres: ${genres}</div>
        </div>
        </div>
        <div class="language">This show is in ${language}</div>
        <h2>About the show:</h2>
        <div class="summary">${summary}</div>`
    )
    findTvShowApp.$xButton.append(
        `<button>X</button>`
    )
}


// Creating a function that shows more information about the show that is clicked and hides all the others

findTvShowApp.clickOnShow = () => {
    findTvShowApp.$tvShowList.on("click", (tile) => {
        findTvShowApp.$tvShowList.addClass("hide");
        findTvShowApp.$tvShowSummary.removeClass("hide");
        findTvShowApp.$showTitle = tile.target.parentElement.firstElementChild.innerText;
        findTvShowApp.$showID = tile.target.parentElement.id;
        findTvShowApp.displayTvShowInfo();
    })
}

// Creating a function to close the window with information about the show when the X is clicked

findTvShowApp.clickOnX = () => {
    findTvShowApp.$xButton.on("click", () => {
        findTvShowApp.$xButton.empty();
        findTvShowApp.$tvShowList.removeClass("hide");
        findTvShowApp.$tvShowSummary.addClass("hide");
    })
}

// Creating initialization function
findTvShowApp.init = () => {
    findTvShowApp.getUserInput();
    findTvShowApp.getShowTitle();
    findTvShowApp.clickOnShow(); //move into displayTvShowInfo at the end
    findTvShowApp.clickOnX();
}

// Running application as soon as the document is ready
$(document).ready(() => {
    findTvShowApp.init();
});