let searchInputEl = document.getElementById("searchInput");

let spinnerEl = document.getElementById("spinner");
let searchResultContainer = document.getElementById("searchResultContainer");
let allSearchResultsContainer = document.createElement("ul");
allSearchResultsContainer.setAttribute("id", "searchResults");

let allSearchOption = document.getElementById("allSearchOption");
let imageSearchOption = document.getElementById("imageSearchOption");

// fetching the each result from wikipedia and appending to a container
function createAndAppendSearchResult(result) {
    let { link, title, description } = result;
    // creating search result card
    let resultItemEl = document.createElement("li");
    resultItemEl.classList.add("result-item");

    //creating text link for each search result
    let titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultItemEl.appendChild(titleEl);

    let titleBreakEl = document.createElement("br");
    resultItemEl.appendChild(titleBreakEl);

    // creating url link for each search result
    let urlEl = document.createElement("a");
    urlEl.classList.add("result-url");
    urlEl.href = link;
    urlEl.target = "_blank";
    urlEl.textContent = link;
    resultItemEl.appendChild(urlEl);

    let linkBreakEl = document.createElement("br");
    resultItemEl.appendChild(linkBreakEl);

    // creating description for each search result
    let descriptionEl = document.createElement("p");
    descriptionEl.classList.add("link-description");
    descriptionEl.textContent = description;
    resultItemEl.appendChild(descriptionEl);
    allSearchResultsContainer.appendChild(resultItemEl);
}
//function for creating each search result
function displayResults(searchResults) {
    spinnerEl.classList.add("d-none");
    for (let result of searchResults) {
        createAndAppendSearchResult(result);
    }
}
let searchInput = null;
async function searchWikipedia(event) {
    searchInput = searchInputEl.value.trim();
    searchResultContainer.textContent = "";
    searchResultContainer.appendChild(allSearchResultsContainer);
    let loadUrls = async () => {
        let url = `https://apis.ccbp.in/wiki-search?search=${searchInput}`;
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            const { search_results } = jsonData;
            return search_results;
        } catch (e) {
            console.log(`Error occured ${e.message}`);
        }
    };

    let search_results = null;
    if (event.type == "keydown" && event.key == "Enter") {
        allSearchResultsContainer.textContent = "";
        spinnerEl.classList.remove("d-none");
        let searchOptionsNavBar = document.getElementsByClassName(
            "search-options-nav-bar"
        )[0];
        let searchNavBar = document.getElementsByClassName("search-navbar")[0];
        if (searchInput !== "") {
            try {
                search_results = await loadUrls();
            } catch (error) {
                console.log(error);
            }
            console.log("keydown", search_results);
            searchOptionsNavBar.classList.add("d-none");
            searchNavBar.style.border = "none";
            if (search_results.length == 0) {
                searchOptionsNavBar.classList.add("d-none");
                searchNavBar.style.border = "none";
                spinnerEl.classList.add("d-none");
                alert("No results found");
            } else {
                searchNavBar.style.borderBottom = "1px solid #edecec";
                searchOptionsNavBar.classList.remove("d-none");
                displayResults(search_results);
            }
        }
    } else if (event.type == "click") {
        try {
            search_results = await loadUrls();
            console.log("click event", search_results);
            allSearchResultsContainer.textContent = "";
            displayResults(search_results);
        } catch (error) {
            console.log(error);
        }
    }
}

searchInputEl.addEventListener("keydown", searchWikipedia);
allSearchOption.addEventListener("click", searchWikipedia);

function loadImages(imageResults) {
    let imageResultsContainer = document.createElement("ul");
    imageResultsContainer.classList.add("image-results", "grid");
    imageResultsContainer.setAttribute("id", "imageResultsContainer");
    imageResultsContainer.textContent = "";
    searchResultContainer.appendChild(imageResultsContainer);
    imageResults.forEach((eachImageCard) => {
        let { displayText, thumbnail } = eachImageCard;
        let imageCard = document.createElement("li");
        imageCard.classList.add("grid-item");
        imageResultsContainer.appendChild(imageCard);

        let titleEl = document.createElement("p");
        titleEl.textContent = displayText;

        let image = document.createElement("img");
        image.setAttribute("src", thumbnail.thumbnailUrl);
        imageCard.appendChild(image);
        imageCard.appendChild(titleEl);
        image.style.width = "100%";
        // console.log(eachImageCard.displayText);
        // console.log(eachImageCard.thumbnail.thumbnailUrl);
    });
}

async function getImages() {
    const url = `https://bing-image-search1.p.rapidapi.com/images/search?q=${searchInput}`;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "a8238a2460msh79cb8ef2f578effp19b16fjsn1696f7c57b91",
            "X-RapidAPI-Host": "bing-image-search1.p.rapidapi.com",
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        searchResultContainer.textContent = "";
        if (result.queryExpansions != undefined) {
            console.log("image results", result.queryExpansions);
            console.log(result);
            loadImages(result.queryExpansions);
        } else {
            alert("no image found");
            console.log(result);
        }
    } catch (error) {
        console.error(error);
    }
}

let imageResultsContainer = document.getElementById("imageResultsContainer");
imageSearchOption.addEventListener("click", getImages);
